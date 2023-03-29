---
title: 'Roadmap'
description: 'The long-term goals of Comunica'
---

This page gives an overview of the long-term goals of Comunica in order of priority,
which is determined by the [Comunica Association](/association/).

[Interested in helping out? Find out more on how to contribute](/contribute/).

## Improving overall performance

_[All performance-related issues](https://github.com/comunica/comunica/labels/performance%20%F0%9F%90%8C)_

Comunica has been designed with modularity and flexibility as primary requirement,
while performance was a lower priority.
Nevertheless, [experiments](https://comunica.github.io/Article-ISWC2018-Resource/#comparison-tpf-client)
show that the performance Comunica of is still very similar to equivalent engines.

As Comunica is being used increasingly in more use cases,
for larger datasets and more complex queries,
specific [performance issues](https://github.com/comunica/comunica/issues?q=is%3Aissue+is%3Aopen+label%3A%22performance+%F0%9F%90%8C%22) are being identified.
In order to [resolve these](https://github.com/comunica/comunica/issues/846), new algorithms may need to be implemented,
upstream packages may need to be evaluated,
or even some architectural changes may be required in some cases.
Next to that, issues related to lowering the browser bundle size are also of interest.

## Developer experience

_[All devex-related issues](https://github.com/comunica/comunica/labels/devx%20%F0%9F%8E%A8)_

Code-specific improvements are possible
to make it easier for developers to work with and in Comunica.
For example, errors can sometimes be too cryptic, which hinders development.

A list of all open developer experience issues can be found
[here](https://github.com/comunica/comunica/issues?q=is%3Aissue+is%3Aopen+label%3A%22devx+%F0%9F%8E%A8%22).

## Outreach

_[All outreach-related issues](https://github.com/comunica/comunica/labels/outreach)_

We intend to connect with different communities that may have overlapping interests,
which we can do by lowering the barrier to entry for developers from other communities.
This can for example be achieved by providing pre-packaged versions of Comunica that work out-of-the-box in other environments,
such as for example [rollup.js](https://rollupjs.org/guide/en/).

## Future-oriented development

_[All future-oriented issues](https://github.com/comunica/comunica/labels/future-oriented)_

In addition to specification compliance, Comunica is being built with possible future specifications in mind.
Comunica should become a testbed for easily testing out new query features and techniques.
For instance, for efforts such as [RDF\*/SPARQL\*](https://blog.liu.se/olafhartig/2019/01/10/position-statement-rdf-star-and-sparql-star/)
and [SPARQL 1.2](https://github.com/w3c/sparql-12/).
This also includes making Comunica ready for new technologies such as [ESM](https://nodejs.org/api/esm.html) and [WebAssembly](https://webassembly.org/).

While the architecture of Comunica has been built with this flexibility in mind,
some specific changes will need to be made before this is possible.
For instance, testing new SPARQL 1.2 query features will require the development of a new SPARQL query parser,
since our current parser ([SPARQL.js](https://github.com/RubenVerborgh/SPARQL.js/)) is [not flexible enough in that respect](https://github.com/comunica/comunica/issues/403).

## Tangents

Below, you can find several topics that parts of the community are working on, but are not part of the general roadmap.

### Different forms of query execution

_Point of contact: [Ruben Taelman](https://www.rubensworks.net/contact/)_

Comunica's current query execution model relies on defining a set of _data sources_ to query over.
While this traditional form of query execution works well in many cases,
it can be too constrained in cases where _data is spread over many sources across the Web_, which are interlinked.

One alternative form of query execution is [Link-Traversal-based Query Execution](https://arxiv.org/abs/1108.6328),
where _links are followed_ on the Web to find data.

A future goal of Comunica is the integration of such alternative forms of query execution.

You can learn more about this work on our [experiments page](/research/#experiments).

### Alternative query languages

_Point of contact: [Ruben Taelman](https://www.rubensworks.net/contact/)_

SPARQL is currently the (only) recommended way of querying knowdlege graphs that are represented in RDF.
However, there is a wide range of new graph query languages emerging, such as GraphQL, Cypher and GQL, each having their own advantages.
As such, being able to express queries over knowledge graphs in different languages may be valuable for different use cases.

For instance, [GraphQL-LD](/docs/query/advanced/graphql_ld/) already offers one alternative language in which queries can be expressed.
Compared to SPARQL, GraphQL-LD is less complex, but also less expressive.

GeoSPARQL is another language that may be investigated in the future.


