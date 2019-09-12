'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;

describe('Consumer API:   GET  ->  /processModels', () => {

  let testFixtureProvider;
  let defaultIdentity;

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    const processModelsToImport = [
      'test_consumer_api_process_start',
      'test_consumer_api_non_executable_process',
    ];

    await testFixtureProvider.importProcessFiles(processModelsToImport);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should return process models through the consumer api', async () => {

    const processModelList = await testFixtureProvider
      .consumerApiClient
      .getProcessModels(defaultIdentity);

    should(processModelList).have.property('processModels');

    should(processModelList.processModels).be.an.instanceOf(Array);
    should(processModelList.processModels.length).be.greaterThan(0);

    processModelList.processModels.forEach((processModel) => {
      should(processModel).have.property('id');
      should(processModel).have.property('startEvents');
      should(processModel).have.property('endEvents');
      should(processModel.startEvents).be.an.instanceOf(Array);
      should(processModel.endEvents).be.an.instanceOf(Array);
    });
  });

  it('should filter out processes models that the user is not authorized to see', async () => {

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    const processModelList = await testFixtureProvider
      .consumerApiClient
      .getProcessModels(restrictedIdentity);

    should(processModelList).have.property('processModels');

    should(processModelList.processModels).be.an.instanceOf(Array);

    processModelList.processModels.forEach((processModel) => {
      should(processModel).have.property('id');
      should(processModel.id).not.be.equal('test_consumer_api_process_start');
      should(processModel).have.property('startEvents');
      should(processModel).have.property('endEvents');
      should(processModel.startEvents).be.an.instanceOf(Array);
      should(processModel.endEvents).be.an.instanceOf(Array);
    });
  });

  it('should not return any start events for processes which are not marked as executable', async () => {

    const processModelList = await testFixtureProvider
      .consumerApiClient
      .getProcessModels(defaultIdentity);

    should(processModelList).have.property('processModels');

    should(processModelList.processModels).be.an.instanceOf(Array);

    processModelList.processModels.forEach((processModel) => {
      should(processModel).have.property('id');
      should(processModel).have.property('startEvents');
      should(processModel).have.property('endEvents');
      should(processModel.startEvents).be.an.instanceOf(Array);
      should(processModel.endEvents).be.an.instanceOf(Array);

      if (processModel.id === 'test_consumer_api_non_executable_process') {
        should(processModel.startEvents).have.a.lengthOf(0);
        should(processModel.endEvents).have.a.lengthOf(0);
      }
    });
  });

  it('should fail to retrieve a list of process models, when the user is unauthorized', async () => {
    try {
      const processModelList = await testFixtureProvider
        .consumerApiClient
        .getProcessModels({});

      should.fail(processModelList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
