---
title: 'Solid'
description: 'Solid – the Web-based decentralization ecosystem – can be queried with Comunica.'
---

## What is Solid

[Solid](https://solidproject.org/) is a Web-based decentralization ecosystem
where people are in control over their own data.

Solid achieves this by giving everyone control over their own **personal data pod**.
Applications are completely separate, and have to ask permission to access your data.

Since Solid and Comunica have a compatible technology stack,
Comunica can be used to query over one or more Solid data pods.

This document describes the different approaches that exist for querying Solid pods using Comunica.

In summary, there are three main approaches for querying Solid pods with Comunica:
1. **Query specific public documents**: Comunica SPARQL (`@comunica/query-sparql`)
2. **Query specific private documents**: Comunica SPARQL (`@comunica/query-sparql`) and pass authenticated fetch function, or Comunica SPARQL Solid (`@comunica/query-sparql-solid`)
3. **Query pods using link traversal** (_experimental_): Comunica SPARQL Link Traversal Solid (`@comunica/query-sparql-link-traversal-solid`)

## 1. Query specific public documents in Solid pods

If you have prior knowledge of what documents in a Solid pod contain the data you want to query over,
and these documents do not require authentication,
then you can directly query over these documents using the default [Comunica SPARQL engine](/docs/query/getting_started/query_cli/)
as a traditional federated query.

**Querying from JavaScript**:
```typescript
import { QueryEngine } from '@comunica/query-sparql';

const myEngine = new QueryEngine();

const bindingsStream = await myEngine.queryBindings(`
  SELECT * { ?s ?p ?o }`, {
  sources: ['https://pod1.org/document1.ttl', 'https://pod2.org/document2.ttl'],
});
```

**Querying from the command line**:
```bash
$ comunica-sparql https://pod1.org/document1.ttl https://pod2.org/document2.ttl \
    "SELECT * { ?s ?p ?o }"
```

<div class="note">
While the examples above show querying over multiple documents in Solid pods,
<a href="/docs/query/advanced/source_types/">other types of sources</a> (such as SPARQL endpoints, RDF files, etc.) can also be used in combination with Solid pods in the same query.
</div>

## 2. Query specific private documents in Solid pods

Similar to the previous approach, you can also query specific documents in Solid pods that require authentication.

For this, you can use Comunica in combination with libraries such as [@inrupt/solid-client-authn-node](https://www.npmjs.com/package/@inrupt/solid-client-authn-node)
and [@inrupt/solid-client-authn-browser](https://www.npmjs.com/package/@inrupt/solid-client-authn-browser) that allow you to authenticate with your Solid WebID.
These libraries provide a custom `fetch` function, using which you can execute authenticated HTTP requests.

You can forward this fetch function to Comunica SPARQL to make it perform authenticated queries to pods as shown below.

**Querying from JavaScript with Comunica SPARQL**:
```typescript
import { QueryEngine } from '@comunica/query-sparql';
import { Session } from '@inrupt/solid-client-authn-node';

const session = new Session();
const myEngine = new QueryEngine();

await session.login({ ... }); // Log in as explained in https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-nodejs-web-server/

const bindingsStream = await myEngine.queryBindings(`
  SELECT * WHERE {
      ?s ?p ?o
  } LIMIT 100`, {
  // Set your profile as query source
  sources: [session.info.webId],
  // Pass the authenticated fetch function
  fetch: session.fetch,
});
```

<div class="note">
You can also try out authenticated queries to your Solid pods via our
<a href="https://query.comunica.dev/">live web client</a>.
To enable authentication, click the gear icon, fill in your Identity Provider, and press the "Log in" button.
</div>

Alternatively, you can use the dedicated [Comunica SPARQL Solid](https://github.com/comunica/comunica-feature-solid/tree/master/engines/query-sparql-solid),
which allows you to pass your authenticated Solid session object.
Hereafter, we list some examples on how to use it from JavaScript and the command line.
Please refer to the [README of Comunica SPARQL Solid](https://github.com/comunica/comunica-feature-solid/tree/master/engines/query-sparql-solid#readme)
for more details.

**Querying from JavaScript Comunica SPARQL Solid**:
```typescript
import { QueryEngine } from '@comunica/query-sparql-solid';
import { Session } from '@inrupt/solid-client-authn-node';

const session = new Session();
const myEngine = new QueryEngine();

await session.login({ ... }); // Log in as explained in https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-nodejs-web-server/

const bindingsStream = await myEngine.queryBindings(`
  SELECT * WHERE {
      ?s ?p ?o
  } LIMIT 100`, {
  // Set your profile as query source
  sources: [session.info.webId],
  // Pass your authenticated session
  '@comunica/actor-http-inrupt-solid-client-authn:session': session,
});
```

**Querying an existing document**:
```bash
$ comunica-sparql-solid --idp https://solidcommunity.net/ \
  http://example.org/existing-document.ttl \
  "SELECT * { ?s ?p ?o }"
```

**Creating a new document**:
```bash
$ comunica-sparql-solid --idp https://solidcommunity.net/ \
  http://example.org/new-document.ttl \
  "INSERT DATA { <ex:s> <ex:p> <ex:o> }"
```

**Updating an existing document**:
```bash
$ comunica-sparql-solid --idp https://solidcommunity.net/ \
  http://example.org/existing-document.ttl \
  "INSERT DATA { <ex:s> <ex:p> <ex:o> }"
```

Please be aware that that there are several [open known issues](https://github.com/comunica/comunica-feature-solid/tree/master/engines/query-sparql-solid#known-issues) relating to other software.

[LDflex](/docs/query/usage/#ldflex) and [GraphQL-LD](/docs/query/usage/#graphql-ld) are examples of tools that ship with Comunica SPARQL Solid.

## 3. Query pods using link traversal

The approaches for querying Solid mentioned above require you to know upfront in which pod and in which documents
your data resides before you can query over it.
[_Comunica SPARQL Link Traversal Solid_](https://github.com/comunica/comunica-feature-link-traversal/tree/master/engines/query-sparql-link-traversal-solid#comunica-sparql-link-traversal)
provides a way to query over Solid pods without having to know beforehand in which documents the necessary data resides in.
It does this by following links between documents _during query execution_.

This is still an **experimental query approach**, which does not yet work well for complex queries.
Learn more about active [research on link traversal in Solid](https://comunica.dev/research/link_traversal/).

The example below executes a query across multiple simulated Solid pods to find all messages by a certain creator:

```typescript
import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid';

const myEngine = new QueryEngine();
const bindingsStream = await myEngine.queryBindings(`
  PREFIX snvoc: <https://solidbench.linkeddatafragments.org/www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/>
  SELECT DISTINCT ?forumId ?forumTitle WHERE {
    ?message snvoc:hasCreator <https://solidbench.linkeddatafragments.org/pods/00000006597069767117/profile/card#me>.
    ?forum snvoc:containerOf ?message;
      snvoc:id ?forumId;
      snvoc:title ?forumTitle.
  }`, {
    // Sources field is optional. Will be derived from query if not provided.
    //sources: [session.info.webId], // Sets your profile as query source
    // Session is optional for authenticated requests
    //'@comunica/actor-http-inrupt-solid-client-authn:session': session,
    // The lenient flag will make the engine not crash on invalid documents
    lenient: true,
});
```

Try out this query above in our [live demo](https://comunica.github.io/comunica-feature-link-traversal-web-clients/builds/solid-default/#query=PREFIX%20snvoc%3A%20%3Chttps%3A%2F%2Fsolidbench.linkeddatafragments.org%2Fwww.ldbc.eu%2Fldbc_socialnet%2F1.0%2Fvocabulary%2F%3E%0ASELECT%20DISTINCT%20%3FforumId%20%3FforumTitle%20WHERE%20%7B%0A%20%20%3Fmessage%20snvoc%3AhasCreator%20%3Chttps%3A%2F%2Fsolidbench.linkeddatafragments.org%2Fpods%2F00000006597069767117%2Fprofile%2Fcard%23me%3E.%0A%20%20%3Fforum%20snvoc%3AcontainerOf%20%3Fmessage%3B%0A%20%20%20%20snvoc%3Aid%20%3FforumId%3B%0A%20%20%20%20snvoc%3Atitle%20%3FforumTitle.%0A%7D).
