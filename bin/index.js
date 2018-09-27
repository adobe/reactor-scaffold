#!/usr/bin/env node

/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

const inquirer = require('inquirer');
const clone = require('clone');
const path = require('path');
const fs = require('fs-extra');
const camelCase = require('camelcase');
const webSchema = require('@adobe/reactor-turbine-schemas/schemas/extension-package-web.json');
const mobileSchema =
  require('@adobe/reactor-turbine-schemas/schemas/extension-package-mobile.json');
const validate = require('@adobe/reactor-validator');
const delegatesMeta = require('./delegateMeta');
const chalk = require('chalk');

const cwd = process.cwd();
const VIEW_PATH = 'src/view/';
const LIB_PATH = 'src/lib/';
const EXTENSION_GUIDE_URL = 'https://developer.adobelaunch.com/guides/extensions/';

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
    const viewDestPath =
      path.posix.join(cwd, manifest.viewBasePath, manifest.configuration.viewPath);
    copyFile(viewSrcPath, viewDestPath);
  }
};

const writeStandardDelegates = (manifest, prevManifest, delegateMeta) => {
  const nodeName = delegateMeta.manifestNodeName;

  if (manifest[nodeName]) {
    const viewSrcPath = delegateMeta.viewTemplatePath;

    manifest[nodeName]
    .filter((descriptor) => {
      return !prevManifest[nodeName] ||
        !prevManifest[nodeName].some((prevDescriptor) => prevDescriptor.name === descriptor.name);
    }).forEach((descriptor) => {
      if (descriptor.viewPath) {
        const viewDestPath = path.join(cwd, manifest.viewBasePath, descriptor.viewPath);
        copyFile(viewSrcPath, viewDestPath);
      }

      // Web extensions should always have this, but just in case
      if (manifest.platform === 'web' && descriptor.libPath) {
        const libSrcPath = delegateMeta.libTemplatePath;
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
};

const buildConfigurationDescriptor = (manifest) => {
  manifest.configuration = {
    viewPath: 'configuration/configuration.html',
    schema: require(delegatesMeta.extensionConfiguration.schemaTemplatePath)
  };
};

const addExchangeUrl = (manifest) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'exchangeUrl',
      message: 'Please provide the URL to your extension\'s listing on Adobe Exchange.',
      validate(input) {
        if (!input.length) {
          return 'Required.';
        }

        if (
          !input.match(
            /^https:\/\/www\.adobeexchange\.com\/experiencecloud\.details\..+\.html$/gi
          )
        ) {
          return (
            'Must match the pattern ' +
            '"https://www.adobeexchange.com/experiencecloud.details.######.html".'
          );
        }

        return true;
      }
    }
  ]).then(({ exchangeUrl }) => {
    if (exchangeUrl) {
      manifest.exchangeUrl = exchangeUrl;
    }
  });
};

const addIconPath = (manifest) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'iconPath',
      message: 'The relative path to the icon that will be displayed for the extension within ' +
        'Launch. It should not not begin with a slash. It must reference an SVG file with a .svg ' +
        'extension. The SVG should be square and may be scaled by Launch.',
      validate(input) {
        if (!input.length) {
          return 'Required.';
        }

        if (!input.match(/^(?!\/).+$/gi)) {
          return 'Must not start with a "/".';
        }

        if (!input.match(/\.svg$/gi)) {
          return 'The icon must have a .svg extension.';
        }

        return true;
      }
    }
  ]).then(({ iconPath }) => {
    if (iconPath) {
      const iconPathOnDisk = path.join(cwd, iconPath);
      if (!fs.existsSync(iconPathOnDisk)) {
        console.log(
          chalk.yellow(
            `Please don't forget to add an icon at the following location: "${iconPathOnDisk}".`
          )
        );
      }

      manifest.iconPath = iconPath;
    }
  });
};

