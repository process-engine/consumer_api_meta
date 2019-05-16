import {InvocationContainer} from 'addict-ioc';

import {
  ConsumerApiClientService,
  ExternalAccessor,
} from '@process-engine/consumer_api_client';

export function registerInContainer(container: InvocationContainer): void {

  container.register('ConsumerApiExternalAccessor', ExternalAccessor)
    .dependencies('HttpClient');

  container.register('ConsumerApiClientService', ConsumerApiClientService)
    .dependencies('ConsumerApiExternalAccessor');
}
