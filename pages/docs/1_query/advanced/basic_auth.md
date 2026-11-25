---
title: 'HTTP Basic Authentication'
description: 'Send authenticated HTTP requests by including username and password.'
---

Via [HTTP Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
one can include **username and password** credentials in HTTP requests.
If you want to query such protected resources,
you can include this authentication information for _all_ HTTP requests,
or only for requests to _specific sources_. 

## Authentication on the command line

Via the command line, username and password can be included in the URL as follows:
```bash
$ comunica-sparql https://username:password@example.org/page \
  "SELECT * WHERE { ?s ?p ?o }"
```

## Authentication in an application

When using [Comunica SPARQL in an application](/docs/query/getting_started/query_app/), authentication information can be set using the `httpAuth` [context entry](/docs/query/advanced/context/):

Enabling basic authentication for _all_ HTTP requests:
```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  httpAuth: 'username:password',
});
```

Enabling basic authentication for _a specific source_:
```javascript
const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o }`, {
  sources: ['http://username:password@example.org/page'],
});
```

Additionally, `SERVICE` targets without credentials, where these targets are mentioned
in the list of query sources with credentials, will lead to these `SERVICE` clauses to be
evaluated by taking into account the credentials. This avoids the need of having to
include credentials within `SERVICE` targets within the query itself.

For example, basic authentication can be passed to a `SERVICE` target
without explicitly including credentials in the query as follows:

```typescript
const bindingsStream = await myEngine.queryBindings(`
  SELECT * WHERE {
    ?s ?p ?o,
  SERVICE <http://example.org/> {}
      ?s2 ?p ?o2.
  }
`, {
  sources: ['http://username:password@example.org/'],
});
```

