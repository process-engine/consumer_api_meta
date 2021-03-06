'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;

describe('ConsumerAPI: GetProcessModelById', () => {

  let testFixtureProvider;
  let defaultIdentity;

  const processModelId = 'test_consumer_api_process_start';
  const processModelIdNonExecutable = 'test_consumer_api_non_executable_process';

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    const processModelsToImport = [
      processModelId,
      processModelIdNonExecutable,
    ];

    await testFixtureProvider.importProcessFiles(processModelsToImport);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should return a process model by its process_model_id through the consumer api', async () => {

    const processModel = await testFixtureProvider
      .consumerApiClient
      .getProcessModelById(defaultIdentity, processModelId);

    should(processModel).have.property('id');
    should(processModel).have.property('startEvents');
    should(processModel).have.property('endEvents');
    should(processModel.startEvents.length).be.greaterThan(0);
    should(processModel.endEvents.length).be.greaterThan(0);
  });

  it('should not list any start events, if the retrieved process model is not marked as executable', async () => {

    const processModel = await testFixtureProvider
      .consumerApiClient
      .getProcessModelById(defaultIdentity, processModelIdNonExecutable);

    should(processModel).have.property('id');
    should(processModel).have.property('startEvents');
    should(processModel).have.property('endEvents');
    should(processModel.startEvents).be.empty();
    should(processModel.endEvents).be.empty();
  });

  it('should fail to retrieve the process model, when the user is unauthorized', async () => {

    try {
      const processModel = await testFixtureProvider
        .consumerApiClient
        .getProcessModelById({}, processModelId);

      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model, when the user forbidden to retrieve it', async () => {

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    try {
      const processModel = await testFixtureProvider
        .consumerApiClient
        .getProcessModelById(restrictedIdentity, processModelId);

      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model, if the process_model_id does not exist', async () => {

    const invalidprocessModelId = 'invalidprocessModelId';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClient
        .getProcessModelById(defaultIdentity, invalidprocessModelId);

      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
