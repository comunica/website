---
title: 'Algebra'
description: 'The internal representation of queries during query execution.'
---

Like most query engines,
instead of internally working directly with a SPARQL query string,
Comunica works with an algebraic representation of a SPARQL query,
corresponding to the [SPARQL 1.1 algebra](https://www.w3.org/TR/sparql11-query/#sparqlQuery).
This SPARQL algebra makes it easier for operating on SPARQL operators in a consistent manner,
and for applying transformations during query optimization.

## Query Operation Actors

All actors on the [Query Operation bus](/docs/modify/advanced/buses/#query-operation)
correspond to exactly one SPARQL algebra operator type.
For example, [`@comunica/actor-query-operation-construct`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-construct)
handles algebra operations with type `'construct'`.

## SPARQLAlgebra.js

Converting a SPARQL query string to SPARQL algebra
happens in the [SPARQL Parse bus](/docs/modify/advanced/buses/#sparql-parse).
The [`@comunica/actor-sparql-parse-algebra`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-parse-algebra) actor
on this bus makes use of the [SPARQLAlgebra.js](https://github.com/joachimvh/SPARQLAlgebra.js) package.

Examples on how the conversion between SPARQL query string and SPARQL algebra happens can be found in the tests: https://github.com/joachimvh/SPARQLAlgebra.js/tree/master/test

## Converting a SPARQL query into algebra

If you want to quickly check what the algebra of a given SPARQL query string looks like,
you can install SPARQLAlgebra.js globally, and convert a query as follows:
```bash
$ npm install -g sparqlalgebrajs
$ sparqlalgebrajs -q "SELECT ?x ?y ?z WHERE { ?x ?y ?z }"

{
  "type": "project",
  "input": {
    "type": "bgp",
    "patterns": [
      {
        "type": "pattern",
        "termType": "Quad",
        "value": "",
        "subject": {
          "termType": "Variable",
          "value": "x"
        },
        "predicate": {
          "termType": "Variable",
          "value": "y"
        },
        "object": {
          "termType": "Variable",
          "value": "z"
        },
        "graph": {
          "termType": "DefaultGraph",
          "value": ""
        }
      }
    ]
  },
  "variables": [
    {
      "termType": "Variable",
      "value": "x"
    },
    {
      "termType": "Variable",
      "value": "y"
    },
    {
      "termType": "Variable",
      "value": "z"
    }
  ]
}
```

This tool is therefore useful if you want to implement support for a SPARQL operator,
but you need to find out to what algebra operation this corresponds.

## Converting algebra into a SPARQL query

Using, you can also apply the reverse transformation from algebra to SPARQL query string:
```bash
$ sparqlalgebrajs -q -r '
{
  "type": "project",
  "input": {
    "type": "bgp",
    "patterns": [
      {
        "type": "pattern",
        "termType": "Quad",
        "value": "",
        "subject": {
          "termType": "Variable",
          "value": "x"
        },
        "predicate": {
          "termType": "Variable",
          "value": "y"
        },
        "object": {
          "termType": "Variable",
          "value": "z"
        },
        "graph": {
          "termType": "DefaultGraph",
          "value": ""
        }
      }
    ]
  },
  "variables": [
    {
      "termType": "Variable",
      "value": "x"
    },
    {
      "termType": "Variable",
      "value": "y"
    },
    {
      "termType": "Variable",
      "value": "z"
    }
  ]
}
'

SELECT ?x ?y ?z WHERE { ?x ?y ?z }
```
