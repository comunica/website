---
title: 'Federated Querying'
description: 'Query over the union of data within any number of sources'
---

One of the key features of Comunica,
is the ability to query over **multiple sources** of different types.
This concept of querying over multiple sources is called _federated querying_.

This functionality can be exploited on both
the [CLI](/docs/query/getting_started/query_cli/) and the [JavaScript API](/docs/query/getting_started/query_app/).
In this guide, we will make use of the CLI as an example.

<div class="note">
Federated query execution does not just send the query to each source separately.
Instead, the triples from all sources are considered one large virtual dataset, which can then be queried over.
</div> 

## Distributed Knowledge

A fundamental concept of Linked Data and the Semantic Web
is that data can be spread over different sources across the Web.
This means that querying over this data potentially involves more than one source.

While some knowledge graphs such as
[DBpedia](https://wiki.dbpedia.org/) and [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page)
aim to accumulate as much data as possible in one place,
these always have limitations in scope.
As such, federated querying may be needed for some queries.

## Federated Querying in Comunica

Comunica's ability to execute federated queries is enabled by default.
This can be invoked by simply passing more than one source to the engine.

For example, the following query will retrieve all triples from DBpedia and two RDF documents:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    https://www.rubensworks.net/ \
    https://ruben.verborgh.org/profile/ \
    "SELECT * WHERE { ?s ?p ?o }"
```

The example above shows that sources do not necessarily have to be of [the same type](/docs/query/advanced/source_types/).

## Real-world federation example

One example of a real-world federated query,
is task of linking people in DBpedia to library datasets.
For this, the [Virtual International Authority File](http://viaf.org/) can be used as a source to provide this linking.

The query below will retrieve all books in the Harvard Library written by people born in San Francisco:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    http://data.linkeddatafragments.org/viaf \
    http://data.linkeddatafragments.org/harvard \
    'SELECT ?person ?name ?book ?title {
       ?person dbpedia-owl:birthPlace [ rdfs:label "San Francisco"@en ].
       ?viafID schema:sameAs ?person;
                    schema:name ?name.
       ?book dc:contributor [ foaf:name ?name ];
                   dc:title ?title.
     }'
```
