import {IContainer} from 'addict-ioc';

import {
  ConsumerApiClient,
  ExternalAccessor,
  InternalAccessor,
} from '@process-engine/consumer_api_client';
import {IamServiceMock} from '../mocks/index';

import {ServiceTaskTestService} from '../test_services/index';

export function registerInContainer(container: IContainer): void {

  const accessConsumerApiInternally: boolean = process.env.CONSUMER_API_ACCESS_TYPE === 'internal';

  if (accessConsumerApiInternally) {
    container.register('ConsumerApiInternalAccessor', InternalAccessor)
      .dependencies(
        'ConsumerApiApplicationInfoService',
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
  } else {
    container.register('ConsumerApiExternalAccessor', ExternalAccessor)
      .dependencies('HttpClient')
      .configure('consumer_api:external_accessor')
      .singleton();

    container.register('ConsumerApiClient', ConsumerApiClient)
      .dependencies('ConsumerApiExternalAccessor');
  }

  // This removes the necessity for having a running IdentityServer during testing.
  container.register('IamService', IamServiceMock);

  container.register('ServiceTaskTestService', ServiceTaskTestService);
}
