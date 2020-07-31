---
title: 'Caching'
description: 'When remote sources are requested, caching allows them to be reused in the future.'
---

When remote documents are fetched over HTTP, a Comunica engine can cache documents to optimize future reuse.
If [your application](/docs/query/getting_started/query_app/) works over volatile resources, then you may want to invalidate this cache,
which can be done as follows:

```javascript
// Invalidate the full cache
myEngine.invalidateHttpCache();

// Invalidate a single document
myEngine.invalidateHttpCache('http://example.org/page.html');
```
