'use strict';

const fs = require('fs');
const path = require('path');

const ConsumerApiClientService = require('@process-engine/consumer_api_client').ConsumerApiClientService;

const registerInContainer = (container) => {

  container.register('ConsumerApiClientService', ConsumerApiClientService)
    .dependencies('ConsumerApiInternalAccessor');

  const processes = [
    'sample_process'
  ];

  return processes.map((processFilename) => { return registerProcess(processFilename, container); });
};

const registerProcess = (processFilename, container) => {
  const processFilePath = path.join(__dirname, 'bpmn', `${processFilename}.bpmn`);
  const processFile = fs.readFileSync(processFilePath, 'utf8');

  return container.registerObject(processFilename, processFile)
    .setTag('bpmn_process', 'internal')
    .setTag('module', 'process_engine_meta')
    .setTag('path', processFilePath);
};

module.exports.registerInContainer = registerInContainer;
