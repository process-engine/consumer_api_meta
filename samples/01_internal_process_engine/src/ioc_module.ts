import {InvocationContainer} from 'addict-ioc';

import {ConsumerApiClientService, InternalAccessor} from '@process-engine/consumer_api_client';

import {IamServiceMock} from './iam_service_mock';

// This function will be called by the setup, when registering ioc modules at the container.
export function registerInContainer(container: InvocationContainer): void {

  // This removes the necessity for having a running IdentityServer during sample execution.
  container.register('IamService', IamServiceMock);

  // Creates a custom ioc registration for the ConsumerApiClientService and its dependencies.
  container.register('ConsumerApiInternalAccessor', InternalAccessor)
    .dependencies('ConsumerApiService');

  container.register('ConsumerApiClientService', ConsumerApiClientService)
    .dependencies('ConsumerApiInternalAccessor');
}
