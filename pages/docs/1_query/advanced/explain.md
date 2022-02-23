---
title: 'Explain'
description: 'Display information about the logical and physical query plan'
---

The explain functionality allows you to extract information about the query plan of a Comunica query engine.

There are three explain modes available:

- `parsed`: The [SPARQL Algebra](/docs/modify/advanced/algebra/) tree as parsed from the input query.
- `logical`: The optimized logical query plan in SPARQL Algebra.
- `physical`: A hierarchical log of which logical operations have been executed by which (physical) actors.

While the `parsed` and `logical` explain modes happen before query execution,
the `physical` explain mode requires query execution to be completed.
This is because Comunica is an adaptive query engine that alters its query plan dynamically based on the sources it discovers at runtime.
This means that query execution must be completed before the final (physical) query plan can be inspected.

<div class="note">
If you require more insight into what operations are being executed at runtime,
you can make use of the built-in <a href="/docs/query/advanced/logging/">logging</a> functionality.
</div>

<div class="note">
The output for the physical mode is an experimental feature,
which means that the format of it might improve and be changed in the future inbetween major updates.
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

### Explain physical on the command line

```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
  -q 'SELECT * { ?s ?p ?o. ?s a ?o } LIMIT 100' --explain physical

{
  "logical": "slice",
  "children": [
    {
      "logical": "project",
      "variables": [
        "s",
        "p",
        "o"
      ],
      "children": [
        {
          "logical": "join",
          "children": [
            {
              "logical": "pattern",
              "pattern": "?s ?p ?o"
            },
            {
              "logical": "pattern",
              "pattern": "?s http://www.w3.org/1999/02/22-rdf-syntax-ns#type ?o"
            },
            {
              "logical": "join-inner",
              "physical": "bind",
              "bindIndex": 1,
              "bindOrder": "depth-first",
              "cardinalities": [
                {
                  "type": "estimate",
                  "value": 1040358853
                },
                {
                  "type": "estimate",
                  "value": 100022186
                }
              ],
              "joinCoefficients": {
                "iterations": 6404592831613.728,
                "persistedItems": 0,
                "blockingItems": 0,
                "requestTime": 556926378.1422498
              },
              "children": [
                {
                  "logical": "pattern",
                  "pattern": "http://commons.wikimedia.org/wiki/Special:FilePath/!!!善福寺.JPG ?p http://dbpedia.org/ontology/Image"
                },
                {
                  "logical": "pattern",
                  "pattern": "http://commons.wikimedia.org/wiki/Special:FilePath/!!!善福寺.JPG ?p http://wikidata.dbpedia.org/ontology/Image"
                },
                ...
                {
                  "logical": "pattern",
                  "pattern": "http://commons.wikimedia.org/wiki/Special:FilePath/%22..._WAAC_cooks_prepare_dinner_for_the_first_time_in_new_kitchen_at_Fort_Huachuca,_Arizona.%22,_12-05-1942_-_NARA_-_531152.jpg ?p http://wikidata.dbpedia.org/ontology/Image"
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
  data: {
    logical: 'project',
    variables: [ 's', 'p', 'o' ],
    children: [
      {
        logical: 'join',
        children: [
          {
            logical: 'pattern',
            pattern: '?s ?p ?o',
          },
        ],
      },
    ],
  },
}
 */
```
