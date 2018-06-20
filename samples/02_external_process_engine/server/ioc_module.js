'use strict';

const fs = require('fs');
const path = require('path');

// This function will be called by the setup, when registering ioc modules at the container.
const registerInContainer = (container) => {

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
