---
title: 'Memento'
description: 'Using the Memento protocol, time travel queries can be executed.'
---

Using the [Memento protocol](https://tools.ietf.org/html/rfc7089),
it is possible to perform **time-based content negotiation** over HTTP.
This allows servers to expose different temporal versions of resources next to each other,
and clients to retrieve these versions at different times.

Comunica has built-in support for the Memento protocol
([`actor-http-memento`](https://github.com/comunica/comunica/tree/master/packages/actor-http-memento)).
To enable Memento, one simply passes a date to the query engine via the [context](/docs/query/advanced/context/),
and Comunica will perform time-based negotiation for that date.

For example, the [DBpedia TPF interface supports the Memento protocol](https://ruben.verborgh.org/blog/2016/06/22/querying-history-with-linked-data/).
In order to query over it at version 2010 from the command line, a custom date can be passed with `-d`:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    -d 'June 1, 2010' \
    'SELECT ?name ?deathDate WHERE {
       ?person a dbpedia-owl:Artist;
               rdfs:label ?name;
               dbpedia-owl:birthPlace [ rdfs:label "York"@en ].
       FILTER LANGMATCHES(LANG(?name),  "EN")
       OPTIONAL { ?person dbpprop:dateOfDeath ?deathDate. }
     }'
```

Dates can also be passed via the JavaScript API, via the [query engine context](/docs/query/advanced/context/).
