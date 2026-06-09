---
title: 'Query with experimental SPARQL features'
description: 'If you want to make use of non-standard SPARQL features'
---

Comunica SPARQL Next offers non-standardized SPARQL features within Comunica.


## 1. Installation

Since Comunica runs on Node.js, make sure you have [Node.js installed](https://nodejs.org/en/) on your machine.

Next, we can install Comunica SPARQL Next on our machine:
```bash
$ npm install -g @comunica/query-sparql-next
```

## Features

This "next" version supports the same features as `@comunica/query-sparql`
(see the other documentation pages on this website), adding additional language features ontop of it.
This means we support [SPARQL 1.2](https://www.w3.org/TR/sparql12-query/)
and additional language features listed bellow.

<div class="note">
Comunica SPARQL Next is built on the same foundation as base Comunica.
This means that we package a default configuration,
but you are free to package your own version of the engine, adding or removing features as you please
(see [Modify Comunica](https://comunica.dev/docs/modify/) for more information). 
</div>


<div class="note">
We are activelly adding features to this feature repository, see the repository for updates:
https://github.com/comunica/comunica-feature-next/pulls
</div>


## Learn more

This guide only discusses the basic functionality of `comunica-sparql-next`.
You can learn more options by invoking the _help_ command, or by [reading the Comunica SPARQL documentation](/docs/query/getting_started/query_cli/):
```text
$ comunica-sparql-next --help
```

The API for [querying using non-standardized SPARQL in JavaScript apps is identical to Comunica SPARQL](/docs/query/getting_started/query_app/),
and just requires importing `@comunica/query-sparql-next` instead of `@comunica/query-sparql`.

In order to [set up a SPARQL endpoint, `comunica-sparql-next-http` can be used, just like Comunica SPARQL](/docs/query/getting_started/setup_endpoint/).


### Contribution

The "next" version is maintained in its own feature repository: [comunica-feature-next](https://github.com/comunica/comunica-feature-next/).
