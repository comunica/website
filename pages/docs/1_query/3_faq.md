---
title: 'Querying FAQ'
description: 'Frequently asked questions about using Comunica.'
---

Feel free to [ask us](/ask/), or have a look at the
[example](https://github.com/comunica/examples) repository.

## How can I query over RDF documents on my local file system?

Instead of using Comunica SPARQL, you can use [Comunica SPARQL File](/docs/query/getting_started/query_cli_file/)
to query over files on your local file system.

Comunica SPARQL by default does not allow you to query over local file for security reasons.

## How to query over sources in memory?

[Comunica SPARQL RDF/JS](/docs/query/advanced/rdfjs_querying/) can be used for in-memory querying.

## How are result bindings and quads represented in JavaScript?

SELECT query results will be contained in a `bindingsStream`,
where each data element is a `Binding`.
Each `binding` is an [RDF/JS `Bindings`](http://rdf.js.org/query-spec/#bindings-interface) object
that contains mappings from variables to RDF terms.
Variable names can either be obtained by string label (without the `?` prefix) or via [RDF/JS](/docs/query/advanced/rdfjs/) variable objects,
and bound RDF terms are represented as [RDF/JS](/docs/query/advanced/rdfjs/) terms.
For example:
```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT ...`, {...});
bindingsStream.on('data', (binding) => {
    console.log(binding.get('s').value);
    console.log(binding.get('s').termType);
});
```
Learn more about the usage of these bindings objects in the [bindings guide](/docs/query/advanced/bindings/).

CONSTRUCT query results will be contained in a `quadStream`,
where each data element is an [RDF/JS](/docs/query/advanced/rdfjs/) quad.
For example:
```javascript
const quadStream = await myEngine.queryQuads(`CONSTRUCT ...`, {...});
quadStream.on('data', (quad) => {
    console.log(quad.subject.value);
    console.log(quad.predicate.value);
    console.log(quad.object.value);
    console.log(quad.graph.value);
});
```

Read more about this in the [guide om executing SPARQL queries in JavaScript applications](/docs/query/getting_started/query_app/).

## What datastructure is behind `bindingsStream` and `quadStream`?

Query results can be returned via `bindingsStream` (SELECT queries) and `quadStream` (CONSTRUCT) queries.

These streams are backed by an [AsyncIterator](https://github.com/RubenVerborgh/AsyncIterator),
which is a lightweight JavaScript implementation of demand-driven object streams.
As opposed to Node's `Stream`, you cannot push anything into an `AsyncIterator`;
instead, an iterator pulls things from another iterator.

Furthermore, these streams are _lazy_,
which means that the results will only be calculated once you request them,
and an `'end'` event will only be emitted when all of them have been consumed.

## I need a specific feature, how do I get it into Comunica?

Since Comunica is an open-source project,
the best way to get new features in, is by [contributing yourself](/contribute/).

Alternatively, you can delegate implementation work to a third-party via the [Comunica Association](/association/).

## How to measure query performance with Comunica?

### Simple statistics

The easiest way to get statistics on the performance of a specific query
is by using the `'stats'` [result format](/docs/query/advanced/result_formats/).
This will print the number of results, their delay from query start,
and the number of HTTP requests that have been executed up until the result was available.

For example, stats can be printed via the command line as follows:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    -t stats \
    'SELECT * WHERE { ?s ?p ?o } LIMIT 10'
Result,Delay (ms),HTTP requests
1,265.488428,2
2,265.7177,2
3,265.889677,2
4,266.141152,2
5,266.332423,2
6,266.496283,2
7,266.674167,2
8,266.861855,2
9,268.330294,2
10,268.51177,2
TOTAL,268.816168,2
```

### Enabling production-mode

If you want to do benchmarking with Comunica in Node.js, make sure to run Node.js in production mode as follows:

```
$ NODE_ENV=production comunica-sparql ...
```

The reason for this is that Comunica extensively generates internal Error objects. In non-production mode, these also produce long stacktraces, which may in some cases impact performance.

### More advanced experiments

A more advanced tool for setting up large-scale reproducible Comunica experiments is [Comunica Bencher](https://github.com/comunica/comunica-bencher).
