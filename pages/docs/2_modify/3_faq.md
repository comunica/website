---
title: 'Modify FAQ'
description: 'Frequently asked question about Comunica modification.'
---

Can't find an answer to your question?
Feel free to [ask us](/ask/), or have a look at the
[example](https://github.com/comunica/examples) repository.

## How to replace the HTTP actor with a Solid HTTP actor?

[Click here](https://github.com/comunica/examples/tree/master/packages/configure-sparql-http-solid)
to find an example on how this can be done.

## How to query over a non-RDF source?

Adding support for new types of sources is typically done by adding a new actor to
the [RDF Resolve Quad Pattern bus](/docs/modify/advanced/buses/#rdf-resolve-quad-pattern).
[Click here](https://github.com/comunica/examples/tree/master/packages/actor-rdf-resolve-quad-pattern-api-weather)
to find an example on how to query over a JSON weather API source.

## How to count all triples that are received by the query engine?

[Click here](https://github.com/comunica/examples/tree/master/packages/actor-observe-rdf-dereference)
to find an example on how this can be done.
