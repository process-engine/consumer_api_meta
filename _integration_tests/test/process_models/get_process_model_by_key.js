'use strict';

const should = require('should');

const TestFixtureProvider = require('../../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /process_models/:process_model_key', function getProcessModelByKey() {

  let testFixtureProvider;
  let consumerContext;

  this.timeout(testTimeoutMilliseconds);

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should return a process model by its process_model_key through the consumer api', async () => {

    const processModelKey = 'test_consumer_api_process_start';

    const processModel = await testFixtureProvider
      .consumerApiClientService
      .getProcessModelByKey(consumerContext, processModelKey);

    should(processModel).have.property('key');
    should(processModel).have.property('startEvents');
  });

  it('should not list any start events, if the retrieved process model is not marked as executable', async () => {

    const processModelKey = 'test_consumer_api_non_executable_process';

    const processModel = await testFixtureProvider
      .consumerApiClientService
      .getProcessModelByKey(consumerContext, processModelKey);

    should(processModel).have.property('key');
    should(processModel).have.property('startEvents');
    should(processModel.startEvents.length).be.equal(0);
  });

  it('should fail to retrieve the process model, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getProcessModelByKey({}, processModelKey);

      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getProcessModelByKey(restrictedContext, processModelKey);

      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model, if the process_model_key does not exist', async () => {

    const invalidProcessModelKey = 'invalidProcessModelKey';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getProcessModelByKey(consumerContext, invalidProcessModelKey);

      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

});
