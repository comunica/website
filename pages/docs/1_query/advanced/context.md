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
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
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
| `destination` | A data destination for update queries |
| `lenient` | If HTTP and parsing failures are ignored |
| `initialBindings` | Variables that have to be pre-bound to values in the query |
| `queryFormat` | The provided query's format |
| `baseIRI` | Base IRI for relative IRIs in SPARQL queries |
| `log` | A custom logger instance |
| `datetime` | Specify a custom date |
| `httpProxyHandler` | A proxy for all HTTP requests |
| `httpIncludeCredentials` | (_browser-only_) If current credentials should be included for HTTP requests |
| `httpAuth` | HTTP basic authentication value |
| `httpTimeout` | HTTP timeout in milliseconds |
| `httpBodyTimeout` | Makes the HTTP timeout apply until the response is fully consumed |
| `httpRetryCount` | The number of retries to perform on failed fetch requests |
| `httpRetryDelay` | The number of milliseconds to wait between fetch retries |
| `httpRetryOnServerError` | If fetch should be retried on 5xx server error responses, instead of being resolved. |
| `recoverBrokenLinks`| Use the WayBack machine to recover broken links |
| `extensionFunctions` or `extensionFunctionCreator` | SPARQL extension functions |
| `fetch` | A custom [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) function |
| `readOnly` | If update queries may not be executed |
| `explain` | The query explain mode |
| `unionDefaultGraph` | If the default graph should also contain the union of all named graphs |

When developing Comunica modules, all context entry keys can be found in [`@comunica/context-entries`](https://comunica.github.io/comunica/modules/context_entries.html). 

## 3. Defining sources

Using the `sources` context entry, data sources can be defined that Comunica should query over.
The value of this must be an array, where the array may contain both strings or objects:
* Array elements that are strings are interpreted as URLs, such as `'https://www.rubensworks.net/'` or `'https://fragments.dbpedia.org/2016-04/en'`.
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
const bindingsStream = await myEngine.queryBindings(`...`, {
  sources: [
    'https://fragments.dbpedia.org/2015/en',
    { type: 'hypermedia', value: 'https://fragments.dbpedia.org/2016/en' },
    { type: 'file', value: 'https://www.rubensworks.net/' },
    new N3Store(),
    { type: 'sparql', value: 'https://dbpedia.org/sparql' },
  ],
});
```

## 4. Defining an update destination

If you are executing an update query over more than one source,
then you need to specify the `destination` of the resulting update.
More details on this can be found in the guide on [updating in a JavaScript app](/docs/query/getting_started/update_app/).

## 5. Lenient execution

By default, Comunica will throw an error when it encounters an invalid **RDF document** or **HTTP URL**.
It is possible to **ignore these errors** and make Comunica ignore such invalid documents and URLs
by setting `lenient` to `true`:
```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  lenient: true,
});
```

## 6. Binding variables

Using the `initialBindings` context entry, it is possible to **bind** certain variables in the given query to terms before the query execution starts.
This may be valuable in case your SPARQL query is used as a template with some variables that need to be filled in.

This can be done by passing an [RDF/JS `Bindings`](http://rdf.js.org/query-spec/#bindings-interface) object as value to the `initialBindings` context entry:
```javascript
import { BindingsFactory } from '@comunica/bindings-factory';
import { DataFactory } from 'rdf-data-factory';

const DF = new DataFactory();
const BF = new BindingsFactory();

const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE {
  {?s ?p ?template1 } UNION { ?s ?p ?template2 }
}`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  initialBindings: BF.fromRecord({
    template1: factory.literal('Value1'),
    template2: factory.literal('Value2'),
  }),
});
```

