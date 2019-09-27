import {InvocationContainer} from 'addict-ioc';

import {
  ConsumerApiClient,
  ExternalAccessor,
} from '@process-engine/consumer_api_client';

export function registerInContainer(container: InvocationContainer): void {

  container.register('ConsumerApiExternalAccessor', ExternalAccessor)
    .dependencies('HttpClient');

  container.register('ConsumerApiClient', ConsumerApiClient)
    .dependencies('ConsumerApiExternalAccessor');
}
