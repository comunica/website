---
title: 'Explain'
description: 'Display information about the logical and physical query plan'
---

The explain functionality allows you to extract information about the query plan of a Comunica query engine.

There are three explain modes available:

- `parsed`: The [SPARQL Algebra](/docs/modify/advanced/algebra/) tree as parsed from the input query.
- `logical`: The optimized logical query plan in SPARQL Algebra.
- `query`: The optimized logical query plan as a SPARQL query, including SERVICE clauses after source assignment.
- `physical`: A hierarchical log of which logical operations have been executed by which (physical) actors.
- `physical-json`: A JSON-based representation of the physical plan.

While the `parsed`, `logical`, and `query` explain modes happen before query execution,
the `physical` and `physical-json` explain modes requires query execution to be completed.
This is because Comunica is an adaptive query engine that alters its query plan dynamically based on the sources it discovers at runtime.
This means that query execution must be completed before the final (physical) query plan can be inspected.

<div class="note">
If you require more insight into what operations are being executed at runtime,
you can make use of the built-in <a href="/docs/query/advanced/logging/">logging</a> functionality.
</div>

<div class="note">
The output for the physical and physical-json modes are experimental features,
which means that the format of it might improve and be changed in the future in-between major updates.
</div>

## Explaining on the command line

If you have [installed Comunica SPARQL for the command line](/docs/query/getting_started/query_cli/),
then you will have immediate access to the query explain functionality via the `--explain` option.

Below, you can see examples on how the different explain modes can be invoked.

### Explain parsed on the command line

```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
  -q 'SELECT * { ?s ?p ?o } LIMIT 100' --explain parsed

{
  "type": "slice",
  "input": {
    "type": "project",
    "input": {
      "type": "bgp",
      "patterns": [
        {
          "termType": "Quad",
          "value": "",
          "subject": {
            "termType": "Variable",
            "value": "s"
          },
          "predicate": {
            "termType": "Variable",
            "value": "p"
          },
          "object": {
            "termType": "Variable",
            "value": "o"
          },
          "graph": {
            "termType": "DefaultGraph",
            "value": ""
          },
          "type": "pattern"
        }
      ]
    },
    "variables": [
      {
        "termType": "Variable",
        "value": "s"
      },
      {
        "termType": "Variable",
        "value": "p"
      },
      {
        "termType": "Variable",
        "value": "o"
      }
    ]
  },
  "start": 0,
  "length": 100
}
```

### Explain logical on the command line

```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
  -q 'SELECT * { ?s ?p ?o } LIMIT 100' --explain logical

{
  "type": "slice",
  "input": {
    "type": "project",
    "input": {
      "type": "join",
      "input": [
        {
          "termType": "Quad",
          "value": "",
          "subject": {
            "termType": "Variable",
            "value": "s"
          },
          "predicate": {
            "termType": "Variable",
            "value": "p"
          },
          "object": {
            "termType": "Variable",
            "value": "o"
          },
          "graph": {
            "termType": "DefaultGraph",
            "value": ""
          },
          "type": "pattern"
        }
      ]
    },
    "variables": [
      {
        "termType": "Variable",
        "value": "s"
      },
      {
        "termType": "Variable",
        "value": "p"
      },
      {
        "termType": "Variable",
        "value": "o"
      }
    ]
  },
  "start": 0,
  "length": 100
}
```

### Explain query on the command line

