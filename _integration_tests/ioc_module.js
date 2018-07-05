'use strict';

const fs = require('fs');
const path = require('path');

const {
  ConsumerApiClientService,
  ExternalAccessor,
  InternalAccessor,
} = require('@process-engine/consumer_api_client');

const IamServiceMock = require('./dist/commonjs/iam_facade_mock').IamServiceMock;

const registerInContainer = (container) => {

  // This removes the necessity for having a running IdentityServer during testing.
  container.register('IamServiceNew', IamServiceMock)
    .singleton();

  const accessConsumerApiInternally = process.env.CONSUMER_API_ACCESS_TYPE === 'internal';

  if (accessConsumerApiInternally) {
    container.register('ConsumerApiInternalAccessor', InternalAccessor)
      .dependencies('ConsumerApiService');

    container.register('ConsumerApiClientService', ConsumerApiClientService)
      .dependencies('ConsumerApiInternalAccessor');
  } else {
    container.register('ConsumerApiExternalAccessor', ExternalAccessor)
      .dependencies('HttpService');

    container.register('ConsumerApiClientService', ConsumerApiClientService)
      .dependencies('ConsumerApiExternalAccessor');
  }

  const processes = [
    'test_consumer_api_correlation_result',
    'test_consumer_api_non_executable_process',
    'test_consumer_api_process_start',
    'test_consumer_api_usertask',
    'test_consumer_api_sublane_process',
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
