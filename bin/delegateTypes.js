module.exports = {
  configuration: {
    name: 'extension configuration',
    addToManifest(manifest, descriptor) {
      manifest.configuration = descriptor;
    }
  },
  event: {
    name: 'event',
    addToManifest(manifest, descriptor) {
      manifest.events = manifest.events || [];
      manifest.events.push(descriptor);
    }
  },
  condition: {
    name: 'condition',
    addToManifest(manifest, descriptor) {
      manifest.conditions = manifest.conditions || [];
      manifest.conditions.push(descriptor);
    }
  },
  action: {
    name: 'action',
    addToManifest(manifest, descriptor) {
      manifest.actions = manifest.actions || [];
      manifest.actions.push(descriptor);
    }
  },
  dataElement: {
    name: 'data element',
    addToManifest(manifest, descriptor) {
      manifest.dataElements = manifest.dataElements || [];
      manifest.dataElements.push(descriptor);
    }
  },
  SHARED_MODULE: {
    name: 'shared module',
    addToManifest(manifest, descriptor) {
      manifest.sharedModules = manifest.sharedModules || [];
      manifest.sharedModules.push(descriptor);
    }
  }
};
