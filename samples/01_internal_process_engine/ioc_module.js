'use strict';

const fs = require('fs');
const path = require('path');

const ConsumerApiClientService = require('@process-engine/consumer_api_client').ConsumerApiClientService;

// This function will be called by the setup, when registering ioc modules at the container.
const registerInContainer = (container) => {

  // Creates a custom ioc registration for the ConsumerApiClientService. 
  // It will be injected with an accessor for accessing an internal process engine application.
  container.register('ConsumerApiClientService', ConsumerApiClientService)
    .dependencies('ConsumerApiInternalAccessor');

  // Register the sample process at the ioc container.
  const processFilename = 'sample_process';
  const processFilePath = path.join(__dirname, 'bpmn', `${processFilename}.bpmn`);
  const processFile = fs.readFileSync(processFilePath, 'utf8');

  return container.registerObject(processFilename, processFile)
    .setTag('bpmn_process', 'internal')
    .setTag('module', 'process_engine_meta')
    .setTag('path', processFilePath);
};

module.exports.registerInContainer = registerInContainer;