```bash
$ comunica-sparql https://dbpedia.org/sparql https://data.linkeddatafragments.org/viaf https://data.linkeddatafragments.org/harvard \
  -q 'SELECT ?person ?name ?book ?title {
  ?person dbpedia-owl:birthPlace [ rdfs:label "San Francisco"@en ].
  ?viafID schema:sameAs ?person;
          schema:name ?name.
  ?book dc:contributor [ foaf:name ?name ];
        dc:title ?title.
}
' --explain query

SELECT ?person ?name ?book ?title WHERE {
  {
    SERVICE <https://dbpedia.org/sparql> {
      ?viafID <http://schema.org/sameAs> ?person .
    }
  }
  UNION {
    SERVICE <https://data.linkeddatafragments.org/viaf> {
      ?viafID <http://schema.org/sameAs> ?person .
    }
  }
  {
    SERVICE <https://dbpedia.org/sparql> {
      ?g_1 <http://xmlns.com/foaf/0.1/name> ?name .
    }
  }
  UNION {
    SERVICE <https://data.linkeddatafragments.org/harvard> {
      ?g_1 <http://xmlns.com/foaf/0.1/name> ?name .
    }
  }
  {
    SERVICE <https://dbpedia.org/sparql> {
      ?book <http://purl.org/dc/terms/title> ?title .
    }
  }
  UNION {
    SERVICE <https://data.linkeddatafragments.org/harvard> {
      ?book <http://purl.org/dc/terms/title> ?title .
    }
  }
  SERVICE <https://dbpedia.org/sparql> {
    ?g_0 <http://www.w3.org/2000/01/rdf-schema#label> "San Francisco"@en .
    ?person <http://dbpedia.org/ontology/birthPlace> ?g_0 .
  }
  SERVICE <https://data.linkeddatafragments.org/viaf> {
    ?viafID <http://schema.org/name> ?name .
  }
  SERVICE <https://data.linkeddatafragments.org/harvard> {
    ?book <http://purl.org/dc/terms/contributor> ?g_1 .
  }
}
```

### Explain physical on the command line

```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
  -q 'SELECT ?movie ?title ?name
WHERE {
  ?movie dbpedia-owl:starring [ rdfs:label "Brad Pitt"@en ];
         rdfs:label ?title;
         dbpedia-owl:director [ rdfs:label ?name ].
  FILTER LANGMATCHES(LANG(?title), "EN")
  FILTER LANGMATCHES(LANG(?name),  "EN")
}' --explain physical

project (movie,title,name)
  join
    join-inner(bind) bindOperation:(?g_0 http://www.w3.org/2000/01/rdf-schema#label "Brad Pitt"@en) bindCardEst:~2 cardReal:43 timeSelf:2.567ms timeLife:667.726ms
      join compacted-occurrences:1
        join-inner(bind) bindOperation:(?movie http://dbpedia.org/ontology/starring http://dbpedia.org/resource/Brad_Pitt) bindCardEst:~40 cardReal:43 timeSelf:6.011ms timeLife:641.139ms
          join compacted-occurrences:38
            join-inner(bind) bindOperation:(http://dbpedia.org/resource/12_Monkeys http://dbpedia.org/ontology/director ?g_1) bindCardEst:~1 cardReal:1 timeSelf:0.647ms timeLife:34.827ms
              filter compacted-occurrences:1
                join
                  join-inner(nested-loop) cardReal:1 timeSelf:0.432ms timeLife:4.024ms
                    pattern (http://dbpedia.org/resource/12_Monkeys http://www.w3.org/2000/01/rdf-schema#label ?title) cardEst:~1 src:0
                    pattern (http://dbpedia.org/resource/Terry_Gilliam http://www.w3.org/2000/01/rdf-schema#label ?name) cardEst:~1 src:0
          join compacted-occurrences:2
            join-inner(multi-empty) timeSelf:0.004ms timeLife:0.053ms
              pattern (http://dbpedia.org/resource/Contact_(1992_film) http://dbpedia.org/ontology/director ?g_1) cardEst:~0 src:0
              filter cardEst:~5,188,789.667
                join
                  join-inner(nested-loop) timeLife:0.6ms
                    pattern (http://dbpedia.org/resource/Contact_(1992_film) http://www.w3.org/2000/01/rdf-schema#label ?title) cardEst:~1 src:0
                    pattern (?g_1 http://www.w3.org/2000/01/rdf-schema#label ?name) cardEst:~20,013,903 src:0
      join compacted-occurrences:1
        join-inner(multi-empty) timeSelf:0.053ms timeLife:0.323ms
          pattern (?movie http://dbpedia.org/ontology/director ?g_1) cardEst:~118,505 src:0
          pattern (?movie http://dbpedia.org/ontology/starring http://wikidata.dbpedia.org/resource/Q35332) cardEst:~0 src:0
          filter cardEst:~242,311,843,844,161
            join
              join-inner(symmetric-hash) timeLife:36.548ms
                pattern (?movie http://www.w3.org/2000/01/rdf-schema#label ?title) cardEst:~20,013,903 src:0
                pattern (?g_1 http://www.w3.org/2000/01/rdf-schema#label ?name) cardEst:~20,013,903 src:0

sources:
  0: QuerySourceHypermedia(https://fragments.dbpedia.org/2016-04/en)(SkolemID:0)
```

