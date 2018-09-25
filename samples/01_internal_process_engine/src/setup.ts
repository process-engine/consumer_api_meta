import * as fs from 'fs';
import * as path from 'path';

import {InvocationContainer} from 'addict-ioc';
import {Logger} from 'loggerhythm';

import {AppBootstrapper} from '@essential-projects/bootstrapper_node';
import {IIdentity} from '@essential-projects/iam_contracts';

import {IProcessModelService} from '@process-engine/process_engine_contracts';

const logger: Logger = Logger.createLogger('ssample:internal:setup');

// These are the names of the modules, whose ioc_modules will be included in the ioc container.
const iocModuleNames: Array<string> = [
  '@essential-projects/bootstrapper',
  '@essential-projects/bootstrapper_node',
  '@essential-projects/event_aggregator',
  '@essential-projects/http_extension',
  '@essential-projects/services',
  '@essential-projects/timing',
  '@process-engine/consumer_api_core',
  '@process-engine/consumer_api_http',
  '@process-engine/correlations.repository.sequelize',
  '@process-engine/flow_node_instance.repository.sequelize',
  '@process-engine/iam',
  '@process-engine/metrics_api_core',
  '@process-engine/metrics.repository.file_system',
  '@process-engine/process_engine_core',
  '@process-engine/process_model.repository.sequelize',
  '@process-engine/timers.repository.sequelize',
  '.', // This points to the top-level ioc module located in this sample.
];

// This imports all the listed ioc modules and stores them.
const iocModules: Array<any> = iocModuleNames.map((moduleName: string) => {
  return require(`${moduleName}/ioc_module`);
});

let bootstrapper: AppBootstrapper;

let container: InvocationContainer;

/**
 * Initializes the IoC container and starts the bootstrapper.
 *
 * @function start
 * @async
 */
export async function start(): Promise<void> {

  try {
    // Create a new IoC container.
    // Using the InvocationContainer allows us to perform functions for each registered component,
    // whenever a new instance for that component is created.
    // In this case, we want the container to run the 'initialize' function for each registered component.
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

    bootstrapper = await container.resolveAsync<AppBootstrapper>('AppBootstrapper', [appPath]);

    await bootstrapper.start();

    logger.info('Bootstrapper started.');
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
export async function shutdown(): Promise<void> {
  const httpExtension: any = await container.resolveAsync('HttpExtension');
  await httpExtension.close();
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
 * This will create and return an Identity for the sample user.
 * The identity is required for accessing process models
 * and must be provided to ALL consumer api functions.
 *
 * @function createIdentity
 * @async
 * @returns An identity, which contains an JWT AuthToken for the user.
 */
export function createIdentity(): IIdentity {

  return <IIdentity> {
    token: 'defaultUser',
  };
}

/**
 * Imports the given ProcessModelFile into the database.
 *
 * @param processFileName The name of the ProcessModel to import.
 */
export async function registerProcess(processFileName: string): Promise<void> {

  const dummyIdentity: IIdentity = {
    token: 'defaultUser',
  };

  const xml: string = readProcessModelFromFile(processFileName);

  // Get the ProcessModelService, which ahndles the import of ProcessModels.
  const processModelService: IProcessModelService = await resolveAsync<IProcessModelService>('ProcessModelService');

  // Save the ProcessModel.
  await processModelService.persistProcessDefinitions(dummyIdentity, processFileName, xml, true);
}

/**
 * Reads the content of the given ProcessModelFile and imports it into the
 * database.
 *
 * @param fileName The name of the ProcessModelFile to read.
 */
function readProcessModelFromFile(fileName: string): string {

  const bpmnFolderLocation: string = getBpmnDirectoryPath();
  const processModelPath: string = path.join(bpmnFolderLocation, `${fileName}.bpmn`);

  const processModelAsXml: string = fs.readFileSync(processModelPath, 'utf-8');

  return processModelAsXml;
}

/**
 * Generate an absoulte path, which points to the bpmn directory.
 *
 * Checks if the cwd is "_integration_tests". If not, that directory name is appended.
 * This is necessary, because Jenkins uses a different cwd than the local machines do.
 */
function getBpmnDirectoryPath(): string {

  const bpmnDirectoryName: string = 'bpmn';
  const rootDirPath: string = process.cwd();

  return path.join(rootDirPath, bpmnDirectoryName);
}
