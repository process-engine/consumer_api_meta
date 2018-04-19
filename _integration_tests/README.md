# Consumer API Integration Tests

This folder contains integration tests for the process engine ConsumerAPI

## What are the goals of this project?

The goal of this is to make sure that the ConsumerAPI is behaving as described
in the concept document it is based on.

## Relevant URLs

- https://github.com/process-engine/consumer_api_contracts
- https://github.com/process-engine/consumer_api_core
- https://github.com/process-engine/consumer_api_http
- https://github.com/process-engine/consumer_api_client

## How do I set this project up?

### Prerequesites

- Node `>= 7.10` + npm `>= 4.2.0`
- Docker `>= 17.05.0`

### Setup/Installation

1. Make sure you have a PostgresDB running. You can see/set the required
   credentials, database and port in [`./application/config/test/data_sources/postgres.json`](https://github.com/process-engine/consumer_api_meta/blob/develop/_integration_tests/application/config/test/data_sources/postgres.json).
  
   For a dockerized and ready-to-go database setup, see the
   [skeleton database](https://github.com/process-engine/skeleton/tree/develop/database)
   of the process engine.
2. run `npm install` to install the dependencies of the integration tests,
   including the consumer_api packages that will be tested.

   Alternatively you can run the `setup.sh` from the root of this repository.
   This will install all non-consumer_api packages, and then clone, build and
   link the consumer_api packages. Doing so provides you a developer setup, so
   you can test how changes impact the integration tests.

### Seeding

Before running the tests, you need to perform a database migration, so that the
database is setup correctly. To do so:

1. Run `npm start` in this folder
2. Wait for the following log to appear in your console:
   ```
   info: [test:bootstrapper] Bootstrapper started
   ```
3. Stop the application with `ctrl+c`
   

## How do I use this project?

### Usage

Run `npm test` in this folder.

## What else is there to know?

### Authors/Contact information

- Christian Werner
- Heiko Mathes
