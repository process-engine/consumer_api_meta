import {Logger} from 'loggerhythm';

import {IIdentity} from '@essential-projects/iam_contracts';
import {HttpService} from '@essential-projects/services';

import {ConsumerApiClientService, ExternalAccessor} from '@process-engine/consumer_api_client';

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
    url: 'http://localhost:6666',
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
 * This will create and return a sample identity.
 * The identity is required for accessing process models
 * and must be provided to ALL consumer api functions.
 *
 * @function createIdentity
 * @async
 * @returns An identity, which contains an JWT AuthToken for the sample user.
 */
export async function createIdentity(): Promise<IIdentity> {

  return <IIdentity> {
    token: 'defaultUser',
  };
}
