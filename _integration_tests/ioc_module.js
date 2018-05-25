'use strict';

const fs = require('fs');
const path = require('path');

const registerInContainer = (container) => {

  const processes = [
    'test_consumer_api_correlation_result',
    'test_consumer_api_lanes',
    'test_consumer_api_non_executable_process',
    'test_consumer_api_process_start',
    'test_consumer_api_usertask',
    'test_consumer_api_sublane_normal_process',
    'test_consumer_api_sublanes_multiple_sublanes',
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
