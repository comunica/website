---
title: 'HDT'
description: 'HDT offers highly compressed immutable RDF storage.'
---

[HDT](http://www.rdfhdt.org/) is a highly compressed RDF dataset format that enables efficient triple pattern querying.
Comunica enables executing SPARQL queries over HDT files,
as it is one of the supported [source types](/docs/query/advanced/source_types/).

Querying over HDT requires [Comunica SPARQL HDT package (`@comunica/actor-init-sparql-hdt`)](https://github.com/comunica/comunica-actor-init-sparql-hdt).

## 1. Installation

Since Comunica runs on Node.js, make sure you have [Node.js installed](https://nodejs.org/en/) on your machine.
HDT requires GCC 4.9 or higher to be available.

Next, we can install Comunica SPARQL on our machine:
```bash
$ npm install -g @comunica/actor-init-sparql-hdt
```

## 2. SPARQL querying over one HDT file

After installing Comunica SPARQL HDT, you will be given access to several commands including `comunica-sparql-hdt`,
which allows you to execute SPARQL queries from the command line.

Just like `comunica-sparql`,
this command requires one or more URLs to be provided as **sources** to query over.
As last argument, as **SPARQL query string** can be provided.

For example, the following query retrieves the first 100 triples a local HDT file:
```bash
$ comunica-sparql-hdt hdtFile@path/to/myfile.hdt \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100"
```

## 3. SPARQL querying over multiple HDT files

Just like `comunica-sparql`, querying over multiple sources simply requires you to pass them after each other:
```bash
$ comunica-sparql-hdt hdtFile@path/to/myfile1.hdt \
    hdtFile@path/to/myfile2.hdt \
    hdtFile@path/to/myfile3.hdt \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100"
```

## 4. Learn more

This guide only discussed the basic functionality of `comunica-sparql-hdt`.
You can learn more options by invoking the _help_ command, or by [reading the Comunica SPARQL documentation](/docs/query/getting_started/query_cli/):
```text
$ comunica-sparql-hdt --help
```

The API for [querying over HDT files in JavaScript apps is identical to Comunica SPARQL](/docs/query/getting_started/query_app/),
and just requires importing `@comunica/actor-init-sparql-hdt` instead of `@comunica/actor-init-sparql`.

In order to [set up a SPARQL endpoint, `comunica-sparql-hdt-http` can be used, just like Comunica SPARQL](/docs/query/getting_started/setup_endpoint/).
