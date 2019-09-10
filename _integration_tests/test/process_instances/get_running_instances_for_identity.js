'use strict';

const jsonwebtoken = require('jsonwebtoken');
const should = require('should');

const {TestFixtureProvider, ProcessInstanceHandler} = require('../../dist/commonjs');

describe('ConsumerAPI:   GET  ->  /process_instances/own', () => {

  let processInstanceHandler;
  let testFixtureProvider;

  let defaultIdentity;
  let someOtherIdentity;
  let restrictedIdentity;

  const processModelId = 'test_consumer_api_usertask';

  let correlationId;

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();

    defaultIdentity = testFixtureProvider.identities.defaultUser;
    someOtherIdentity = testFixtureProvider.identities.userWithAccessToLaneA;
    restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    await testFixtureProvider.importProcessFiles([processModelId]);

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);

    correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId);
    await processInstanceHandler.waitForProcessInstanceToReachSuspendedTask(correlationId);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should return a Users ProcessInstances by his identity', async () => {

    const processInstances = await testFixtureProvider
      .consumerApiClient
      .getProcessInstancesByIdentity(defaultIdentity);

    should(processInstances).be.instanceOf(Array);
    should(processInstances.length).be.greaterThan(0);

    for (const processInstance of processInstances) {
      should(processInstance).have.property('id');
      should(processInstance).have.property('correlationId');
      should(processInstance).have.property('processModelId');
      should(processInstance).have.property('owner');

      const decodedRequestingIdentity = jsonwebtoken.decode(processInstance.owner.token);
      const decodedProcessInstanceIdentity = jsonwebtoken.decode(defaultIdentity.token);
      should(decodedRequestingIdentity.sub).be.equal(decodedProcessInstanceIdentity.sub);
    }
  });

  it('should filter out ProcessInstances that belong to a different User', async () => {

    const processInstances = await testFixtureProvider
      .consumerApiClient
      .getProcessInstancesByIdentity(someOtherIdentity);

    should(processInstances).be.instanceOf(Array);
    should(processInstances.length).be.equal(0);
  });

  it('should return an empty Array, if no accessible running ProcessInstances were found', async () => {

    const processInstances = await testFixtureProvider
      .consumerApiClient
      .getProcessInstancesByIdentity(restrictedIdentity);

    should(processInstances).be.instanceOf(Array);
    should(processInstances.length).be.equal(0);
  });

  it('should fail to retrieve a Users ProcessInstances, when the user is unauthorized', async () => {

    try {
      const processInstances = await testFixtureProvider
        .consumerApiClient
        .getProcessInstancesByIdentity({});

      should.fail(processInstances, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });
});
