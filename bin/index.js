const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();
const promptProvider = require('./promptProvider');
const delegateTypes = require('./delegateTypes');

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

const writeManifest = (manifest) => {
  console.log(manifest);
};

const addDelegatePrompt = (manifest) => {
  console.log('add delegate');
  inquirer.prompt(promptProvider.getAddDelegatePrompt())
    .then(({ addDelegate }) => {
      if (addDelegate) {
        inquirer.prompt(promptProvider.getChooseDelegateTypePrompt())
          .then(({ delegateType }) => {
            inquirer.prompt(promptProvider.getDelegatePromptsByType(delegateType))
              .then((descriptor) => {
                delegateTypes[delegateType].addToManifest(manifest, descriptor);
                addDelegatePrompt(manifest);
              });
          });
      } else {
        writeManifest(manifest);
      }
    })
};

const main = () => {
  const manifest = readManifest();
  inquirer.prompt(promptProvider.getTopLevelPromptsForUndefinedFields(manifest))
    .then((answers) => {
      Object.assign(manifest, answers);
      addDelegatePrompt(manifest);
    });
};

main();