const buildStandardDescriptor = (manifest, delegateMeta) => {
  const invalidNames = (manifest[delegateMeta.manifestNodeName] || [])
    .map((existingDescriptor) => existingDescriptor.name);

  const questions = [
    getDisplayNamePrompt(delegateMeta.nameSingular),
  ];
  if (manifest.platform === 'web') {
    questions.push(getViewPrompt(delegateMeta.nameSingular));
  }

  return inquirer.prompt(questions).then(({ displayName, needsView = true }) => {
    const name = deriveNameFromDisplayName(displayName, invalidNames);
    const descriptor = {
      displayName,
      name,
      schema: require(delegateMeta.schemaTemplatePath[manifest.platform])
    };

    if (manifest.platform === 'web') {
      descriptor.libPath =
        path.posix.join(LIB_PATH, delegateMeta.manifestNodeName, camelCase(name) + '.js');
    }

    if (needsView) {
      descriptor.viewPath =
        path.posix.join(delegateMeta.manifestNodeName, camelCase(name) + '.html');
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
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the shared module? Other extensions will access the ' +
        'shared module by this name. It must consist of lowercase, URL-safe characters.',
      validate(input) {
        if (invalidNames.indexOf(input) !== -1) {
          return input + ' is already being used.';
        }

        if (!new RegExp(webSchema.definitions.name.pattern).test(input)) {
          return 'Required. Must consist of lowercase, URL-safe characters.'
        }

        return true;
      }
    }
  ]).then(({ name }) => {
    const descriptor = {
      name,
      libPath: path.posix.join(LIB_PATH, delegateMeta.manifestNodeName, camelCase(name) + '.js')
    };

    manifest[delegateMeta.manifestNodeName] = manifest[delegateMeta.manifestNodeName] || [];
    manifest[delegateMeta.manifestNodeName].push(descriptor);
  });
};

const buildMavenRepository = (answers) => {
  return inquirer.prompt([{
    type: 'input',
    name: 'className',
    default: 'com.mycompany.myExtension',
    message: 'For Android, what is the fully qualified Java class name of your extension? This is how Android ' +
      'developers will import your extension in their application.',
    validate(input) {
      if (!new RegExp(mobileSchema.definitions.javaClassName.pattern).test(input)) {
        return 'Required. Must be a valid fully qualified Java class name that contains word ' +
          'characters, underscores, and dots.'
      }

      return true;
    }
  },{
    type: 'input',
    name: 'artifact',
    default: 'com.mycompany.myextension:my-extension:1.0.0',
    message: 'For Android, we use Maven for dependency management. What is the fully qualified artifact name? ' +
      'This is in the form of <groupId>:<artifactId>:<version> You can choose whatever name you want with ' +
      'lowercase letters and no strange symbols.',
    validate(input) {
      if (!new RegExp(mobileSchema.definitions.mavenFQArtifactName.pattern).test(input)) {
        return 'Required. Must be in the form of <groupId>:<artifactId>:<version>'
      }

      return true;
    }
  }]).then(repositoryAnswers => {
    answers.repositories = [{
      ...repositoryAnswers
    }];

    return answers;
  });
};

const buildCocoapodRepository = (answers) => {
  return inquirer.prompt([{
    type: 'input',
    name: 'name',
    default: 'myPod',
    message: 'For iOS, we use Cocoapods for dependency management. What is the name of the pod?',
    validate(input) {
      if (!input.length) {
          return 'Required. Must consist of word characters or dots.'
        }

      return true;
    }
  },{
    type: 'input',
    name: 'headerName',
    default: 'MyExtension/MyExtension.h',
    message: 'For iOS, what is the header name? This is how iOS developers will include your framework. ' +
      'This is in the form of Framework_name/Header_filename.h',
    validate(input) {
      if (!new RegExp(mobileSchema.definitions.iosHeaderName.pattern)
        .test(input)) {
          return 'Required. Must have a framework name and a header file'
        }

      return true;
    }
  },{
    type: 'input',
    name: 'interface',
    default: 'MyExtension',
    message: 'For iOS, what is the name of your extension interface? This is how iOS developers will ' +
      'register your extension',
    validate(input) {
      if (!new RegExp(mobileSchema.definitions.iosInterface.pattern)
        .test(input)) {
          return 'Required. Must be a valid identifier.'
        }

      return true;
    }
  },{
    type: 'input',
    name: 'version',
    message: 'For iOS, what is the pod version?',
    default: '1.0.0',
    validate(input) {
      if (!new RegExp(mobileSchema.definitions.podVersion.pattern).test(input)) {
        return 'Required. Must match semantic versioning rules.';
      }

      return true;
    }
  }]).then(repositoryAnswers => {
    answers.repositories.push({
      ...repositoryAnswers
    });

    return answers;
  });
};

