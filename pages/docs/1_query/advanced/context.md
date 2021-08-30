---
title: 'Passing a context'
description: 'A context can be passed to a query engine to tweak its runtime settings.'
---

When passing a query to a Comunica query engine,
you can pass additional information to the engine using a **context** object.

## 1. How to use the context

When [querying in a JavaScript application](/docs/query/getting_started/query_app/),
the context must be passed as second argument to the `query()` method of a Comunica engine.

For example, a context that defines the `sources` to query over is passed as follows:
```javascript
const newEngine = require('@comunica/actor-init-sparql').newEngine;
const myEngine = newEngine();

const result = await myEngine.query(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});
```

The `sources` field is the only entry that is required in the context.
All other entries that are discussed hereafter are optional.

<div class="note">
During query execution, the context is converted into an <a href="https://www.npmjs.com/package/immutable">immutable</a> object
to ensure that the original context entries remain unchanged during the whole query execution.
</div>

## 2. Overview

The following table gives an overview of all possible context entries that can be passed.

| **Key** | **Description** |
| ------- | --------------- |
| `sources` | An array of data sources |
| `lenient` | If HTTP and parsing failures are ignored |
| `initialBindings` | Variables that have to be pre-bound to values in the query |
| `queryFormat` | Name of the provided query's format |
| `baseIRI` | Base IRI for relative IRIs in SPARQL queries |
| `log` | A custom logger instance |
| `datetime` | Specify a custom date |
| `httpProxyHandler` | A proxy for all HTTP requests |
| `httpIncludeCredentials` | (_browser-only_) If current credentials should be included for HTTP requests |
| `extensionFunctions` or `extensionFunctionCreator` | SPARQL extension functions |

When developing Comunica modules, all context entry keys can be found in [`@comunica/context-entries`](https://comunica.github.io/comunica/modules/context_entries.html). 

## 3. Defining sources

Using the `sources` context entry, data sources can be defined that Comunica should query over.
The value of this must be an array, where the array may contain both strings or objects:
* Array elements that are strings are interpreted as URLs, such as `'https://www.rubensworks.net/'` or `'http://fragments.dbpedia.org/2016-04/en'`.
* Object array elements can be different things:
    * A hash containing `type` and `value`, such as `{ type: 'sparql', value: 'https://dbpedia.org/sparql' }`.
    * An [RDF/JS](/docs/query/advanced/rdfjs/) source object, such as [`new N3Store()`](https://github.com/rdfjs/N3.js#storing).

String-based sources will lead to Comunica trying to determine their source type automatically.
Hash-based sources allows you to enforce a specific source type.

<div class="note">
Learn more about <a href="/docs/query/advanced/source_types/">all available source type</a>.
</div>

<div class="note">
Some SPARQL endpoints may be recognised as a file instead of a SPARQL endpoint due to them not supporting <a href="https://www.w3.org/TR/sparql11-service-description/">SPARQL Service Description</a>,
which may produce incorrect results. For these cases, the <code>sparql</code> type MUST be set.
</div>

For example, all of the following source elements are valid:
```javascript
const result = await myEngine.query(`...`, {
  sources: [
    'http://fragments.dbpedia.org/2015/en',
    { type: 'hypermedia', value: 'http://fragments.dbpedia.org/2016/en' },
    { type: 'file', value: 'https://www.rubensworks.net/' },
    new N3Store(),
    { type: 'sparql', value: 'https://dbpedia.org/sparql' },
  ],
});
```

## 4. Lenient execution

By default, Comunica will throw an error when it encounters an invalid **RDF document** or **HTTP URL**.
It is possible to **ignore these errors** and make Comunica ignore such invalid documents and URLs
by setting `lenient` to `true`:
```javascript
const result = await myEngine.query(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  lenient: true,
});
```

## 5. Binding variables

Using the `initialBindings` context entry, it is possible to **bind** certain variables in the given query to terms before the query execution starts.
This may be valuable in case your SPARQL query is used as a template with some variables that need to be filled in.

This can be done by passing a `Bindings` object as value to the `initialBindings` context entry:
```javascript
import { Bindings } from '@comunica/bus-query-operation';
import { DataFactory } from 'rdf-data-factory';

const factory = new DataFactory();

const result = await myEngine.query(`SELECT * WHERE {
  {?s ?p ?template1 } UNION { ?s ?p ?template2 }
}`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  initialBindings: new Bindings({
    '?template1': factory.literal('Value1'),
    '?template2': factory.literal('Value2'),
  }),
});
```

The keys in the `Bindings` hash must be variable names starting with `?`.
The values must be valid [RDF/JS](/docs/query/advanced/rdfjs/) terms,
which can for example be constructed using [`rdf-data-factory`](https://www.npmjs.com/package/rdf-data-factory).

## 6. Setting the query format

By default, queries in Comunica are interpreted as SPARQL queries.
As such, the `queryFormat` entry defaults to `sparql`.

Since Comunica is not tied to any specific **query format**, it is possible to change this to something else, such as `graphql`.
More information on this can be found in the [GraphQL-LD guide](/docs/query/advanced/rdfjs/).

## 7. Setting a Base IRI

Terms in SPARQL queries can be relative to a certain **Base IRI**.
Typically, you would use the `BASE` keyword in a SPARQL query to set this Base IRI.
If you want to set this Base IRI without modifying the query,
then you can define it in the context using `baseIRI`:

```javascript
const result = await myEngine.query(`SELECT * WHERE {
  ?s </relative> ?o
}`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  baseIRI: 'http://example.org/',
});
```

## 8. Enabling a logger

A logger can be set using `log`.
More information on this can be found in the [logging guide](/docs/query/advanced/logging/).

## 9. Setting a custom date

Using `datetime`, a custom **date** can be set in Comunica.
The range of this field must always be a JavaScript `Date` object:

```javascript
const result = await myEngine.query(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  date: new Date(),
});
```

This date is primarily used for the SPARQL `NOW()` operator.
It is also used when performing time travel querying using the [Memento protocl](/docs/query/advanced/memento/).

## 10. Enabling an HTTP proxy

All HTTP requests can be run through a proxy using `httpProxyHandler`.
More information on this can be found in the [HTTP proxy guide](/docs/query/advanced/proxying/).

## 11. Include credentials in HTTP requests

_Only applicable when running in the browser_

If this option is enabled, then all cross-site requests will be made using credentials of the current page.
This includes cookies, authorization headers or TLS client certificates.

Enabling this option has no effect on same-site requests.

```javascript
const result = await myEngine.query(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  httpIncludeCredentials: true,
});
```

## 12. Send requests via HTTP basic authentication

Via HTTP Basic Authentication one can include **username and password** credentials in HTTP requests.
More information on this can be found in the [HTTP basic authentication guide](/docs/query/advanced/basic_auth/).

## 13. SPARQL extension functions

SPARQL allows non-standard, [custom extension functions](https://www.w3.org/TR/sparql11-query/#extensionFunctions) to be used within queries.
In order to provide an implementation to these extension functions,
Comunica allows developers to plug them in via the context.
More information on this can be found in the [SPARQL extension functions guide](/docs/query/advanced/extension_functions/).
