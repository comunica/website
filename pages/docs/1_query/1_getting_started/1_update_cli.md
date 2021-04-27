---
title: 'Updating from the command line'
description: 'Execute SPARQL Update queries directly from the command line.'
---

Comunica SPARQL (`@comunica/actor-init-sparql`) allow you to initiate queries to _update_ data in a certain store.
In this guide, we will build upon [the guide on querying from the command line](/docs/query/getting_started/query_cli/),
and show how you can not only read, but also update data.

<div class="note">
At the time of writing, not all possible <a href="/docs/query/advanced/destination_types/">destination types</a> may be supported yet.
</div>

## 1. Updating one source

Using the `comunica-sparql` command line tool,
you can invoke not only read queries, but also update queries.

Assuming you pass just one source,
this source will also be assumed to be the destination for update queries.

For example, the following query appends a single triple to `https://example.org/myfile.ttl`:
```bash
$ comunica-sparql https://example.org/myfile.ttl \
    "INSERT DATA { <ex:s> <ex:p> <ex:o> }"
```

<div class="note">
Given a URL, Comunica will automatically detect the <a href="/docs/query/advanced/destination_types/">type of destinations</a> and handle it accordingly.
</div>

As output, `ok` will be printed if the update was successful:
```
ok
``` 

## 2. Updating a different destination

While Comunica supports querying over **multiple sources**,
it only supports updating **a single destination**.

Therefore, if you are querying over multiple sources,
but you want to pass the results to a single destination,
then you must explicitly define this destination using the `--to` option.

For example, the following query takes the first 100 triples from 3 sources,
and inserts them into `https://example.org/myfile.ttl`:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    https://www.rubensworks.net/ \
    https://ruben.verborgh.org/profile/ \
    --to https://example.org/myfile.ttl \
    "INSERT { ?s ?p ?o. } WHERE { SELECT * WHERE { ?s ?p ?o } LIMIT 100 }"
```

<div class="note">
The type of destination is here also <a href="/docs/query/advanced/destination_types/">automatically detected</a>,
and can also be overridden.
</div>
