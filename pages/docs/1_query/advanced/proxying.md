---
title: 'HTTP Proxy'
description: 'All HTTP requests can optionally go through a proxy.'
---

Optionally, you can configure a proxy to redirect all HTTP(S) traffic.
This is for example useful when Comunica is used in a Web browser
where a [proxy enables CORS headers on all responses](https://www.npmjs.com/package/cors-anywhere).

## Proxying on the command line

Via the command line, a proxy can be enabled via the `-p` option as follows:
```bash
$ comunica-sparql http://fragments.dbpedia.org/2015-10/en "SELECT * WHERE { ?s ?p ?o }" \
  -p http://myproxy.org/?uri=
```

## Proxying in an application

When using [Comunica SPARQL in an application](/docs/query/getting_started/query_app/), a proxy can be set using the `httpProxyHandler` [context entry](/docs/query/advanced/context/):
```javascript
import { ProxyHandlerStatic } from "@comunica/actor-http-proxy";

const result = await myEngine.query('SELECT * WHERE { ?s ?p ?o }', {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  httpProxyHandler: new ProxyHandlerStatic('http://myproxy.org/?uri='),
});
```

In the example above, a `ProxyHandlerStatic` is passed,
which will simply put the URL `http://myproxy.org/?uri=` in front of all URLs that would be requested.

If you need a more advanced proxy behaviour,
then you can implement your own proxy handler.
All proxy handlers must implement the [`IProxyHandler` interface](https://github.com/comunica/comunica/blob/master/packages/actor-http-proxy/lib/IProxyHandler.ts).
