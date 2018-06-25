import * as setup from './setup';

import * as uuid from 'uuid';

import {Logger} from 'loggerhythm';

import {
  ConsumerContext,
  IConsumerApiService,
  ICorrelationResult,
  ProcessStartRequestPayload,
  ProcessStartResponsePayload,
  StartCallbackType,
  UserTask,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/consumer_api_contracts';

const logger: Logger = Logger.createLogger('consumer_api_sample:internal_process_engine');

/**
 * This sample will use the ConsumerApiClientService to do the following:
 * - Start a process instance with the given processModelKey.
 * - Retrieve a list of waiting user tasks.
 * - Finish a waiting user task with the given result.
 * - Wait for the process to finish and the retrieve the result.
 */
// tslint:disable:no-magic-numbers
async function executeSample(): Promise<void> {

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

  // The correlationId is used to associate multiple process instances with one another.
  // This is currently the case when using subprocesses.
  // Adding a correlationId here is optional. If none is provided, the Consumer API will generate one.
  // The property 'inputValues' can be used to provide parameters to the process instance's initial token.
  const payload: ProcessStartRequestPayload = {
    correlationId: uuid.v4(), // Note that correlation IDs must be unique!
    inputValues: {},
  };

  // This will tell the Consumer API to resolve immediately after the process was started.
  // Note that this is the only way to handle waiting user tasks.
  // If you were to set this callback to 'CallbackOnProcessInstanceFinished' or 'CallbackOnEndEventReached',
  // the Consumer API would wait to resolve until the process is finished.
  // Which is not possible, if there is an interrupting user task.
  const startCallbackType: StartCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

  // Start the process instance and wait for the service to resolve.
  // The result returns the id of the correlation that the process instance was added to.
  const processStartResult: ProcessStartResponsePayload =
    await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

  const correlationId: string = processStartResult.correlationId;

  // Allow for the process instance execution to reach the user task.
  await wait(500);

  // Get a list of all waiting user tasks, using the process model key and the correlation id.
  const waitingUserTasks: UserTaskList =
    await consumerApiClientService.getUserTasksForProcessModelInCorrelation(consumerContext, processModelKey, correlationId);

  // There should be one waiting user task.
  const userTask: UserTask = waitingUserTasks.userTasks[0];

  // Set a user task result and finish the user task.
  // Note that the keys contained in 'formFields' must each reflect a form field of the user task you want to finish.
  const userTaskResult: UserTaskResult = {
    formFields: {
      TaskWasSuccessful: true,
    },
  };

  await consumerApiClientService.finishUserTask(consumerContext, processModelKey, correlationId, userTask.key, userTaskResult);

  // Now wait for the process to finish´
  await wait(500);

  // Lastly, retrieve the process instance result through the Consumer API and print it.
  const processInstanceResult: ICorrelationResult =
    await consumerApiClientService.getProcessResultForCorrelation(consumerContext, correlationId, processModelKey);

  logger.info('The process instance was finished with the following result:', processInstanceResult);
}

async function wait(timeoutDuration: number): Promise<void> {

  // Allow for the process instance to proceed to the user task.
  await new Promise((resolve: Function, reject: Function): void => {
    setTimeout(() => {
      resolve();
    }, timeoutDuration);
  });
}

executeSample()
  .then(() => {
    process.exit(0);
  })
  .catch((error: Error): void => {
    logger.error('Something went wrong while running the sample!', error.message);
    process.exit(0);
  });
