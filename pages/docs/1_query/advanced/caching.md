---
title: 'Caching'
description: 'When remote sources are requested, caching allows them to be reused in the future.'
---

When remote documents are fetched over HTTP, Comunica engine uses HTTP-dependent intermediary caches
(e.g. in-memory triple indexes, JSON-LD contexts) to optimize future reuse.
These intermediary caches are aware of HTTP caching semantics (e.g. [RFC 7234/9111](https://httpwg.org/specs/rfc9111.html)),
so that these caches can be reused across query executions if the cached value is still valid.

<div class="note">
Within the scope of a single query execution, HTTP responses are always assumed to be cacheable,
even if no caching headers were defined for them.
</div>

## Cache invalidation

If you forcefully want to invalidate the cache within [your application](/docs/query/getting_started/query_app/),
you can do this as follows:

```javascript
// Invalidate the full cache
await myEngine.invalidateHttpCache();

// Invalidate a single document
await myEngine.invalidateHttpCache('http://example.org/page.html');
```

Optionally, you can also pass the `noCache: true` flag to your context to invalidate the cache before query execution starts:

```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['http://xmlns.com/foaf/spec/20140114.rdf'],
  noCache: true,
});
```

## HTTP-level caching

By default, Comunica only uses intermediary caches such as triple indexes,
but it does not cache actual HTTP responses.
This in-memory HTTP cache can be enabled separately as follows:

```javascript
const bindingsStream = await myEngine.queryBindings(`CONSTRUCT WHERE { ?s1 ?p1 ?o1. ?s2 ?p2 ?o2 }`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
  httpCache: true,
});
```