const promptMainMenu = (manifest) => {
  const choices = [];

  if (!manifest.configuration) {
    choices.push({
      name: 'Add an extension configuration view',
      value: buildConfigurationDescriptor
    });
  }

  choices.push(
    {
      name: 'Add an event type',
      value: buildStandardDescriptor.bind(this, manifest, delegatesMeta.event)
    },
    {
      name: 'Add a condition type',
      value: buildStandardDescriptor.bind(this, manifest, delegatesMeta.condition)
    },
    {
      name: 'Add an action type',
      value: buildStandardDescriptor.bind(this, manifest, delegatesMeta.action)
    },
    {
      name: 'Add a data element type',
      value: buildStandardDescriptor.bind(this, manifest, delegatesMeta.dataElement)
    }
  );

  if (manifest.platform === 'web') {
    choices.push({
      name: 'Add a shared module',
      value: buildSharedModule
    });
  }

  if (manifest.platform === 'web' && !manifest.exchangeUrl) {
    choices.push({
      name: 'Add an Exchange URL',
      value: addExchangeUrl
    });
  }

  if (!manifest.iconPath) {
    choices.push({
      name: 'Add an icon path',
      value: addIconPath
    });
  }

  choices.push(
    new inquirer.Separator(),
    {
      name: 'I\'m done.',
      value: () => {
        return Promise.resolve(true);
      }
    },
    new inquirer.Separator()
  );

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
    message: `What is the display name of the ${nameSingular}? ` +
      `This will be shown to users of Launch.`,
    validate(input) {
      if (!input.length) {
        return 'Required.';
      }

      return true;
    }
  };
};

const deriveNameFromDisplayName = (displayName, invalidNames = []) => {
  let suffixIncrementor = 0;
  let name;

  do {
    // Attempt making a decent default name based on the display name they provided.
    // If the produced name is already used, start adding an incremental
    // prefix (name-1, name-2, etc.)
    name = displayName
      .toLowerCase()
      // Replaces spaces with hyphens
      .replace(/\s+/g, '-')
      // Removes URL-unsafe characters
      .replace(/[^a-z0-9~_.-]/g, '')
      // Turns Dun & Bradstreet into dun-bradstreet instead of dun--bradstreet
      .replace(/-{2,}/g, '-');

    if (suffixIncrementor) {
      name += '-' + suffixIncrementor;
    }

    suffixIncrementor++;
  } while (invalidNames.indexOf(name) !== -1);

  return name
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
    {
      type: 'input',
      name: 'displayName',
      message: 'What is the display name of your extension? ' +
      'This will be shown to users of Launch. There is no need to mention ' +
      '"Launch" or "Extension"; users will already know they are looking at a Launch extension.',
      validate(input) {
        if (!input.length) {
          return 'Required.';
        }

        return true;
      }
    },
    {
      type: 'list',
      name: 'platform',
      message: 'What is the platform of your extension?',
      choices: ['web', 'mobile']
    },
    {
      type: 'input',
      name: 'version',
      message: 'What version would you like to start with?',
      default: '1.0.0',
      validate(input) {
        if (!new RegExp(webSchema.definitions.semver.pattern).test(input)) {
          return 'Required. Must match semantic versioning rules.';
        }

        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Please provide a short description of your extension. This will be shown to ' +
      'users of Launch. If your extension empowers users to implement your product on their ' +
      'website, describe what your product does. There is no need to mention "Launch" or ' +
      '"Extension"; users will already know they are looking at a Launch extension.',
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
    if (answers.platform === 'mobile') {
      return buildMavenRepository(answers);
    }
    return answers;
  }).then((answers) => {
    if (answers.platform === 'mobile') {
      return buildCocoapodRepository(answers);
    }
    return answers;
  }).then((answers) => {
    if (answers.displayName) {
      manifest.displayName = answers.displayName;
    }

    if (!manifest.name) {
      manifest.name = deriveNameFromDisplayName(manifest.displayName);
    }

    if (answers.platform) {
      manifest.platform = answers.platform;
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

    if (answers.exchangeUrl) {
      manifest.exchangeUrl = answers.exchangeUrl;
    }

    if (answers.iconPath) {
      manifest.iconPath = answers.iconPath;
    }

    if (answers.repositories) {
      manifest.repositories = answers.repositories;
    }

    // We could make this configurable, but then do we make where library files go configurable
    // as well? Then we would have to pass the library base path around separately since it's not a
    // direct property of the manifest like viewBasePath is.
    manifest.viewBasePath = manifest.viewBasePath || VIEW_PATH;
  });
};

const main = () => {
  const manifest = readManifest();
  const prevManifest = clone(manifest);

  console.log('Welcome to the scaffolding tool. Let\'s build the foundational structure for ' +
    'your extension. To learn more about the components of an extension, please reference the ' +
    'extension development guide at ' + EXTENSION_GUIDE_URL + '.');

  promptTopLevelFields(manifest)
    .then(() => promptMainMenu(manifest))
    .then(() => writeManifest(manifest, prevManifest))
    .then(() => {
      // We have to validate AFTER writing files because the validation checks to see if the
      // files exist.
      const error = validate(manifest);
      if (error) {
        return Promise.reject('Your extension does not pass validation. This could be a bug ' +
          'with the scaffold tool. Error: ' + error);
      }
    })
    .then(() => {
      console.log('Scaffolding complete. You may run the tool again at any time to add to your ' +
        'extension.');
    })
    .catch((error) => {
      console.error(error);
    });
};

main();