`Bindings` can be created using any [RDF/JS `BindingsFactory`](http://rdf.js.org/query-spec/#bindingsfactory-interface),
such as [`@comunica/bindings-factory`](https://www.npmjs.com/package/@comunica/bindings-factory).
Learn more about the creation of these bindings objects in the [bindings guide](/docs/query/advanced/bindings/).

## 7. Setting the query format

By default, queries in Comunica are interpreted as SPARQL queries.
As such, the `queryFormat` entry defaults to `{ language: 'sparql', version: '1.1' }`.

Since Comunica is not tied to any specific **query format**, it is possible to change this to something else, such as `{ language: 'graphql', version: '1.0' }`.
More information on this can be found in the [GraphQL-LD guide](/docs/query/advanced/graphql_ld/).

## 8. Setting a Base IRI

Terms in SPARQL queries can be relative to a certain **Base IRI**.
Typically, you would use the `BASE` keyword in a SPARQL query to set this Base IRI.
If you want to set this Base IRI without modifying the query,
then you can define it in the context using `baseIRI`:

```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE {
  ?s </relative> ?o
}`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  baseIRI: 'http://example.org/',
});
```

## 9. Enabling a logger

A logger can be set using `log`.
More information on this can be found in the [logging guide](/docs/query/advanced/logging/).

## 10. Setting a custom date

Using `datetime`, a custom **date** can be set in Comunica.
The range of this field must always be a JavaScript `Date` object:

```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  date: new Date(),
});
```

This date is primarily used for the SPARQL `NOW()` operator.
It is also used when performing time travel querying using the [Memento protocol](/docs/query/advanced/memento/).

## 11. Enabling an HTTP proxy

All HTTP requests can be run through a proxy using `httpProxyHandler`.
More information on this can be found in the [HTTP proxy guide](/docs/query/advanced/proxying/).

## 12. Include credentials in HTTP requests

_Only applicable when running in the browser_

If this option is enabled, then all cross-site requests will be made using credentials of the current page.
This includes cookies, authorization headers or TLS client certificates.

Enabling this option has no effect on same-site requests.

```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  httpIncludeCredentials: true,
});
```

## 13. Send requests via HTTP basic authentication

Via HTTP Basic Authentication one can include **username and password** credentials in HTTP requests.
More information on this can be found in the [HTTP basic authentication guide](/docs/query/advanced/basic_auth/).

## 14. SPARQL extension functions

SPARQL allows non-standard, [custom extension functions](https://www.w3.org/TR/sparql11-query/#extensionFunctions) to be used within queries.
In order to provide an implementation to these extension functions,
Comunica allows developers to plug them in via the context.
More information on this can be found in the [SPARQL extension functions guide](/docs/query/advanced/extension_functions/).

## 15. Using a custom fetch function

By default, Comunica will use the built-in [`fetch` function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make HTTP requests.
It is however possible to pass a custom function that will be used instead for making HTTP requests,
as long as it follows the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

This can be done as follows:

```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  fetch: myfetchFunction,
});
```

_If you want to perform authenticated HTTP requests for Solid, you may want to consider using [Comunica Solid](https://comunica.dev/docs/query/advanced/solid/)._


## 16. HTTP Timeout

By default Communica does not apply any timeout on the HTTP requests done to external services. It is possible to add a timeout using the `httpTimeout` option which value is the timeout delay in milliseconds. For example to add an HTTP timeout of 60s:

```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  httpTimeout: 60_000,
});
```

It is also possible to make this timeout not only apply until the response starts streaming in but until the response body is fully consumed using the `httpBodyTimeout` boolean option. It is useful to limit cases like very long response streams:
```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  httpTimeout: 60_000,
  httpBodyTimeout: true
});
```

## 17. Union Default Graph

By default, Comunica will only query over the [default graph](https://www.w3.org/TR/sparql11-query/#unnamedGraph).
If you want to query over triples in other named graphs, you need to specify this via the `GRAPH`, `FROM`, or `FROM NAMED` clauses.
However, by setting the `unionDefaultGraph` context option to `true`, triples patterns will also apply to triples in the non-default graph. 

```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  unionDefaultGraph: true,
});
```
