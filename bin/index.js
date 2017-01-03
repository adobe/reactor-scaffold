#!/usr/bin/env node

const inquirer = require('inquirer');
const clone = require('clone');
const path = require('path');
const fs = require('fs-extra');
const camelCase = require('camelcase');
const schema = require('@reactor/turbine-schemas/schemas/extension-package.json');
const validate = require('@reactor/extension-support-validator');
const delegatesMeta = require('./delegateMeta');

const cwd = process.cwd();
const VIEW_PATH = 'src/view/';
const LIB_PATH = 'src/lib/';

const readManifest = () => {
  try {
    return JSON.parse(fs.readFileSync(path.join(cwd, 'extension.json'), {encoding: 'utf8'}));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {};
    } else {
      throw err;
    }
  }
};

const copyFile = (fromPath, toPath) => {
  try {
    fs.copySync(fromPath, toPath, { clobber: false });
  } catch (error) {
    console.log(`Error writing ${toPath}, but this train doesn't stop.`)
  }
};

const createViewBasePath = (manifest) => {
  fs.mkdirsSync(manifest.viewBasePath);
};

const writeExtensionConfiguration = (manifest, prevManifest) => {
  if (manifest.configuration && !prevManifest.configuration) {
    const viewSrcPath = delegatesMeta.extensionConfiguration.viewTemplatePath;
    const viewDestPath = path.join(cwd, manifest.viewBasePath, manifest.configuration.viewPath);
    copyFile(viewSrcPath, viewDestPath);
  }
};

const writeStandardDelegates = (manifest, prevManifest, delegateMeta) => {
  const nodeName = delegateMeta.manifestNodeName;

  if (manifest[nodeName]) {
    const viewSrcPath = delegateMeta.viewTemplatePath;
    const libSrcPath = delegateMeta.libTemplatePath;

    manifest[nodeName]
    .filter((descriptor) => {
      return !prevManifest[nodeName] ||
        !prevManifest[nodeName].some((prevDescriptor) => prevDescriptor.name === descriptor.name);
    }).forEach((descriptor) => {
      if (descriptor.viewPath) {
        const viewDestPath = path.join(cwd, manifest.viewBasePath, descriptor.viewPath);
        copyFile(viewSrcPath, viewDestPath);
      }

      if (descriptor.libPath) { // This should always be the case but just in case
        const libDestPath = path.join(cwd, descriptor.libPath);
        copyFile(libSrcPath, libDestPath);
      }
    });
  }
};

const writeManifest = (manifest, prevManifest) => {
  createViewBasePath(manifest);
  writeExtensionConfiguration(manifest, prevManifest);

  [
    delegatesMeta.event,
    delegatesMeta.condition,
    delegatesMeta.action,
    delegatesMeta.dataElement,
    delegatesMeta.sharedModule
  ].forEach(writeStandardDelegates.bind(this, manifest, prevManifest));

  fs.writeJsonSync(path.join(cwd, 'extension.json'), manifest);

  // We have to validate AFTER writing files because the validation checks to see if the
  // files exist.
  const error = validate(manifest);

  if (error) {
    console.error('Your extension does not pass validation. This could be a bug with the ' +
      'scaffold tool. Error: ' + error);
  }
};

const buildConfigurationDescriptor = (manifest) => {
  manifest.configuration = {
    viewPath: 'configuration/configuration.html',
    schema: require(delegatesMeta.extensionConfiguration.schemaTemplatePath)
  };
};

const buildStandardDescriptor = (manifest, delegateMeta) => {
  const invalidNames = (manifest[delegateMeta.manifestNodeName] || [])
    .map((existingDescriptor) => existingDescriptor.name);

  return inquirer.prompt([
    getDisplayNamePrompt(delegateMeta.nameSingular),
    getNamePrompt(delegateMeta.nameSingular, invalidNames),
    getViewPrompt(delegateMeta.nameSingular)
  ]).then(({ displayName, name, needsView }) => {
    const descriptor = {
      displayName,
      name,
      libPath: path.join(LIB_PATH, delegateMeta.manifestNodeName, camelCase(name) + '.js'),
      schema: require(delegateMeta.schemaTemplatePath)
    };

    if (needsView) {
      descriptor.viewPath = path.join(delegateMeta.manifestNodeName, camelCase(name) + '.html');
    }

    manifest[delegateMeta.manifestNodeName] = manifest[delegateMeta.manifestNodeName] || [];
    manifest[delegateMeta.manifestNodeName].push(descriptor);
  });
};

