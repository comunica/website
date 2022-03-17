---
title: 'Modify FAQ'
description: 'Frequently asked question about Comunica modification.'
---

Can't find an answer to your question?
Feel free to [ask us](/ask/), or have a look at the
[example](https://github.com/comunica/examples) repository.

## Should I publish my package to npm before I can use it?

While it is recommended to publish your reusable Comunica packages to npm, this is not required.
The [Components.js](/docs/modify/advanced/componentsjs/) dependency injection framework is able to work with packages that are locally linked to each other, as long as they are available in the `node_modules/` directory.

If you receive warnings in the form of `Detected remote context lookup for...`,
this usually means that Components.js was not able to find the corresponding package locally, and will [fallback to a remote context lookup](https://github.com/LinkedSoftwareDependencies/Components.js/discussions/82).
This can either be caused by an incorrect context URL, or a missing dependency in the `node_modules/` directory.

## How to query over a non-RDF source?

Adding support for new types of sources is typically done by adding a new actor to
the [RDF Resolve Quad Pattern bus](/docs/modify/advanced/buses/#rdf-resolve-quad-pattern).
[Click here](https://github.com/comunica/examples/tree/master/packages/actor-rdf-resolve-quad-pattern-api-weather)
to find an example on how to query over a JSON weather API source.

## How to count all triples that are received by the query engine?

[Click here](https://github.com/comunica/examples/tree/master/packages/actor-observe-rdf-dereference)
to find an example on how this can be done.
