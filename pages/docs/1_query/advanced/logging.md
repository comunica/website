---
title: 'Logging'
description: 'Loggers can be set to different logging levels to inspect what Comunica is doing behind the scenes.'
---

If you want to inspect what is going on during query execution,
you can enable a logger in Comunica.

<div class="note">
This guide focuses on configuring logging levels and printing output.
<a href="/docs/modify/advanced/logging/">Click here</a> if you want to learn more about invoking a logger from within an actor implementation.
</div>

## Logging on the command line

Using Comunica SPARQL on the command line, logging can be enabled via the `-l` option.
For example, printing debug-level logs can be done as follows:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100" \
    -l debug
```
```text
[2022-02-23T09:46:17.615Z]  INFO: Requesting https://fragments.dbpedia.org/2016-04/en {
  headers: {
    accept: 'application/n-quads,application/trig;q=0.95,application/ld+json;q=0.9,application/n-triples;q=0.8,text/turtle;q=0.6,application/rdf+xml;q=0.5,application/json;q=0.45,text/n3;q=0.35,application/xml;q=0.3,image/svg+xml;q=0.3,text/xml;q=0.3,text/html;q=0.2,application/xhtml+xml;q=0.18',
    'user-agent': 'Comunica/actor-http-fetch (Node.js v14.17.0; darwin)'
  },
  method: 'GET',
  actor: 'urn:comunica:default:http/actors#fetch'
}
[2022-02-23T09:46:17.756Z]  INFO: Identified as qpf source: https://fragments.dbpedia.org/2016-04/en { actor: 'urn:comunica:default:rdf-resolve-hypermedia/actors#qpf' }
[2022-02-23T09:46:17.761Z]  INFO: Requesting https://fragments.dbpedia.org/2016-04/en?predicate=http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type {
  headers: {
    accept: 'application/n-quads,application/trig;q=0.95,application/ld+json;q=0.9,application/n-triples;q=0.8,text/turtle;q=0.6,application/rdf+xml;q=0.5,application/json;q=0.45,text/n3;q=0.35,application/xml;q=0.3,image/svg+xml;q=0.3,text/xml;q=0.3,text/html;q=0.2,application/xhtml+xml;q=0.18',
    'user-agent': 'Comunica/actor-http-fetch (Node.js v14.17.0; darwin)'
  },
  method: 'GET',
  actor: 'urn:comunica:default:http/actors#fetch'
}
[2022-02-23T09:46:17.785Z]  DEBUG: Determined physical join operator 'inner-bind' {
  entries: 2,
  variables: [ [ 's', 'p', 'o' ], [ 's', 'o' ] ],
  costs: {
    'inner-none': undefined,
    'inner-single': undefined,
    'inner-multi-empty': undefined,
    'inner-bind': 6458426063925.053,
    'inner-hash': undefined,
    'inner-symmetric-hash': undefined,
    'inner-nested-loop': 104059105829280600,
    'optional-bind': undefined,
    'optional-nested-loop': undefined,
    'minus-hash': undefined,
    'minus-hash-undef': undefined,
    'inner-multi-smallest': undefined
  },
  coefficients: {
    'inner-none': undefined,
    'inner-single': undefined,
    'inner-multi-empty': undefined,
    'inner-bind': {
      iterations: 6404592831613.728,
      persistedItems: 0,
      blockingItems: 0,
      requestTime: 538332323.1132541
    },
    'inner-hash': {
      iterations: 1140381039,
      persistedItems: 1040358853,
      blockingItems: 1040358853,
      requestTime: 1391277679.44
    },
    'inner-symmetric-hash': {
      iterations: 1140381039,
      persistedItems: 1140381039,
      blockingItems: 0,
      requestTime: 1391277679.44
    },
    'inner-nested-loop': {
      iterations: 104058966701512660,
      persistedItems: 0,
      blockingItems: 0,
      requestTime: 1391277679.44
    },
    'optional-bind': undefined,
    'optional-nested-loop': undefined,
    'minus-hash': undefined,
    'minus-hash-undef': undefined,
    'inner-multi-smallest': undefined
  }
}
[2022-02-23T09:46:17.786Z]  DEBUG: First entry for Bind Join:  {
  entry: Quad {
    termType: 'Quad',
    value: '',
    subject: Variable { termType: 'Variable', value: 's' },
    predicate: NamedNode {
      termType: 'NamedNode',
      value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
    },
    object: Variable { termType: 'Variable', value: 'o' },
    graph: DefaultGraph { termType: 'DefaultGraph', value: '' },
    type: 'pattern'
  },
  metadata: {
    requestTime: 18,
    pageSize: 100,
    cardinality: { type: 'estimate', value: 100022186 },
    first: 'https://fragments.dbpedia.org/2016-04/en?predicate=http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type&page=1',
    next: 'https://fragments.dbpedia.org/2016-04/en?predicate=http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type&page=2',
    previous: null,
    last: null,
    searchForms: { values: [Array] },
    canContainUndefs: false,
    order: undefined,
    availableOrders: undefined,
    variables: [ [Variable], [Variable] ]
  },
  actor: 'urn:comunica:default:rdf-join/actors#inner-multi-bind'
}
[2022-02-23T09:46:17.794Z]  INFO: Requesting https://fragments.dbpedia.org/2016-04/en?subject=http%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FSpecial%3AFilePath%2F%21%21%21%E5%96%84%E7%A6%8F%E5%AF%BA.JPG&object=http%3A%2F%2Fdbpedia.org%2Fontology%2FImage {
  headers: {
    accept: 'application/n-quads,application/trig;q=0.95,application/ld+json;q=0.9,application/n-triples;q=0.8,text/turtle;q=0.6,application/rdf+xml;q=0.5,application/json;q=0.45,text/n3;q=0.35,application/xml;q=0.3,image/svg+xml;q=0.3,text/xml;q=0.3,text/html;q=0.2,application/xhtml+xml;q=0.18',
    'user-agent': 'Comunica/actor-http-fetch (Node.js v14.17.0; darwin)'
  },
  method: 'GET',
  actor: 'urn:comunica:default:http/actors#fetch'
}
[2022-02-23T09:46:17.795Z]  INFO: Requesting https://fragments.dbpedia.org/2016-04/en?subject=http%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FSpecial%3AFilePath%2F%21%21%21%E5%96%84%E7%A6%8F%E5%AF%BA.JPG&object=http%3A%2F%2Fwikidata.dbpedia.org%2Fontology%2FImage {
  headers: {
    accept: 'application/n-quads,application/trig;q=0.95,application/ld+json;q=0.9,application/n-triples;q=0.8,text/turtle;q=0.6,application/rdf+xml;q=0.5,application/json;q=0.45,text/n3;q=0.35,application/xml;q=0.3,image/svg+xml;q=0.3,text/xml;q=0.3,text/html;q=0.2,application/xhtml+xml;q=0.18',
    'user-agent': 'Comunica/actor-http-fetch (Node.js v14.17.0; darwin)'
  },
  method: 'GET',
  actor: 'urn:comunica:default:http/actors#fetch'
}
```

All log messages will be printed to standard error (`stderr`).

If you only want to print the logs, you can void all query results as follows:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100" \
    -l debug > /dev/null
```

If you want to redirect all logs to a file, you can forward them like this:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100" \
    -l debug 2> /path/to/log.txt
```

## Logging levels

The following logging levels are available in Comunica:

* `trace`
* `debug`
* `info`
* `warn`
* `error`
* `fatal`

<div class="note">
When enabling a level, all levels below are also enabled.
For example, when enabling <code>error</code>, then <code>fatal</code> will also be enabled.
</div>

## Logging in an application

Using the `log` [context entry](/docs/query/advanced/context/), you can enable logging in a [JavaScript application that uses Comunica](/docs/query/getting_started/query_app/):
```javascript
import {LoggerPretty} from "@comunica/logger-pretty";

const result = await myEngine.query('SELECT * WHERE { ?s ?p ?o }', {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  log: new LoggerPretty({ level: 'debug' }),
});
```

This logger makes use of `LoggerPretty`, which will print everything to standard error (`stderr`),
just like Comunica SPARQL on the command line.

Alternatively, more advanced logging can be achieved by making use of [`@comunica/logger-bunyan`](https://github.com/comunica/comunica/tree/master/packages/logger-bunyan/),
or by implementing your own logger that implements the [`Logger` interface](https://github.com/comunica/comunica/blob/master/packages/core/lib/Logger.ts).
