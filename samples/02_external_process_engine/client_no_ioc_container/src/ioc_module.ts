import {
  ConsumerApiClientService,
  ExternalAccessor,
} from '@process-engine/consumer_api_client';

import {InvocationContainer} from 'addict-ioc';

export function registerInContainer(container: InvocationContainer): void {

  container.register('ConsumerApiExternalAccessor', ExternalAccessor)
    .dependencies('HttpService');

  container.register('ConsumerApiClientService', ConsumerApiClientService)
    .dependencies('ConsumerApiExternalAccessor');
}
