import {InvocationContainer} from 'addict-ioc';

import {ConsumerApiClient, InternalAccessor} from '@process-engine/consumer_api_client';

import {IamServiceMock} from './iam_service_mock';

// This function will be called by the setup, when registering ioc modules at the container.
export function registerInContainer(container: InvocationContainer): void {

  // This removes the necessity for having a running IdentityServer during sample execution.
  container.register('IamService', IamServiceMock);

  // Creates a custom ioc registration for the ConsumerApiClient and its dependencies.
  container.register('ConsumerApiInternalAccessor', InternalAccessor)
    .dependencies(
      'ConsumerApiEmptyActivityService',
      'ConsumerApiEventService',
      'ConsumerApiExternalTaskService',
      'ConsumerApiManualTaskService',
      'ConsumerApiNotificationService',
      'ConsumerApiProcessModelService',
      'ConsumerApiUserTaskService',
      'ConsumerApiFlowNodeInstanceService',
    );

  container.register('ConsumerApiClient', ConsumerApiClient)
    .dependencies('ConsumerApiInternalAccessor');
}
