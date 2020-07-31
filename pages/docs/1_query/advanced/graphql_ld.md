---
title: 'GraphQL-LD'
description: 'Using the power of JSON-LD contexts, GraphQL queries can be executed by Comunica'
---

Instead of SPARQL queries, you can also provide [**GraphQL-LD**](https://github.com/rubensworks/graphql-ld.js) queries,
which are [GraphQL](https://graphql.org/) queries
enhanced with a [JSON-LD](https://json-ld.org/) context.
GraphQL-LD is a developer-friendly alternative to SPARQL that allows querying Linked Data and using the results in a straightforward way.

## What is GraphQL-LD?

Assuming the following SPARQL query:

```sparql
SELECT ?id ?starring WHERE {
  OPTIONAL {
    ?id <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/Film>;
      <http://dbpedia.org/ontology/starring> ?starring.
    ?starring <http://www.w3.org/2000/01/rdf-schema#label> "Brad Pitt"@en.
  }
}
```

This could be written in a more compact way in GraphQL:

```graphql
{
  id
  ... on Film {
    starring(label: "Brad Pitt")
  }
}
```

And this can be based on the following JSON-LD context:

```json
{
  "@context": {
    "Film": "http://dbpedia.org/ontology/Film",
    "label": { "@id": "http://www.w3.org/2000/01/rdf-schema#label", "@language": "en" },
    "starring": "http://dbpedia.org/ontology/starring"
  }
}
```

Learn more about the **features** of GraphQL-LD on [GitHub](https://github.com/rubensworks/GraphQL-LD.js),
or read [an article about GraphQL-LD](https://comunica.github.io/Article-ISWC2018-Demo-GraphQlLD/).

## Using GraphQL-LD on the command line

To run GraphQL queries with [Comunica SPARQL from the command line](/docs/query/getting_started/query_cli/),
set the `-i` flag to `graphql` and refer to your config file with the JSON-LD context (`@context`) through the `-c` flag.
To output your results as a GraphQL tree, set the MIME type of the output with `-t` to `tree`.

For example, the first 100 labels in DBpedia can be retrieved as follows:
```bash
$ comunica-sparql http://fragments.dbpedia.org/2015-10/en \
  -q "{ label(first: 100) @single }" \
  -c "{ \"@context\": { \"label\" : \"http://www.w3.org/2000/01/rdf-schema#label\" } }" \
  -i graphql \
  -t tree
```

Since the queries and contexts can be inconvenient to pass on the command line, they can also be supplied as files:
```bash
$ comunica-sparql http://fragments.dbpedia.org/2015-10/en \
  -f query.graphql \
  -c config-with-context.json \
  -i graphql \
  -t tree
```

## Using GraphQL-LD in an application

If you want to execute GraphQL-LD queries in [your application](/docs/query/getting_started/query_app/),
you can do this as follows:
```javascript
const newEngine = require('@comunica/actor-init-sparql').newEngine;
const bindingsStreamToGraphQl = require('@comunica/actor-sparql-serialize-tree').bindingsStreamToGraphQl;

const myEngine = newEngine();
const result = await myEngine.query(`
{
  label @single
  writer(label_en: \"Michael Jackson\") @single
  artist @single {
    label @single
  }
}
`, {
  sources: ['http://fragments.dbpedia.org/2016-04/en'],
  queryFormat: 'graphql',
  "@context": {
    "label": { "@id": "http://www.w3.org/2000/01/rdf-schema#label" },
    "label_en": { "@id": "http://www.w3.org/2000/01/rdf-schema#label", "@language": "en" },
    "writer": { "@id": "http://dbpedia.org/ontology/writer" },
    "artist": { "@id": "http://dbpedia.org/ontology/musicalArtist" }
  }
});
// Converts raw Comunica results to GraphQL objects
const data = bindingsStreamToGraphQl(result.bindingsStream, result.context);
```
