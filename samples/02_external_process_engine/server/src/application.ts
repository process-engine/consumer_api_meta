import * as path from 'path';

import {InvocationContainer} from 'addict-ioc';
import {Logger} from 'loggerhythm';

import {HttpIntegrationTestBootstrapper} from '@essential-projects/http_integration_testing';

const logger: Logger = Logger.createLogger('test:bootstrapper');

// These are the names of the modules, whose ioc_modules will be included in the ioc container.
const iocModuleNames: Array<string> = [
  '@essential-projects/bootstrapper',
  '@essential-projects/bootstrapper_node',
  '@essential-projects/caching',
  '@essential-projects/core',
  '@essential-projects/data_model',
  '@essential-projects/data_model_contracts',
  '@essential-projects/datasource_adapter_base',
  '@essential-projects/datasource_adapter_postgres',
  '@essential-projects/datastore',
  '@essential-projects/datastore_http',
  '@essential-projects/datastore_messagebus',
  '@essential-projects/event_aggregator',
  '@essential-projects/feature',
  '@essential-projects/http_extension',
  '@essential-projects/http_integration_testing',
  '@essential-projects/iam',
  '@essential-projects/iam_http',
  '@essential-projects/invocation',
  '@essential-projects/messagebus',
  '@essential-projects/messagebus_http',
  '@essential-projects/messagebus_adapter_faye',
  '@essential-projects/metadata',
  '@essential-projects/security_service',
  '@essential-projects/services',
  '@essential-projects/routing',
  '@essential-projects/timing',
  '@essential-projects/validation',
  '@process-engine/consumer_api_http',
  '@process-engine/consumer_api_core',
  '@process-engine/process_engine',
  '@process-engine/process_engine_http',
  '@process-engine/process_repository',
  '../../', // This points to the top-level ioc module located in this sample.
];

// This imports all the listed ioc modules and stores them.
const iocModules: Array<any> = iocModuleNames.map((moduleName: string) => {
  return require(`${moduleName}/ioc_module`);
});

let bootstrapper: HttpIntegrationTestBootstrapper;

let container: InvocationContainer;

/**
 * Initializes the IoC container, starts the bootstrapper
 * and creates sample users for authentication purposes.
 *
 * @function start
 * @async
 */
async function start(): Promise<void> {

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

    const appPath: string = path.resolve(__dirname);

    // We use the integrationtest-bootstrapper here, because it provides us with an easy way to register users.
    // Also, the bootstrappers "reset" method allows us to clear those users from the database again.
    // This way, the sample application will in no way affect data consistency.
    bootstrapper = await container.resolveAsync<HttpIntegrationTestBootstrapper>('HttpIntegrationTestBootstrapper', [appPath]);

    const identityFixtures: Array<any> = [{
      // Register a default user that can access the sample process.
      name: 'sampleUser',
      password: 'pass',
      roles: ['user'],
    }];

    bootstrapper.addFixtures('User', identityFixtures);

    await bootstrapper.start();

    logger.info('Bootstrapper started.');

    // This will register a listener for the console.
    // When the process is given the interrupt-signal (i.e. ctrl+c),
    // all fixtures are cleared, before the shutdown is concluded.
    process.on('SIGINT', async() => {
      await shutdown();
      logger.info('Done. Shutting down server.');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start bootstrapper!', error);
    throw error;
  }
}

/**
 * Shuts the bootstrapper down and clears all fixtures from the database.
 *
 * @function shutdown
 * @async
 */
async function shutdown(): Promise<void> {
  logger.info('Cleaning fixtures...');
  await bootstrapper.reset();
  await bootstrapper.shutdown();
}

start();
