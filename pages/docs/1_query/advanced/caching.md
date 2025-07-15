---
title: 'Caching'
description: 'When remote sources are requested, caching allows them to be reused in the future.'
---

When remote documents are fetched over HTTP, a Comunica engine can cache documents to optimize future reuse.
If [your application](/docs/query/getting_started/query_app/) works over volatile resources, then you may want to invalidate this cache,
which can be done as follows:

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
