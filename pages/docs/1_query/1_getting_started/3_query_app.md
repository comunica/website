---
title: 'Querying in a JavaScript app'
description: 'Execute SPARQL queries from within your application using the JavaScript API.'
---

The default Comunica query engine that exposes most standard features is Comunica SPARQL,
which uses the package name `@comunica/actor-init-sparql`.
In this guide, we will install it as a dependency in a [Node.js](https://nodejs.org/en/) JavaScript application,
and show how it can be used to execute queries.

## 1. Installation

In order to add Comunica SPARQL as a _dependency_ to your [Node.js](https://nodejs.org/en/) application,
we can execute the following command:
```bash
$ npm install @comunica/actor-init-sparql
```

## 2. Creating a new query engine

The easiest way to create an engine is as follows:

```javascript
const newEngine = require('@comunica/actor-init-sparql').newEngine;

const myEngine = newEngine();
```

You can reuse an engine as often as possible.
This is especially valuable if you repeatedly query over the same sources,
as [caching](/docs/query/advanced/caching/) can be performed. 

## 3. Executing SPARQL SELECT queries

Once you engine has been created, you can use it to execute any SPARQL query, such as a `SELECT` query:
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});
```

The first argument of `query()` is a SPARQL query string,
and the second argument is a [query context](/docs/query/advanced/context/) containing options,
which must at least contain an array of sources to query over. 

The contents of the `result` depend on the executed query.
If the query was a `SELECT` query, it will contain one or more **bindings** of the selected variables (`?s ?p ?o`).

<div class="note">
While the <code>sources</code> is the only required option in the query context,
<a href="/docs/query/advanced/context/">additional options can be passed</a>
to tweak how the engine executed the query.
</div>

### 3.1 Consuming binding results as a stream

The most efficient way to make use of the result,
is by adding a **data-listener** to the `bindingsStream`:
```javascript
result.bindingsStream.on('data', (binding) => {
    console.log(binding.get('?s').value);
    console.log(binding.get('?s').termType);

    console.log(binding.get('?p').value);

    console.log(binding.get('?o').value);
});
```

The data-listener will be invoked _for each resulting binding_,
as soon as the query engine has detected it.
This means that the data-listener can be invoked many times during query execution,
even if not all results are available yet.

Each `binding` is an [immutable](https://immutable-js.github.io/immutable-js/) object
that contains mappings from variable names to RDF terms.
Variable names are always preceded by `?`,
and bound RDF terms are represented as [RDF/JS](/docs/query/advanced/rdfjs/).

To find out when the query execution has **ended**,
and all results are passed to the data-listener,
an **end-listener** can be attached as well.
```javascript
result.bindingsStream.on('end', () => {
    // The data-listener will not be called anymore once we get here.
});
```

It is also considered good practise to add an **error-listener**,
so you can detect any problems that have occured during query execution:
```javascript
result.bindingsStream.on('error', (error) => {
    console.error(error);
});
```

### 3.2 Consuming binding results as an array

If performance is not an issue in your application,
or you just want the results in a simple array,
then you can make use of the asynchronous `bindings()` method:

```javascript
const bindings = await result.bindings();

console.log(bindings[0].get('?s').value);
console.log(bindings[0].get('?s').termType);
```

This method will return asychronously (using `await`) as soon as _all_ results have been found.
If you have many results, it is recommended to consume results iteratively with `bindingsStream` instead.

Each binding in the array is again an [immutable](https://immutable-js.github.io/immutable-js/) object
that contains mappings from variable names to RDF terms.
Variable names are always preceded by `?`,
and bound RDF terms are represented as [RDF/JS](/docs/query/advanced/rdfjs/).

## 4. Executing queries over multiple sources

Querying over more than one source is trivial,
as any number of sources can easily be passed via an array:
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: [
    'http://fragments.dbpedia.org/2015/en',
    'https://www.rubensworks.net',
    'https://ruben.verborgh.org/profile/',
  ],
});
```

## 5. Executing SPARQL CONSTRUCT queries

Next to `SELECT` queries, you can also execute a `CONSTRUCT` query to generate RDF quads/triples:
```javascript
const result = await myEngine.query(`
  CONSTRUCT WHERE {
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});
```

### 5.1 Consuming quad results as a stream

The most efficient way to make use of the resulting RDF quads,
is by adding a **data-listener** to the `quadStream`:
```javascript
result.quadStream.on('data', (quad) => {
    console.log(quad.subject.value);
    console.log(quad.predicate.value);
    console.log(quad.object.value);
    console.log(quad.graph.value);
});
```

The data-listener will be invoked _for each constructed RDF triple/quad_,
as soon as the query engine has created it.
This means that the data-listener can be invoked many times during query execution,
even if not all results are available yet.

Each `quad` is an [RDF/JS](/docs/query/advanced/rdfjs/) quad,
which contain `subject`, `predicate`, `object` and `graph` terms.

Just like `bindingsStream`, **end-listener** and **error-listener** can also be attached:

```javascript
result.quadStream.on('end', () => {
    // The data-listener will not be called anymore once we get here.
});
result.quadStream.on('error', (error) => {
    console.error(error);
});
```

### 5.2 Consuming quad results as an array

Just like with binding results,
if performance is not an issue in your application,
or you just want the results in a simple array,
then you can make use of the asynchronous `quads()` method:

```javascript
const quads = await result.quads();

console.log(quads[0].subject.value);
console.log(quads[0].predicate.value);
console.log(quads[0].object.value);
console.log(quads[0].graph.value);
```

This method will return asychronously (using `await`) as soon as _all_ results have been found.
If you have many results, it is recommended to consume results iteratively with `quadStream` instead.

Each `quad` is again an [RDF/JS](/docs/query/advanced/rdfjs/) quad,
which contain `subject`, `predicate`, `object` and `graph` terms.

## 6. Executing SPARQL ASK queries

One of the simplest forms SPARQL is the ASK query,
which can be executed in Comunica as follows:
```javascript
const result = await myEngine.query(`
ASK {
  ?s ?p <http://dbpedia.org/resource/Belgium>
}
`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
})
const hasMatches = await result.booleanResult;
```

The `booleanResult` field asychronously returns a boolean,
which indicates if the query has at least one result. 

## 7. Serializing to a specific result format

If you want your application to output query results in a certain text-based format,
just like [executing Comunica on the command line](/docs/query/getting_started/query_cli/),
then you can make use of the `resultToString()` method.

For example, serializing to SPARQL JSON can be done as follows:
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});
const { data } = await myEngine.resultToString(result,
  'application/sparql-results+json');
data.pipe(process.stdout); // Print to standard output
```

The `resultToString()` method accepts a query result and a result format media type.
The media type is optional, and will default to `application/json` for bindings, `application/trig` for quads, and `simple` for booleans.

<div class="note">
<a href="/docs/query/advanced/result_formats/">All available result formats</a> can be retrieved programmatically
by invoking the asynchronous <code>getResultMediaTypes()</code> method.
</div>
