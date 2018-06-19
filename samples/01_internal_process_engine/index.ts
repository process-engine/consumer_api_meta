import * as setup from './setup';

import * as uuid from 'uuid';

import {
  ConsumerContext,
  IConsumerApiService,
  ProcessStartRequestPayload,
  ProcessStartResponsePayload,
  StartCallbackType,
} from '@process-engine/consumer_api_contracts';

/**
 * This sample will use the ConsumerApiClientService to do the following:
 * - Start a process instance with the given processModelKey.
 * - Retrieve a list of waiting user tasks.
 * - Finish a waiting user task with the given result.
 * - Wait for the process to finish and the retrieve the result.
 *
 */
async function executeSampleProject(): Promise<void> {

  // Wait for the setup to finish and the bootstrapper to start
  await setup.start();

  const consumerContext: ConsumerContext = await setup.createConsumerContext();

  // Retrieve the consumerApiClientService.
  // It will be using an InternalAccessor for accessing a ProcessEngine
  // that is included with the application.
  const consumerApiClientService: IConsumerApiService =
    await setup.resolveAsync<IConsumerApiService>('ConsumerApiClientService');

  // The key of the process model to start.
  const processModelKey: string = 'sample_process';
  // The key of the start event with which to start the process instance.
  const startEventKey: string = 'StartEvent_1';

  // Adding a correlationId here is optional. If none is provided, the Consumer API will generate one.
  // The correlationId is used to associate multiple process instances with one another.
  // This is currently the case when using subprocesses.
  const payload: ProcessStartRequestPayload = {
    correlationId: uuid.v4(),
    inputValues: {},
  };

  // This will tell the Consumer API to resolve immediately after the process was started.
  // Note that this is the only way to handle waiting user tasks.
  // If you were to set this callback to 'CallbackOnProcessInstanceFinished' or 'CallbackOnEndEventReached',
  // the Consumer API would wait to resolve until the process is finished.
  // Which is not possible, if there is an interrupting user tasks.
  const startCallbackType: StartCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

  // Start the process instance and wait for the service to resolve.
  // The result returns the id of the correlation that the process instance was added to.
  const processStartResult: ProcessStartResponsePayload =
    await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

  // Get a list of all waiting user tasks, using the process model key and the correlation id.
}

executeSampleProject();
