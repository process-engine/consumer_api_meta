import * as path from 'path';

import {InvocationContainer} from 'addict-ioc';
import {Logger} from 'loggerhythm';

import {HttpIntegrationTestBootstrapper} from '@essential-projects/http_integration_testing';

import {ConsumerContext, IConsumerApiService} from '@process-engine/consumer_api_contracts';

const logger: Logger = Logger.createLogger('test:bootstrapper');

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
  '@process-engine/consumer_api_core',
  '@process-engine/consumer_api_http',
  '@process-engine/iam',
  '@process-engine/process_engine',
  '@process-engine/process_engine_http',
  '@process-engine/process_repository',
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

      const identityFixtures: Array<any> = [{
        // Default User, used to test happy paths
        name: 'testuser',
        password: 'testpass',
        roles: ['user'],
      }, {
        // Restricted user without access rights to any lanes
        name: 'restrictedUser',
        password: 'testpass',
        roles: ['dummy'],
      }, {
        // Used to test access rights to
        name: 'laneuser',
        password: 'testpass',
        roles: ['dummy'],
      }, {
        // Used to test access rights in sublanes
        name: 'userWithAccessToSubLaneA',
        password: 'testpass',
        roles: ['dummy'],
      }, {
        // Used to test access rights in sublanes
        name: 'userWithAccessToSubLaneB',
        password: 'testpass',
        roles: ['dummy'],
      }, {
        // Used to test access rights in multiple sublanes
        name: 'userWithNoAccessToSubLaneD',
        password: 'testpass',
        roles: ['dummy'],
      }, {
        // Used to test access rights in multiple sublanes
        name: 'userWithNoAccessToSubLaneC',
        password: 'testpass',
        roles: ['dummy'],
      }, {
        // Used to test access rights when the process is nested in a sublane
        name: 'userWithNoAccessToLaneA',
        password: 'testpass',
        roles: ['dummy'],
      },
    ];

      this.httpBootstrapper.addFixtures('User', identityFixtures);

      logger.info('Bootstrapper started.');
    } catch (error) {
      logger.error('Failed to start bootstrapper!', error);
      throw error;
    }
  }

  private async createConsumerContextForUsers(): Promise<void> {
    this._consumerContexts.defaultUser = await this.createConsumerContext('testuser', 'testpass');
    this._consumerContexts.restrictedUser = await this.createConsumerContext('restrictedUser', 'testpass');
    this._consumerContexts.laneUser = await this.createConsumerContext('laneuser', 'testpass');
    this._consumerContexts.userWithAccessToSubLaneA = await this.createConsumerContext('userWithAccessToSubLaneA', 'testpass');
    this._consumerContexts.userWithAccessToSubLaneB = await this.createConsumerContext('userWithAccessToSubLaneB', 'testpass');
    this._consumerContexts.userWithNoAccessToSubLaneD = await this.createConsumerContext('userWithNoAccessToSubLaneD', 'testpass');
    this._consumerContexts.userWithNoAccessToSubLaneC = await this.createConsumerContext('userWithNoAccessToSubLaneC', 'testpass');
    this._consumerContexts.userWithNoAccessToLaneA = await this.createConsumerContext('userWithNoAccessToLaneA', 'testpass');
  }

  private async createConsumerContext(user: string, password: string): Promise<ConsumerContext> {
    const authToken: any = await this.httpBootstrapper.getTokenFromAuth(user, password);

    return <ConsumerContext> {
      identity: authToken,
    };
  }
}
