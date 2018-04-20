'use strict';

const should = require('should');

const startCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const testSetup = require('../../../test_setup');

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   POST  ->  /process_models/:process_model_key/start_events/:start_event_key/start', function() {

  let httpBootstrapper;
  let consumerApiClientService;
  let consumerContext;
  
  this.timeout(testTimeoutMilliseconds);

  before(async function() {
    this.timeout(0);
    httpBootstrapper = await testSetup.initializeBootstrapper();
    await httpBootstrapper.start();
    consumerContext = await testSetup.createContext();
    consumerApiClientService = await testSetup.resolveAsync('ConsumerApiClientService');
  });

  after(async function() {
    this.timeout(0);
    await httpBootstrapper.reset();
    await httpBootstrapper.shutdown();
  });

  it('should start the process and return the correlation ID (return_on = on_process_instance_started)', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'randomcorrelationid',
      input_values: {},
    };
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;
    
    const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.equal(payload.correlation_id);
  });

  it('should start the process and return the correlation ID (return_on = on_process_instance_finished)', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };
    const returnOn = startCallbackType.CallbackOnEndEventReached;
    
    const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.equal(payload.correlation_id);
  });

  it('should start the process and return a generated correlation ID, when none is provided', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      input_values: {},
    };
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;
    
    const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
  });

  it('should start the process with using \'on_process_instance_started\' as a default value for return_on', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      input_values: {},
    };
    
    const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.a.String();
  });

  it('should fail to start the process, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {
        causeError: true,
      },
    };
    
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await consumerApiClientService.startProcessInstance({}, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, when the user forbidden to start it', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {
        causeError: true,
      },
    };
    
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    const restrictedContext = await testSetup.createRestrictedContext();

    try {
      const result = await consumerApiClientService.startProcessInstance(restrictedContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, if the given process_model_key does not exist', async () => {

    const processModelKey = 'invalidProcessModelKey';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };

    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /key.*?not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, if the given start_event_key does not exist', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'invalidStartEventKey';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };
    
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /start event.*?not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, if the given return_on option is invalid', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };
    
    const returnOn = 'invalidReturnOption';

    try {
      const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      const expectedErrorMessage = /not a valid return option/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  // TODO: What exactly constitutes a valid payload anyway?
  it.skip('should fail to start the process, if the given payload is invalid', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = 'i am missing vital properties';
    
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    const consumerContext = await testSetup.createContext('user');

    try {
      const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      const expectedErrorMessage = /invalid payload/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  // TODO: Find a way to simulate a start event error
  it.skip('should fail, if starting the request caused an error', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };
    
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      should(error.message).be.empty();
      should(error.code).match(expectedErrorCode);
    }
  });

  it('should fail, if the request was aborted before the desired return_on event was reached', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {
        causeError: true,
      },
    };
    
    // NOTE: This test case can by its very definition never work with .CallbackOnProcessInstanceCreated".
    const returnOn = startCallbackType.CallbackOnEndEventReached;

    try {
      const result = await consumerApiClientService.startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      should(error.message).be.empty();
      should(error.code).match(expectedErrorCode);
    }
  });

});
