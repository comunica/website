---
title: 'Extensions'
description: 'Existing extensions of Comunica.'
---

Different default configurations of Comunica are provided,
such as [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql#readme),
[Comunica SPARQL File](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql-file#readme),
and [Comunica SPARQL RDF/JS](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql-rdfjs#readme).
Next to those, several extensions and modified versions exist of Comunica that offer specific functionality.

Feel free to [contact us](/ask/) if you want your extension of Comunica added to this list.

## Examples

The [Comunica Examples](https://github.com/comunica/examples) repository
contains a number of example packages that explain and illustrate how to create customized Comunica packages.

## Solid

[`@comunica/actor-http-solid-auth-fetch`](https://github.com/comunica/actor-http-solid-auth-fetch)
is an [HTTP actor](/docs/modify/advanced/buses/#http) that takes into account Solid authentication
when performing HTTP requests.

Read more about this in [our guide on Solid](/docs/query/advanced/solid/).

## AMF

[Comunica AMF](https://github.com/comunica/comunica-feature-amf)
provides a set of experimental actors that handle _approximate membership functions_, such as Bloom filters.
Read more about this in [this article](https://comunica.github.io/Article-SSWS2020-AMF/).

## HDT

[`@comunica/comunica-actor-rdf-resolve-quad-pattern-hdt`](https://github.com/comunica/comunica-actor-rdf-resolve-quad-pattern-hdt)
is a package that enables [resolving a quad pattern](/docs/modify/advanced/buses/#rdf-resolve-quad-pattern) over HDT files.
The [Comunica SPARQL HDT package](https://github.com/comunica/comunica-actor-init-sparql-hdt#readme)
provides a default configuration that adds full SPARQL query support using other actors from Comunica SPARQL.

Read more about this in [our guide on querying over HDT](/docs/query/advanced/hdt/).

## OSTRICH

[OSTRICH](https://github.com/rdfostrich) is a versioned RDF triple store.

[`@comunica/actor-rdf-resolve-quad-pattern-ostrich`](https://github.com/rdfostrich/comunica-actor-rdf-resolve-quad-pattern-ostrich)
is a package that enables [resolving a quad pattern](/docs/modify/advanced/buses/#rdf-resolve-quad-pattern) over OSTRICH files.
It determines the version to query over from the context.

[`@comunica/actor-query-operation-contextify-version`](https://github.com/rdfostrich/comunica-actor-query-operation-contextify-version)
is a package that detects graph-based version [operations](/docs/modify/advanced/buses/#query-operation)
and rewrites them to operations with a version context.

The [Comunica SPARQL OSTRICH package](https://github.com/rdfostrich/comunica-actor-init-sparql-ostrich#readme)
provides a default configuration that adds full SPARQL query support using other actors from Comunica SPARQL.