const buildSharedModule = (manifest) => {
  const delegateMeta = delegatesMeta.sharedModule;
  const invalidNames = (manifest[delegateMeta.manifestNodeName] || [])
    .map((existingDescriptor) => existingDescriptor.name);

  return inquirer.prompt([
    getNamePrompt(delegateMeta.nameSingular, invalidNames)
  ]).then(({ name }) => {
    const descriptor = {
      name,
      libPath: path.join(LIB_PATH, delegateMeta.manifestNodeName, camelCase(name) + '.js')
    };

    manifest[delegateMeta.manifestNodeName] = manifest[delegateMeta.manifestNodeName] || [];
    manifest[delegateMeta.manifestNodeName].push(descriptor);
  });
};

const promptMainMenu = (manifest) => {
  const choices = [
    {
      name: 'Add an event delegate',
      value: buildStandardDescriptor.bind(this, manifest, delegatesMeta.event)
    },
    {
      name: 'Add a condition delegate',
      value: buildStandardDescriptor.bind(this, manifest, delegatesMeta.condition)
    },
    {
      name: 'Add an action delegate',
      value: buildStandardDescriptor.bind(this, manifest, delegatesMeta.action)
    },
    {
      name: 'Add a data element delegate',
      value: buildStandardDescriptor.bind(this, manifest, delegatesMeta.dataElement)
    },
    {
      name: 'Add a shared module',
      value: buildSharedModule
    },
    new inquirer.Separator(),
    {
      name: 'I\'m done.',
      value: () => {
        return Promise.resolve(true);
      }
    }
  ];

  if (!manifest.configuration) {
    choices.unshift({
      name: 'Add an extension configuration view',
      value: buildConfigurationDescriptor
    });
  }

  return inquirer.prompt({
    type: 'list',
    name: 'execute',
    message: 'What would you like to do?',
    choices
  })
  .then((answers) => answers.execute(manifest))
  .then((endMainMenu) => {
    if (!endMainMenu) {
      return promptMainMenu(manifest);
    }
  });
};

const getDisplayNamePrompt = (nameSingular) => {
  return {
    type: 'input',
    name: 'displayName',
    message: `What is the display name of the ${nameSingular}? This will be shown to users of DTM.`,
    validate(input) {
      if (!input.length) {
        return 'Required.';
      }

      return true;
    }
  };
};

const getNamePrompt = (nameSingular, invalidNames = []) => {
  return {
    type: 'input',
    name: 'name',
    message: `What is the name of the ${nameSingular}? This won't be shown to users of DTM; it's merely a simple identifier. It must consist of lowercase, URL-safe characters.`,
    default(answers) {
      if (answers.displayName) {
        // Attempt at making a decent default name based on the display name they provided.
        return answers.displayName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9~_.-]/g, '');
      }
    },
    validate(input) {
      if (invalidNames.indexOf(input) !== -1) {
        return input + ' is already being used.';
      }

      if (!new RegExp(schema.definitions.name.pattern).test(input)) {
        return 'Required. Must consist of lowercase, URL-safe characters.'
      }

      return true;
    }
  };
};

const getViewPrompt = (nameSingular) => {
  return {
    type: 'confirm',
    name: 'needsView',
    message: `Does this ${nameSingular} need a view for accepting settings from a user?`
  }
};

const promptTopLevelFields = (manifest) => {
  return inquirer.prompt([
    getDisplayNamePrompt('extension'),
    getNamePrompt('extension'),
    {
      type: 'input',
      name: 'version',
      message: 'What version would you like to start with?',
      default: '1.0.0',
      validate(input) {
        if (!new RegExp(schema.definitions.semver.pattern).test(input)) {
          return 'Required. Must match semantic versioning rules.';
        }

        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Please provide a short description of your extension.',
      validate(input) {
        if (!input.length) {
          return 'Required.';
        }

        return true;
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'Who is the author? This can be the name of an individual, company, or group.',
      validate(input) {
        if (!input.length) {
          return 'Required.';
        }

        return true;
      }
    }
  ].filter((prompt) => {
    return !manifest.hasOwnProperty(prompt.name);
  })).then((answers) => {
    if (answers.displayName) {
      manifest.displayName = answers.displayName;
    }

    if (answers.name) {
      manifest.name = answers.name;
    }

    if (answers.version) {
      manifest.version = answers.version;
    }

    if (answers.description) {
      manifest.description = answers.description;
    }

    if (answers.author) {
      manifest.author = {
        name: answers.author
      };
    }

    // We could make this configurable, but then do we make where library files go configurable
    // as well? Then we would have to pass the library base path around separately since it's not a
    // direct property of the manifest like viewBasePath is.
    manifest.viewBasePath = VIEW_PATH;
  });
};

const main = () => {
  const manifest = readManifest();
  const prevManifest = clone(manifest);

  promptTopLevelFields(manifest)
    .then(() => promptMainMenu(manifest))
    .then(() => writeManifest(manifest, prevManifest));
};

main();
