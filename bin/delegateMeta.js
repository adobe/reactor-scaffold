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

const path = require('path');

module.exports = {
  extensionConfiguration: {
    nameSingular: 'extension configuration',
    namePlural: 'extension configurations',
    manifestNodeName: 'configuration',
    viewTemplatePath: path.join(__dirname, '../templates/configuration.html'),
    schemaTemplatePath: path.join(__dirname, '../templates/configurationSchema.json')
  },
  event: {
    nameSingular: 'event',
    namePlural: 'events',
    manifestNodeName: 'events',
    viewTemplatePath: path.join(__dirname, '../templates/event.html'),
    libTemplatePath: path.join(__dirname, '../templates/event.js'),
    schemaTemplatePath: path.join(__dirname, '../templates/eventSchema.json')
  },
  condition: {
    nameSingular: 'condition',
    namePlural: 'conditions',
    manifestNodeName: 'conditions',
    viewTemplatePath: path.join(__dirname, '../templates/condition.html'),
    libTemplatePath: path.join(__dirname, '../templates/condition.js'),
    schemaTemplatePath: path.join(__dirname, '../templates/conditionSchema.json')
  },
  action: {
    nameSingular: 'action',
    namePlural: 'actions',
    manifestNodeName: 'actions',
    viewTemplatePath: path.join(__dirname, '../templates/action.html'),
    libTemplatePath: path.join(__dirname, '../templates/action.js'),
    schemaTemplatePath: path.join(__dirname, '../templates/actionSchema.json')
  },
  dataElement: {
    nameSingular: 'data element',
    namePlural: 'data elements',
    manifestNodeName: 'dataElements',
    viewTemplatePath: path.join(__dirname, '../templates/dataElement.html'),
    libTemplatePath: path.join(__dirname, '../templates/dataElement.js'),
    schemaTemplatePath: path.join(__dirname, '../templates/dataElementSchema.json')
  },
  sharedModule: {
    nameSingular: 'shared module',
    namePlural: 'shared modules',
    manifestNodeName: 'sharedModules',
    libTemplatePath: path.join(__dirname, '../templates/sharedModule.js')
  }
};
