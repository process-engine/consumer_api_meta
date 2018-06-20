'use strict';

import * as fs from 'fs';
import * as path from 'path';

import {ConsumerApiClientService, InternalAccessor} from '@process-engine/consumer_api_client';

import {InvocationContainer} from 'addict-ioc';

// This function will be called by the setup, when registering ioc modules at the container.
export function registerInContainer(container: InvocationContainer): void {

  // Creates a custom ioc registration for the ConsumerApiClientService and its dependencies.

  container.register('ConsumerApiInternalAccessor', InternalAccessor)
    .dependencies('ConsumerApiService');

  container.register('ConsumerApiClientService', ConsumerApiClientService)
    .dependencies('ConsumerApiInternalAccessor');

  // Register the sample process at the ioc container.
  const processFilename: string = 'sample_process';
  const processFilePath: string = path.join(__dirname, '..', '..', 'bpmn', `${processFilename}.bpmn`);
  const processFile: string = fs.readFileSync(processFilePath, 'utf8');

  container.registerObject(processFilename, processFile)
    .setTag('bpmn_process', 'internal')
    .setTag('module', 'process_engine_meta')
    .setTag('path', processFilePath);
}
