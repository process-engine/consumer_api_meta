import * as fs from 'fs';
// tslint:disable-next-line:import-blacklist
import * as _ from 'lodash';
import * as path from 'path';

import {InvocationContainer} from 'addict-ioc';
import {Logger} from 'loggerhythm';

import {ExecutionContext} from '@essential-projects/core_contracts';
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
  '@essential-projects/pki_service',
  '@essential-projects/security_service',
  '@essential-projects/services',
  '@essential-projects/routing',
  '@essential-projects/timing',
  '@essential-projects/validation',
  '@process-engine/consumer_api_client',
  '@process-engine/consumer_api_core',
  '@process-engine/consumer_api_http',
  '@process-engine/process_engine',
  '@process-engine/process_engine_http',
  '@process-engine/process_repository',
  '../../',
];

const iocModules: Array<any> = iocModuleNames.map((moduleName: string): any => {
  return require(`${moduleName}/ioc_module`);
});

export class TestFixtureProvider {
  private httpBootstrapper: any;
  private _consumerApiClientService: IConsumerApiService;

  private container: InvocationContainer;
  private bootstrapper: any;

  private _customerContexts: {[name: string]: ConsumerContext} = {};

  public get context(): {[name: string]: ConsumerContext} {
    return this._customerContexts;
  }

  public get consumerApiClientService(): IConsumerApiService {
    return this._consumerApiClientService;
  }

  public async initializeAndStart(): Promise<void> {
    this.httpBootstrapper = await this.initializeBootstrapper();
    await this.httpBootstrapper.start();
    await this.createConsumerContextForUsers();
    this._consumerApiClientService = await this.resolveAsync('ConsumerApiClientService');
  }

  public async tearDown(): Promise<void> {
    await this.httpBootstrapper.reset();
    await this.httpBootstrapper.shutdown();
  }

  public async resolveAsync(moduleName: string): Promise<any> {
    return this.container.resolveAsync(moduleName);
  }

  private async initializeBootstrapper(): Promise<any> {

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
      this.bootstrapper = await this.container.resolveAsync('HttpIntegrationTestBootstrapper', [appPath]);

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

      this.bootstrapper.addFixtures('User', identityFixtures);

      logger.info('Bootstrapper started.');

      return this.bootstrapper;
    } catch (error) {
      logger.error('Failed to start bootstrapper!', error);
      throw error;
    }
  }

  private async createConsumerContextForUsers(): Promise<void> {
    this._customerContexts.defaultUser = await this.createConsumerContext('testuser', 'testpass');
    this._customerContexts.restrictedUser = await this.createConsumerContext('restrictedUser', 'testpass');
    this._customerContexts.laneUser = await this.createConsumerContext('laneuser', 'testpass');
    this._customerContexts.userWithAccessToSubLaneA = await this.createConsumerContext('userWithAccessToSubLaneA', 'testpass');
    this._customerContexts.userWithAccessToSubLaneB = await this.createConsumerContext('userWithAccessToSubLaneB', 'testpass');
    this._customerContexts.userWithNoAccessToSubLaneD = await this.createConsumerContext('userWithNoAccessToSubLaneD', 'testpass');
    this._customerContexts.userWithNoAccessToSubLaneC = await this.createConsumerContext('userWithNoAccessToSubLaneC', 'testpass');
    this._customerContexts.userWithNoAccessToLaneA = await this.createConsumerContext('userWithNoAccessToLaneA', 'testpass');
  }

  private async createConsumerContext(user: string, password: string): Promise<ConsumerContext> {
    const authToken: any = await this.bootstrapper.getTokenFromAuth(user, password);

    return <ConsumerContext> {
      identity: authToken,
    };
  }
}
