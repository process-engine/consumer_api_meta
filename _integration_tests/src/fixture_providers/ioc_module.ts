import {IContainer} from 'addict-ioc';

import {
  ConsumerApiClientService,
  ExternalAccessor,
  InternalAccessor,
} from '@process-engine/consumer_api_client';
import {IamServiceMock} from '../mocks/index';

export function registerInContainer(container: IContainer): void {

  const accessConsumerApiInternally: boolean = process.env.CONSUMER_API_ACCESS_TYPE === 'internal';

  if (accessConsumerApiInternally) {
    container.register('ConsumerApiInternalAccessor', InternalAccessor)
      .dependencies(
        'ConsumerApiEmptyActivityService',
        'ConsumerApiEventService',
        'ConsumerApiManualTaskService',
        'ConsumerApiNotificationService',
        'ConsumerApiProcessModelService',
        'ConsumerApiUserTaskService',
      );

    container.register('ConsumerApiClient', ConsumerApiClientService)
      .dependencies('ConsumerApiInternalAccessor');
  } else {
    container.register('ConsumerApiExternalAccessor', ExternalAccessor)
      .dependencies('HttpClient')
      .configure('consumer_api:external_accessor')
      .singleton();

    container.register('ConsumerApiClient', ConsumerApiClientService)
      .dependencies('ConsumerApiExternalAccessor');
  }

  // This removes the necessity for having a running IdentityServer during testing.
  container.register('IamService', IamServiceMock);
}
