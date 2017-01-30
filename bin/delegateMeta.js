/*!
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2016 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

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
