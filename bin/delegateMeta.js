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
    viewTemplatePath: {
      web: path.join(__dirname, '../templates/configuration.html'),
      edge: path.join(__dirname, '../templates/configuration.html'),
    },
    schemaTemplatePath: path.join(
      __dirname,
      '../templates/configurationSchema.json'
    ),
  },
  event: {
    nameSingular: 'event',
    namePlural: 'events',
    manifestNodeName: 'events',
    viewTemplatePath: { web: path.join(__dirname, '../templates/event.html') },
    libTemplatePath: { web: path.join(__dirname, '../templates/web/event.js') },
    schemaTemplatePath: {
      web: path.join(__dirname, '../templates/eventSchema.json'),
      mobile: path.join(__dirname, '../templates/mobileEventSchema.json'),
    },
  },
  condition: {
    nameSingular: 'condition',
    namePlural: 'conditions',
    manifestNodeName: 'conditions',
    viewTemplatePath: {
      web: path.join(__dirname, '../templates/condition.html'),
      edge: path.join(__dirname, '../templates/condition.html'),
    },
    libTemplatePath: {
      web: path.join(__dirname, '../templates/web/condition.js'),
      edge: path.join(__dirname, '../templates/edge/condition.js'),
    },
    schemaTemplatePath: {
      web: path.join(__dirname, '../templates/conditionSchema.json'),
      edge: path.join(__dirname, '../templates/conditionSchema.json'),
      mobile: path.join(__dirname, '../templates/mobileConditionSchema.json'),
    },
  },
  action: {
    nameSingular: 'action',
    namePlural: 'actions',
    manifestNodeName: 'actions',
    viewTemplatePath: {
      web: path.join(__dirname, '../templates/action.html'),
      edge: path.join(__dirname, '../templates/action.html'),
    },
    libTemplatePath: {
      web: path.join(__dirname, '../templates/web/action.js'),
      edge: path.join(__dirname, '../templates/edge/action.js'),
    },
    schemaTemplatePath: {
      web: path.join(__dirname, '../templates/actionSchema.json'),
      edge: path.join(__dirname, '../templates/actionSchema.json'),
      mobile: path.join(__dirname, '../templates/mobileActionSchema.json'),
    },
  },
  dataElement: {
    nameSingular: 'data element',
    namePlural: 'data elements',
    manifestNodeName: 'dataElements',
    viewTemplatePath: {
      web: path.join(__dirname, '../templates/dataElement.html'),
      edge: path.join(__dirname, '../templates/dataElement.html'),
    },
    libTemplatePath: {
      web: path.join(__dirname, '../templates/web/dataElement.js'),
      edge: path.join(__dirname, '../templates/edge/dataElement.js'),
    },
    schemaTemplatePath: {
      web: path.join(__dirname, '../templates/dataElementSchema.json'),
      edge: path.join(__dirname, '../templates/dataElementSchema.json'),
      mobile: path.join(__dirname, '../templates/mobileDataElementSchema.json'),
    },
  },
  sharedModule: {
    nameSingular: 'shared module',
    namePlural: 'shared modules',
    manifestNodeName: 'sharedModules',
    libTemplatePath: {
      web: path.join(__dirname, '../templates/web/sharedModule.js'),
    },
  },
};
