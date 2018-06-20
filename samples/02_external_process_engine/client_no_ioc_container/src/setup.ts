import {Logger} from 'loggerhythm';

import {IAuthObject} from '@essential-projects/core_contracts';
import {IResponse} from '@essential-projects/http_contracts';
import {HttpService} from '@essential-projects/services';

import {ConsumerApiClientService, ExternalAccessor} from '@process-engine/consumer_api_client';
import {ConsumerContext} from '@process-engine/consumer_api_contracts';

const logger: Logger = Logger.createLogger('test:bootstrapper');

let httpClient: HttpService;
let externalAccessor: ExternalAccessor;
let consumerApiClientService: ConsumerApiClientService;

/**
 * Creates the consumer api client and all its required components.
 *
 * @function initialize
 */
export function initialize(): void {

  const httpConfig: any = {
    url: 'http://localhost:8000',
  };

  logger.info('Creating new ConsumerApiClientService instance with an external accessor.');
  httpClient = new HttpService();
  httpClient.config = httpConfig;

  externalAccessor = new ExternalAccessor(httpClient);
  consumerApiClientService = new ConsumerApiClientService(externalAccessor);
}

/**
 * Returns the ConsumerApiClientService.
 */
export function getConsumerApiClientService(): ConsumerApiClientService {
  return consumerApiClientService;
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
  const loginRoute: string = 'iam/login';

  const loginPayload: any = {
    username: 'sampleUser',
    password: 'pass',
  };

  const loginResult: IResponse<IAuthObject> = await httpClient.post<any, IAuthObject>(loginRoute, loginPayload);

  return <ConsumerContext> {
    identity: loginResult.result.token,
  };
}
