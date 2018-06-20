import {IAuthObject} from '@essential-projects/core_contracts';

import {InvocationContainer} from 'addict-ioc';
import {Logger} from 'loggerhythm';

import {ConsumerContext} from '@process-engine/consumer_api_contracts';

import {IHttpClient, IResponse} from '@essential-projects/http_contracts';

const logger: Logger = Logger.createLogger('test:bootstrapper');

// These are the names of the modules, whose ioc_modules will be included in the ioc container.
const iocModuleNames: Array<string> = [
  '@essential-projects/services',
  '.',
];

// This imports all the listed ioc modules and stores them.
const iocModules: Array<any> = iocModuleNames.map((moduleName: string) => {
  return require(`${moduleName}/ioc_module`);
});

let container: InvocationContainer;

/**
 * Initializes the IoC container.
 *
 * @function start
 * @async
 */
export async function start(): Promise<void> {

  try {
    // Create a new IoC container.
    // Using the InvocationContainer allows us to perform functions for each registered component,
    // whenever a new instance for that component is created.
    // In this case, we want the container to run the 'initialze' function for each registered component.
    container = new InvocationContainer({
      defaults: {
        conventionCalls: ['initialize'],
      },
    });

    // Register all the listed ioc modules at the container.
    for (const iocModule of iocModules) {
      iocModule.registerInContainer(container);
    }

    // Calling 'validateDependencies' ensures data consistency and detects misconfigurations
    // with the registered components, like circular-dependencies.
    container.validateDependencies();

    logger.info('IoC initialized.');
  } catch (error) {
    logger.error('Failed to initialze IoC!', error);
    throw error;
  }
}

/**
 * Resolves a module from the IoC container.
 * The resolved module will be cast into the designated type.
 *
 * @function resolveAsync
 * @async
 * @param moduleName  The name of the component to resolve.
 * @returns           The typecasted resolved compomnent
 *
 */
export async function resolveAsync<TTargetType>(moduleName: string): Promise<TTargetType> {
  return container.resolveAsync<TTargetType>(moduleName);
}

/**
 * This will create and return a ConsumerContext for the sampleUser.
 * The context is required for accessing process models
 * and must be provided to ALL consumer api functions.
 *
 * Note that this requires the sample server to be active, as this will perform a request against it.
 *
 * @function createConsumerContext
 * @async
 * @returns A consumer context, which contains an JWT AuthToken for the sample user.
 */
export async function createConsumerContext(): Promise<ConsumerContext> {
  const httpClient: IHttpClient = await resolveAsync<IHttpClient>('HttpService');

  const loginRoute: string = '/iam/login';

  const loginPayload: any = {
    username: 'sampleUser',
    password: 'pass',
  };

  const loginResult: IResponse<IAuthObject> = await httpClient.post<any, IAuthObject>(loginRoute, loginPayload);

  return <ConsumerContext> {
    identity: loginResult.result.token,
  };
}
