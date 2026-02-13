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

## Traqula

Converting a query string to SPARQL algebra
happens in the [SPARQL Parse bus](/docs/modify/advanced/buses/#query-parse).
The [`@comunica/actor-query-parse-sparql`](https://github.com/comunica/comunica/tree/master/packages/actor-query-parse-sparql) actor
on this bus makes use of the [Traqula framework](https://github.com/comunica/traqula).

Examples on how the conversion between SPARQL query string and SPARQL algebra happens can be found in [the specific SPARQL algebra 1.2 package](https://www.npmjs.com/package/@traqula/algebra-sparql-1-2).
Example transformations can be found as part of [Traqula's test suite](https://github.com/comunica/traqula/tree/main/packages/test-utils/statics/algebra). 

## Converting a SPARQL query into algebra

If you want to quickly check what the algebra of a given SPARQL query string looks like,
you can make use of Comunica's [explain functionality](/docs/query/advanced/explain/) as follows:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en -q 'SELECT * { ?s ?p ?o }' --explain parsed

{
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
}
```

This tool is therefore useful if you want to implement support for a SPARQL operator,
but you need to find out to what algebra operation this corresponds.

> [!note]
> Before implementing support for a SPARQL operator, read our tutorial on [contributing an actor](../1_getting_started/5_contribute_actor.md) and [contributing a new operator](../1_getting_started/7_contribute_new_operation.md).
