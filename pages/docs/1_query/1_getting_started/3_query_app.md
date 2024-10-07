---
title: 'Querying in a JavaScript app'
description: 'Execute SPARQL queries from within your application using the JavaScript API.'
---

The default Comunica query engine that exposes most standard features is Comunica SPARQL,
which uses the package name `@comunica/query-sparql`.
In this guide, we will install it as a dependency in a [Node.js](https://nodejs.org/en/) JavaScript application,
and show how it can be used to execute queries.

<div class="video">
Watch part of this guide in action <em>live</em> within this <a href="https://youtu.be/ydpdziVNw1k?t=1175">Webinar recording</a>.
</div>

## 1. Installation

<div class="note">
This assumes you already have an npm package.
If you don't have one yet, create one using <code>npm init</code>.
You will also need a JavaScript file to write in, such as <code>main.js</code>.
</div>

In order to add Comunica SPARQL as a _dependency_ to your [Node.js](https://nodejs.org/en/) application,
we can execute the following command:
```bash
$ npm install @comunica/query-sparql
```

## 2. Creating a new query engine

The easiest way to create an engine is as follows:

```javascript
const QueryEngine = require('@comunica/query-sparql').QueryEngine;

const myEngine = new QueryEngine();
```

You can reuse an engine as often as possible.
This is especially valuable if you repeatedly query over the same sources,
as [caching](/docs/query/advanced/caching/) can be performed. 

## 3. Executing SPARQL SELECT queries

Once you engine has been created, you can use it to execute any SPARQL query, such as a `SELECT` query:
```javascript
const bindingsStream = await myEngine.queryBindings(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
});
```

The first argument of `queryBindings()` is a SPARQL query string,
and the second argument is a [query context](/docs/query/advanced/context/) containing options,
which must at least contain an array of sources to query over. 

The resulting `bindingsStream` is a stream of **bindings**,
where each binding contains values for the selected variables (`?s ?p ?o`).

<div class="note">
While the <code>sources</code> is the only required option in the query context,
<a href="/docs/query/advanced/context/">additional options can be passed</a>
to tweak how the engine executed the query.
</div>

### 3.1 Consuming binding results as a stream

The most efficient way to make use of the result,
is by adding a **data-listener** to the `bindingsStream`:
```javascript
bindingsStream.on('data', (binding) => {
    console.log(binding.toString()); // Quick way to print bindings for testing

    console.log(binding.has('s')); // Will be true
    
    // Obtaining values
    console.log(binding.get('s').value);
    console.log(binding.get('s').termType);
    console.log(binding.get('p').value);
    console.log(binding.get('o').value);
});
```

The data-listener will be invoked _for each resulting binding_,
as soon as the query engine has detected it.
This means that the data-listener can be invoked many times during query execution,
even if not all results are available yet.

Each `binding` is an [RDF/JS `Bindings`](http://rdf.js.org/query-spec/#bindings-interface) object
that contains mappings from variables to RDF terms.
Variable names can either be obtained by string label (without the `?` prefix) or via [RDF/JS](/docs/query/advanced/rdfjs/) variable objects,
and bound RDF terms are represented as [RDF/JS](/docs/query/advanced/rdfjs/) terms.
Learn more about the usage of these bindings objects in the [bindings guide](/docs/query/advanced/bindings/).

To find out when the query execution has **ended**,
and all results are passed to the data-listener,
an **end-listener** can be attached as well.
```javascript
bindingsStream.on('end', () => {
    // The data-listener will not be called anymore once we get here.
});
```

It is also considered good practise to add an **error-listener**,
so you can detect any problems that have occurred during query execution:
```javascript
bindingsStream.on('error', (error) => {
    console.error(error);
});
```

### 3.2 Consuming binding results as an async iterable

Using a for-await loop, you can consume bindings as an [async iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols).
While this is more compact than the stream-based approach, it may lead to a slightly lower level of performance:

```javascript
for await (const bindings of bindingsStream) {
    console.log(bindings.get('s').value);
    console.log(bindings.get('s').termType);
}
```

### 3.3 Consuming binding results as an array

If performance is not an issue in your application,
or you just want the results in a simple array,
then you can call the asynchronous `toArray()` method on the `bindingsStream`:

```javascript
const bindings = await bindingsStream.toArray();

console.log(bindings[0].get('s').value);
console.log(bindings[0].get('s').termType);
```

This method will return asychronously (using `await`) as soon as _all_ results have been found.
If you have many results, it is recommended to consume results iteratively via a data listener instead.

Each binding in the array is again an [RDF/JS `Bindings`](http://rdf.js.org/query-spec/#bindings-interface) object.

If you want to limit the number of results in the array, you can optionally pass a limit:
```javascript
const bindings = await bindingsStream.toArray({ limit: 100 });
```

## 4. Executing queries over multiple sources

Querying over more than one source is trivial,
as any number of sources can easily be passed via an array:
```javascript
const bindingsStream = await myEngine.queryBindings(`
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
const quadStream = await myEngine.queryQuads(`
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
quadStream.on('data', (quad) => {
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
quadStream.on('end', () => {
    // The data-listener will not be called anymore once we get here.
});
quadStream.on('error', (error) => {
    console.error(error);
});
```

### 5.2 Consuming quad results as an async iterable

Just like with binding results,
quads can also be consumed using for-await.:

```javascript
for await (const quad of quadStream) {
    console.log(quad.subject.value);
    console.log(quad.predicate.value);
    console.log(quad.object.value);
    console.log(quad.graph.value);
}

```

### 5.3 Consuming quad results as an array

Just like with binding results,
if performance is not an issue in your application,
or you just want the results in a simple array,
then you can call the asynchronous `toArray()` method on the `bindingsStream`:

```javascript
const quads = await quadStream.toArray();

console.log(quads[0].subject.value);
console.log(quads[0].predicate.value);
console.log(quads[0].object.value);
console.log(quads[0].graph.value);
```

This method will return asychronously (using `await`) as soon as _all_ results have been found.
If you have many results, it is recommended to consume results iteratively via a data listener instead.

Each `quad` is again an [RDF/JS](/docs/query/advanced/rdfjs/) quad,
which contain `subject`, `predicate`, `object` and `graph` terms.

## 6. Executing SPARQL ASK queries

One of the simplest forms SPARQL is the ASK query,
which can be executed in Comunica as follows:
```javascript
const hasMatches = await myEngine.queryBoolean(`
  ASK {
    ?s ?p <http://dbpedia.org/resource/Belgium>
  }`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
})
```

The value of `hasMatches` indicates if the query has at least one result. 

## 7. Executing a generic query

If you don't know beforehand if your query is a `SELECT`, `CONSTRUCT`, or `ASK` (e.g. if your app accepts queries via user input),
then you can make use of the generic `query` method that supports all query types:
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

if (result.resultType === 'bindings') {
    const bindingsStream = await result.execute();

    bindingsStream.on('data', (binding) => {
        console.log(binding.toString());
    });
}
```

The resulting object represents a _future_ to the query results.
If has a field `resultType` that indicates the query and result type, which can be `'bindings'`, `'quads'`, `'boolean'`, or `'void'`.
The asynchronous `execute` method effectively executes the query, and returns a result depending on the `resultType`, corresponding to the `queryBindings`, `queryQuads`, ... methods.
For example, if the result type is `'bindings'`, then the return type of `execute` will be a bindings stream.

### 7.1. Obtaining metadata

Optionally, you can also obtain metadata about the results via this `query` method for the `'bindings'` and `'quads'` result types:
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

if (result.resultType === 'bindings') {
    const metadata = await result.metadata();
    console.log(metadata.cardinality);
    console.log(metadata.variables);
}
```

### 7.2. Iterating bindings in the SELECTed order

Iteration over a single bindings object can be done as follows:
```typescript
// Iterate over all entries
for (const [ key, value ] of bindings) {
  console.log(key);
  console.log(value);
}
```

Due to performance reasons,
the iteration order of these bindings is not defined,
and may vary across runs and queries.

If you have a `SELECT` query, and you want to iterate in bindings
using the same order as your variables are listed in the `SELECT` clause,
then you can make use of the metadata's variables as follows:
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

if (result.resultType === 'bindings') {
    const variables = (await result.metadata()).variables; // Variables are always in ?s, ?p, ?o order
    for await (const bindings of await result.execute()) {
        for (const variable of variables) {
            console.log(bindings.get(variable).value);
        }
    }
}
```

## 8. Serializing to a specific result format

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
