---
title: 'Roadmap'
description: 'The long-term goals of Comunica'
---

This page gives an overview of the long-term goals of Comunica,
which is determined by the [Comunica Association](/association/).

[Interested in helping out? Find out more on how to contribute](/contribute/).

## Different forms of query execution

Comunica's current query execution model relies on defining a set of _data sources_ to query over.
While this traditional form of query execution works well in many cases,
it can be too constrained in cases where _data is spread over many sources across the Web_, which are interlinked.

One alternative form of query execution is [Link-Traversal-based Query Execution](https://arxiv.org/abs/1108.6328),
where _links are followed_ on the Web to find data.

A future goal of Comunica is the integration of such alternative forms of query exection.

## Future-oriented development

In addition to specification compliance, Comunica is being built with possible future specifications in mind.
Comunica should become a testbed for easily testing out new query features and techniques.
For instance, for efforts such as [RDF\*/SPARQL\*](https://blog.liu.se/olafhartig/2019/01/10/position-statement-rdf-star-and-sparql-star/)
and [SPARQL 1.2](https://github.com/w3c/sparql-12/).

While the architecture of Comunica has been built with this flexibility in mind,
some specific changes will need to be made before this is possible.
For instance, testing new SPARQL 1.2 query features will require the development of a new SPARQL query parser,
since our current parser ([SPARQL.js](https://github.com/RubenVerborgh/SPARQL.js/)) is [not flexible enough in that respect](https://github.com/comunica/comunica/issues/403).

## Improving overall performance

Comunica has been designed with modularity and flexibility as primary requirement,
while performance was a lower priority.
Nevertheless, [experiments](https://comunica.github.io/Article-ISWC2018-Resource/#comparison-tpf-client)
show that the performance Comunica of is still very similar to equivalent engines.

As Comunica is being used increasingly in more use cases,
for larger datasets and more complex queries,
specific [performance issues](https://github.com/comunica/comunica/issues?q=is%3Aissue+is%3Aopen+label%3A%22performance+%F0%9F%90%8C%22) are being identified.
In order to [resolve these](https://github.com/comunica/comunica/issues/846), new algorithms may need to be implemented,
or even some architectural changes may be required in some cases.

## Developer experience

Next to documentation, code-specific adjustments are needed
to make it easier for developers to work with and in Comunica.
For example, errors can sometimes be too cryptic, which hinders development.

A list of all open developer experience issues can be found
[here](https://github.com/comunica/comunica/issues?q=is%3Aissue+is%3Aopen+label%3A%22devx+%F0%9F%8E%A8%22).

## Documentation

In order to lower the entry barrier to Comunica,
[this website](https://github.com/comunica/website) is being built to act as a full reference guide.

The focus of the website is two-fold:

* Document how to query with Comunica
* Document how to modify Comunica

Both parts of the website should explain all possible capabilities of Comunica regarding querying and modification.
Furthermore, several guides on how to perform common tasks should be present.

## Alternative query languages

SPARQL is currently the (only) recommended way of querying knowdlege graphs that are represented in RDF.
However, there is a wide range of new graph query languages emerging, such as GraphQL, Cypher and GQL, each having their own advantages.
As such, being able to express queries over knowledge graphs in different languages may be valuable for different use cases.

For instance, [GraphQL-LD](/docs/query/advanced/graphql_ld/) already offers one alternative language in which queries can be expressed.
Compared to SPARQL, GraphQL-LD is less complex, but also less expressive.
