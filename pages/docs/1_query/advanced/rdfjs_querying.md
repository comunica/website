---
title: 'Querying over RDF/JS sources'
description: 'If the built-in source types are not sufficient, you can pass a custom JavaScript object implementing a specific interface.'
---

Two of the [different types of sources](/docs/query/advanced/source_types/) that are supported by Comunica
are the [RDF/JS `Source` interface](http://rdf.js.org/stream-spec/#source-interface) and the [RDF/JS `DatasetCore` interface](https://rdf.js.org/dataset-spec/#datasetcore-interface).
These allow you to pass objects as source to Comunica as long as they implement one of the interfaces.

An RDF/JS `Source` exposes the [`match`](http://rdf.js.org/stream-spec/#source-interface) method
that allows quad pattern queries to be executed,
and matching quads to be returned as a stream. An RDF/JS `DatasetCore` also exposes a [`match`](https://rdf.js.org/dataset-spec/#datasetcore-interface) method which returns a `Dataset` instead of a stream.

<div class="note">
Learn more about RDF/JS in this <a href="/docs/query/advanced/rdfjs/">RDF/JS guide</a>.
</div>

Several implementations of these `Source` and `DatasetCore` interfaces exist.
In the example below, we make use of the [`Store` from `N3.js`](https://github.com/rdfjs/N3.js#storing) (which implements both interfaces),
that offers one possible implementation when you want to [query over it with Comunica within a JavaScript application](/docs/query/getting_started/query_app/):
```javascript
const store = new N3.Store();
store.addQuad(
  namedNode('http://ex.org/Pluto'),
  namedNode('http://ex.org/type'),
  namedNode('http://ex.org/Dog')
);
store.addQuad(
  namedNode('http://ex.org/Mickey'),
  namedNode('http://ex.org/type'),
  namedNode('http://ex.org/Mouse')
);

const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: [store],
});
```

<div class="note">
If an object implements both the RDF/JS `Source` and RDF/JS `DatasetCore`, then the source implementation is used.
</div>

<div class="note">
Instead of the default Comunica SPARQL package (<code>@comunica/query-sparql</code>),
the <a href="https://github.com/comunica/comunica/tree/master/engines/query-sparql-rdfjs#readme">Comunica SPARQL RDF/JS (<code>@comunica/query-sparql-rdfjs</code>)</a>
can also be used as a more lightweight alternative
that <i>only</i> allows querying over RDF/JS sources.
</div>

<div class="note">
If the RDF/JS `Source` also implements the RDF/JS <a href="http://rdf.js.org/stream-spec/#store-interface"><code>Store</code> interface</a>,
then it is also supports <a href="/docs/query/advanced/rdfjs_updating/">update queries</a> to add, change or delete quads in the store.
</div>

## Optional: query optimization

The RDFJS [Source interface](http://rdf.js.org/#source-interface) by default only exposed the `match` method.
In order to allow Comunica to produce more efficient query plans,
you can optionally expose a `countQuads` method that has the same signature as `match`,
but returns a `number` or `Promise<number>` that represents (an estimate of)
the number of quads that would match the given quad pattern.
Certain `Source` implementations may be able to provide an efficient implementation of this method,
which would lead to better query performance.

If Comunica does not detect a `countQuads` method, it will fallback to a sub-optimal counting mechanism
where `match` will be called again to manually count the number of matches.
