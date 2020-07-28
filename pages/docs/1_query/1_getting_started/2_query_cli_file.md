---
title: 'Querying local files from the command line'
description: 'Execute SPARQL queries over local RDF files directly from the command line.'
---

Using Comunica SPARQL File, you can query over RDF files that are stored on your local machine.

<div class="note">
While Comunica SPARQL allows you to <a href="/docs/query/getting_started/query_cli/">query sources exposed via URLs on the command line</a>,
it does _not_ allow you to query RDF local files.
This is because Comunica SPARQL can be used in a variety of use cases, of which deployment on a public server is one.
In some of these cases, the ability to access the local file system can imply a major security risk,
which is why we require the use of a separate package. 
</div>

## 1. Installation

Since Comunica runs on Node.js, make sure you have [Node.js installed](https://nodejs.org/en/) on your machine.

Next, we can install Comunica SPARQL on our machine:
```bash
$ npm install -g @comunica/actor-init-sparql-file
```

## 2. SPARQL querying over one local file

After installing Comunica SPARQL, you will be given access to several commands including `comunica-sparql-file`,
which allows you to execute SPARQL queries from the command line.

Just like `comunica-sparql`, this command requires one or more URLs to be provided as **sources** to query over.
As last argument, as **SPARQL query string** can be provided.

For example, the following query retrieves the first 100 triples from `path/to/my/file.ttl`:
```bash
$ comunica-sparql-file path/to/my/file.ttl \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100"
```

## 3. SPARQL querying over one remote file

Next to local file, also _remote_ files identified by a URL can be queried:
```bash
$ comunica-sparql-file https://www.rubensworks.net/ \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100"
```

## 4. Learn more

This guide only discussed the basic functionality of `comunica-sparql-file`.
You can learn more options by invoking the _help_ command, or by [reading the Comunica SPARQL documentation](/docs/query/getting_started/query_cli/):
```text
$ comunica-sparql-file --help
```
