const delegateTypes = require('./delegateTypes');
const EXTENSION = 'extension';

const promptProvider = {
  getNamePrompt(itemType) {
    return {
      type: 'input',
      name: 'name',
      message: `What is the name of the ${itemType}?`
    };
  },
  getDisplayNamePrompt(itemType) {
    return {
      type: 'input',
      name: 'displayName',
      message: `What is the display name of the ${itemType}?`
    };
  },
  getAddDelegatePrompt() {
    return {
      type: 'confirm',
      name: 'addDelegate',
      message: 'Would you like to add a delegate to your extension?'
    };
  },
  getChooseDelegateTypePrompt() {
    return {
      type: 'list',
      name: 'delegateType',
      message: 'What type of delegate would you like to add?',
      choices: Object.keys(delegateTypes).map(type => delegateTypes[type].name)
    };
  },
  getDelegatePromptsByType(delegateType) {
    const promptsByDelegateType = {
      [delegateTypes.event.name]: [
        promptProvider.getNamePrompt(delegateType),
        promptProvider.getDisplayNamePrompt(delegateType)
      ],
      [delegateTypes.condition.name]: [
        promptProvider.getNamePrompt(delegateType),
        promptProvider.getDisplayNamePrompt(delegateType)
      ]
    };

    return promptsByDelegateType[delegateType];
  },
  getTopLevelPromptsForUndefinedFields(manifest) {
    return [
      promptProvider.getNamePrompt(EXTENSION),
      promptProvider.getDisplayNamePrompt(EXTENSION)
    ].filter((prompt) => {
      return !manifest.hasOwnProperty(prompt.name);
    });
  }
};

module.exports = promptProvider;
