---
title: 'Testing'
description: 'The unit and integration tests that lead to a more stable codebase.'
---

Since [code stability is one of the main goals of Comunica](/about/#stability),
we spend a lot of effort on testing our code.
For this, we continuously execute different kinds of tests in our [continous integration setup](https://github.com/comunica/comunica/blob/master/.travis.yml).
This means that every changes to the codebase always goes through
a large number of tests to make sure that no existing logic breaks.

## Unit tests

Using the [Jest testing framework](https://jestjs.io/),
we test each actor in isolation.
The code requires a code and branch coverage of 100%.

All unit tests can be executed in the development environment using the following command:
```bash
$ yarn run test
```

## Integration tests

Using [rdf-test-suite-ldf.js](https://github.com/comunica/rdf-test-suite-ldf.js),
we check the correctness of a collection of SPARQL queries over the different default Comunica configurations.
This tool makes use of [declarative test manifest](https://github.com/comunica/manifest-ldf-tests)
that are inspired by the SPARQL 1.1 test suite.

All integration tests can be executed in the development environment using the following command:
```bash
$ npx lerna run integration
```

## Specification tests

To ensure the compliance to [specifications](/docs/query/advanced/specifications/),
we continuously execute their test suites using [rdf-test-suite.js](https://github.com/rubensworks/rdf-test-suite.js).

All specification tests can be executed in the development environment using the following command:
```bash
$ npx lerna run spec
```

## Sanity checks

Certain things such as [browser builds](/docs/modify/advanced/browser_builds/) are not fully tested yet.
In order to at least check if they succeed during building,
we check these steps as well.

For example:
```bash
$ npx lerna run browser
```

## Next steps

There's still a lot more we want regarding testing to improve stability.
Interested in helping out? Have a look at [this issue](https://github.com/comunica/comunica/issues/167).
