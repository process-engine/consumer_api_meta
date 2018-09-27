'use strict';

import {IamServiceMock} from '../mocks/index';

import {
  ConsumerApiClientService,
  ExternalAccessor,
  InternalAccessor,
} from '@process-engine/consumer_api_client';

export function registerInContainer(container: any): void {

  const accessConsumerApiInternally: boolean = process.env.CONSUMER_API_ACCESS_TYPE === 'internal';

  if (accessConsumerApiInternally) {
    container.register('ConsumerApiInternalAccessor', InternalAccessor)
      .dependencies('ConsumerApiService');

    container.register('ConsumerApiClientService', ConsumerApiClientService)
      .dependencies('ConsumerApiInternalAccessor');
  } else {
    container.register('ConsumerApiExternalAccessor', ExternalAccessor)
      .dependencies('HttpService');

    container.register('ConsumerApiClientService', ConsumerApiClientService)
      .dependencies('ConsumerApiExternalAccessor');
  }

  // This removes the necessity for having a running IdentityServer during testing.
  container.register('IamService', IamServiceMock);
}