```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
  -q 'SELECT * { ?s ?p ?o. ?s a ?o } LIMIT 100' --explain physical-json

{
  "logical": "slice",
  "children": [
    {
      "logical": "project",
      "variables": [
        "o",
        "p",
        "s"
      ],
      "children": [
        {
          "logical": "join",
          "children": [
            {
              "logical": "join-inner",
              "physical": "bind",
              "bindIndex": 1,
              "bindOperation": {
                "source": "QuerySourceHypermedia(https://fragments.dbpedia.org/2016-04/en)(SkolemID:0)",
                "pattern": "?s http://www.w3.org/1999/02/22-rdf-syntax-ns#type ?o"
              },
              "bindOperationCardinality": {
                "type": "estimate",
                "value": 100022186,
                "dataset": "https://fragments.dbpedia.org/2016-04/en?predicate=http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type"
              },
              "bindOrder": "depth-first",
              "cardinalities": [
                {
                  "type": "estimate",
                  "value": 1040358853,
                  "dataset": "https://fragments.dbpedia.org/2016-04/en"
                },
                {
                  "type": "estimate",
                  "value": 100022186,
                  "dataset": "https://fragments.dbpedia.org/2016-04/en?predicate=http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type"
                }
              ],
              "joinCoefficients": {
                "iterations": 6404592831613.728,
                "persistedItems": 0,
                "blockingItems": 0,
                "requestTime": 8902477556686.99
              },
              "childrenCompact": [
                {
                  "occurrences": 100,
                  "firstOccurrence": {
                    "logical": "pattern",
                    "source": "QuerySourceHypermedia(https://fragments.dbpedia.org/2016-04/en)(SkolemID:0)",
                    "pattern": "http://commons.wikimedia.org/wiki/Special:FilePath/!!!善福寺.JPG ?p http://dbpedia.org/ontology/Image"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Explaining in JavaScript

If you have [installed Comunica SPARQL in a JavaScript app](/docs/query/getting_started/query_app/),
then you can invoke the `explain` method on your query engine with a certain explain mode.

Below, you can see examples on how the different explain modes can be invoked.

### Explain parsed in JavaScript

```typescript
console.log(await engine.explain(`SELECT * WHERE {
      ?s ?p ?o.
    }`, {
  sources: [ 'https://www.rubensworks.net/' ],
}, 'parsed'));

/*
Will print:

{
  explain: true,
  type: 'parsed',
  data: {
    input: {
      patterns: [
        factory.createPattern(
          DF.variable('s'),
          DF.variable('p'),
          DF.variable('o'),
        ),
      ],
      type: 'bgp',
    },
    type: 'project',
    variables: [
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
    ],
  },
}

with DF being an RDF data factory, and factory being a SPARQL algebra factory.
 */
```

### Explain logical in JavaScript

```typescript
console.log(await engine.explain(`SELECT * WHERE {
      ?s ?p ?o.
    }`, {
  sources: [ 'https://www.rubensworks.net/' ],
}, 'logical'));

/*
Will print:

{
  explain: true,
  type: 'logical',
  data: {
    input: {
      input: [
        factory.createPattern(
          DF.variable('s'),
          DF.variable('p'),
          DF.variable('o'),
        ),
      ],
      type: 'join',
    },
    type: 'project',
    variables: [
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
    ],
  },
}

with DF being an RDF data factory, and factory being a SPARQL algebra factory.
 */
```

### Explain physical in JavaScript

```typescript
console.log(await engine.explain(`SELECT * WHERE {
      ?s ?p ?o.
    }`, {
  sources: [ 'https://www.rubensworks.net/' ],
}, 'physical'));

/*
Will print:

{
  explain: true,
  type: 'physical',
  data: `slice
  project (o,p,s)
    join
      join-inner(bind) bindOperation:(?s http://www.w3.org/1999/02/22-rdf-syntax-ns#type ?o) bindCardEst:~100,022,186
        pattern (http://commons.wikimedia.org/wiki/Special:FilePath/!!!善福寺.JPG ?p http://dbpedia.org/ontology/Image) src:0 compacted-occurrences:100

sources:
  0: QuerySourceHypermedia(https://fragments.dbpedia.org/2016-04/en)(SkolemID:0)
`,
}
 */
```
