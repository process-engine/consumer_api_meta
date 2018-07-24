'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

describe('Consumer API:   GET  ->  /processModels', () => {

  let testFixtureProvider;
  let consumerContext;

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should return process models through the consumer api', async () => {

    const processModelList = await testFixtureProvider
      .consumerApiClientService
      .getProcessModels(consumerContext);

    should(processModelList).have.property('processModels');

    should(processModelList.processModels).be.instanceOf(Array);
    should(processModelList.processModels.length).be.greaterThan(0);

    processModelList.processModels.forEach((processModel) => {
      should(processModel).have.property('key');
      should(processModel).have.property('startEvents');
      should(processModel).have.property('endEvents');
      should(processModel.startEvents).be.instanceOf(Array);
      should(processModel.endEvents).be.instanceOf(Array);
    });
  });

  it('should filter out processes models that the user is not authorized to see', async () => {

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    const processModelList = await testFixtureProvider
      .consumerApiClientService
      .getProcessModels(restrictedContext);

    should(processModelList).have.property('processModels');

    should(processModelList.processModels).be.instanceOf(Array);

    processModelList.processModels.forEach((processModel) => {
      should(processModel).have.property('key');
      should(processModel.key).not.be.equal('test_consumer_api_process_start');
      should(processModel).have.property('startEvents');
      should(processModel).have.property('endEvents');
      should(processModel.startEvents).be.instanceOf(Array);
      should(processModel.endEvents).be.instanceOf(Array);
    });
  });

  it('should not return any start events for processes which are not marked as executable', async () => {

    const processModelList = await testFixtureProvider
      .consumerApiClientService
      .getProcessModels(consumerContext);

    should(processModelList).have.property('processModels');

    should(processModelList.processModels).be.instanceOf(Array);

    processModelList.processModels.forEach((processModel) => {
      should(processModel).have.property('key');
      should(processModel).have.property('startEvents');
      should(processModel).have.property('endEvents');
      should(processModel.startEvents).be.instanceOf(Array);
      should(processModel.endEvents).be.instanceOf(Array);

      if (processModel.key === 'test_consumer_api_non_executable_process') {
        should(processModel.startEvents.length).be.equal(0);
        should(processModel.endEvents.length).be.equal(0);
      }
    });
  });

  it('should fail to retrieve a list of process models, when the user is unauthorized', async () => {
    try {
      const processModelList = await testFixtureProvider
        .consumerApiClientService
        .getProcessModels({});

      should.fail(processModelList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

});
