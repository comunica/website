---
title: 'Solid'
description: 'Solid – the Web-based decentralization ecosystem – can be queried with Comunica.'
---

## What is Solid

[Solid](https://solidproject.org/) is a Web-based decentralization ecosystem
where people are in control over their own data.

Solid achieves this by giving everyone control over their own **personal data pod**.
Applications are completely separate, and have to ask permission to access your data.

## Querying Solid pods with Comunica

Since Solid and Comunica have a compatible technology stack,
Comunica can be used to query over Solid data pods.
The default [Comunica SPARQL engine](/docs/query/getting_started/query_cli/)
can directly be used to query over public Solid data pods as long as you are querying over public data.

If you want to **query over data pods that require authentication**,
you can use [Comunica SPARQL Solid](https://github.com/comunica/comunica-feature-solid/tree/master/packages/actor-init-sparql-solid).
Hereafter, we list some examples on how to use it from the command line.
Please refer to the [README of Comunica SPARQL Solid](https://github.com/comunica/comunica-feature-solid/tree/master/packages/actor-init-sparql-solid#readme)
for more details around using it in JavaScript apps, or exposing documents as a SPARQL endpoint.

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

Please be aware that that there are several [open known issues](https://github.com/comunica/comunica-feature-solid/tree/master/packages/actor-init-sparql-solid#known-issues) relating to other software.

[LDflex](/docs/query/usage/#ldflex) and [GraphQL-LD](/docs/query/usage/#graphql-ld) are examples of tools that ship with Comunica SPARQL Solid.
