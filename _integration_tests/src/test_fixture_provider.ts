import * as path from 'path';

import {InvocationContainer} from 'addict-ioc';
import {Logger} from 'loggerhythm';

import {HttpIntegrationTestBootstrapper} from '@essential-projects/http_integration_testing';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {ConsumerContext, IConsumerApiService} from '@process-engine/consumer_api_contracts';
import {ExecutionContext, IImportProcessService} from '@process-engine/process_engine_contracts';

const logger: Logger = Logger.createLogger('test:bootstrapper');

const iocModuleNames: Array<string> = [
  '@essential-projects/bootstrapper',
  '@essential-projects/bootstrapper_node',
  '@essential-projects/event_aggregator',
  '@essential-projects/http_extension',
  '@essential-projects/http_integration_testing',
  '@essential-projects/services',
  '@process-engine/consumer_api_core',
  '@process-engine/consumer_api_http',
  '@process-engine/flow_node_instance.repository.sequelize',
  '@process-engine/iam',
  '@process-engine/process_engine',
  '@process-engine/process_model.repository.sequelize',
  '@process-engine/timers.repository.sequelize',
  '../../',
];

const iocModules: Array<any> = iocModuleNames.map((moduleName: string): any => {
  return require(`${moduleName}/ioc_module`);
});

export class TestFixtureProvider {
  private httpBootstrapper: HttpIntegrationTestBootstrapper;
  private _consumerApiClientService: IConsumerApiService;

  private container: InvocationContainer;

  private _consumerContexts: {[name: string]: ConsumerContext} = {};

  public get context(): {[name: string]: ConsumerContext} {
    return this._consumerContexts;
  }

  public get consumerApiClientService(): IConsumerApiService {
    return this._consumerApiClientService;
  }

  public async initializeAndStart(): Promise<void> {
    await this.initializeBootstrapper();
    await this.httpBootstrapper.start();
    await this.createConsumerContextForUsers();
    await this.importProcessFiles();
    this._consumerApiClientService = await this.resolveAsync<IConsumerApiService>('ConsumerApiClientService');
  }

  public async tearDown(): Promise<void> {
    await this.httpBootstrapper.reset();
    await this.httpBootstrapper.shutdown();
  }

  public async resolveAsync<T>(moduleName: string, args?: any): Promise<any> {
    return this.container.resolveAsync<T>(moduleName, args);
  }

  private async initializeBootstrapper(): Promise<void> {

    try {
      this.container = new InvocationContainer({
        defaults: {
          conventionCalls: ['initialize'],
        },
      });

      for (const iocModule of iocModules) {
        iocModule.registerInContainer(this.container);
      }

      this.container.validateDependencies();

      const appPath: string = path.resolve(__dirname);
      this.httpBootstrapper = await this.resolveAsync<HttpIntegrationTestBootstrapper>('HttpIntegrationTestBootstrapper', [appPath]);

      logger.info('Bootstrapper started.');
    } catch (error) {
      logger.error('Failed to start bootstrapper!', error);
      throw error;
    }
  }

  private async createConsumerContextForUsers(): Promise<void> {

    // all access user
    this._consumerContexts.defaultUser = await this.createConsumerContext('defaultUser');
    // no access user
    this._consumerContexts.restrictedUser = await this.createConsumerContext('restrictedUser');
    // partially restricted users
    this._consumerContexts.userWithAccessToSubLaneC = await this.createConsumerContext('userWithAccessToSubLaneC');
    this._consumerContexts.userWithAccessToLaneA = await this.createConsumerContext('userWithAccessToLaneA');
    this._consumerContexts.userWithNoAccessToLaneA = await this.createConsumerContext('userWithNoAccessToLaneA');
  }

  private async createConsumerContext(username: string): Promise<ConsumerContext> {

    // Note: Since the iam facade is mocked, it doesn't matter what kind of token is used here.
    // It only matters that one is present.
    return <ConsumerContext> {
      identity: username,
    };
  }

  private async importProcessFiles(): Promise<void> {

    const processFileNames: Array<string> = [
      'test_consumer_api_correlation_result',
      'test_consumer_api_non_executable_process',
      'test_consumer_api_process_start',
      'test_consumer_api_usertask',
      'test_consumer_api_usertask_empty',
      'test_consumer_api_sublane_process',
    ];

    const importService: IImportProcessService = await this.resolveAsync<IImportProcessService>('ImportProcessService');

    const identityService: IIdentityService = await this.resolveAsync<IIdentityService>('IdentityServiceNew');

    const dummyIdentity: IIdentity = await identityService.getIdentity('dummyToken');
    const dummyContext: ExecutionContext = new ExecutionContext(dummyIdentity);

    for (const processFileName of processFileNames) {
      await this.registerProcess(dummyContext, processFileName, importService);
    }
  }

  private async registerProcess(dummyContext: ExecutionContext, processFileName: string, importService: IImportProcessService): Promise<void> {

    const processFilePath: string = path.join(__dirname, '..', '..', 'bpmn', `${processFileName}.bpmn`);

    await importService.importBpmnFromFile(dummyContext, processFilePath, true);
  }
}
