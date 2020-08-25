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
can directly be used to query over public Solid data pods.

If you want to query over data pods that require authentication,
you will have to plug in [the Solid-specific HTTP actor](https://github.com/comunica/actor-http-solid-auth-fetch).
The easiest way to do this is by either making use of [LDflex](/docs/query/usage/#ldflex)
or [GraphQL-LD](/docs/query/usage/#graphql-ld) that ship with this Solid-specific actor by default.
Alternatively, you can [plug this Solid-specific actor into your own Comunica instance](https://github.com/comunica/examples/tree/master/packages/configure-sparql-http-solid#readme).
