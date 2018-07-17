'use strict';

const {
  ConsumerApiClientService,
  ExternalAccessor,
  InternalAccessor,
} = require('@process-engine/consumer_api_client');

const IamServiceMock = require('./dist/commonjs/iam_service_mock').IamServiceMock;

const registerInContainer = (container) => {

  // This removes the necessity for having a running IdentityServer during testing.
  container.register('IamServiceNew', IamServiceMock);

  const accessConsumerApiInternally = process.env.CONSUMER_API_ACCESS_TYPE === 'internal';

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
};

module.exports.registerInContainer = registerInContainer;
