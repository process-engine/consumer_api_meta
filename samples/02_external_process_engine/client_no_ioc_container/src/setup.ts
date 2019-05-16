import {Logger} from 'loggerhythm';

import {IIdentity} from '@essential-projects/iam_contracts';
import {HttpClient} from '@essential-projects/http';

import {ConsumerApiClientService, ExternalAccessor} from '@process-engine/consumer_api_client';

const logger = Logger.createLogger('test:bootstrapper');

let httpClient: HttpClient;
let externalAccessor: ExternalAccessor;
let consumerApiClient: ConsumerApiClientService;

/**
 * Creates the consumer api client and all its required components.
 *
 * @function initialize
 */
export function initialize(): void {

  const httpConfig = {
    url: 'http://localhost:9999',
  };

  logger.info('Creating new ConsumerApiClientService instance with an external accessor.');
  httpClient = new HttpClient();
  httpClient.config = httpConfig;

  externalAccessor = new ExternalAccessor(httpClient);
  consumerApiClient = new ConsumerApiClientService(externalAccessor);
}

/**
 * Returns the ConsumerApiClientService.
 */
export function getConsumerApiClient(): ConsumerApiClientService {
  return consumerApiClient;
}

/**
 * This will create and return an identity for a sample user.
 * The identity is required for accessing process models
 * and must be provided to ALL consumer api functions.
 *
 * @function createIdentity
 * @async
 * @returns A sample identity.
 */
export async function createIdentity(): Promise<IIdentity> {

  return {
    token: 'ZHVtbXlfdG9rZW4=',
    userId: 'dummy_token',
  };
}
