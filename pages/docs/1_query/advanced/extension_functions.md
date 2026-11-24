---
title: 'Extension Functions'
description: 'Providing implementations for SPARQL extension functions and aggregates.'
---

SPARQL allows non-standard, [custom extension functions](https://www.w3.org/TR/sparql11-query/#extensionFunctions) to be used within queries.
In order to provide an implementation to these extension functions,
Comunica allows developers to plug them in via the context.

<div class="note">
Take into account that when writing SPARQL queries with extension functions,
that these queries will not be portable to other types of query engines anymore,
as these extension functions may not be standardized.
</div>

When querying over SPARQL endpoints, extension functions will be pushed down into the endpoint
if the endpoint explicitly mentions these extension functions within the [SPARQL Service Description](https://www.w3.org/TR/sparql11-service-description/),
and will otherwise be executed locally.
This means that this pushing down functionality will not work for endpoints without Service Description.

## Dictionary-based extension functions

The easiest way to plug in extension functions to Comunica is by using
the `extensionFunctions` [context entry](/docs/query/advanced/context/)
in a [JavaScript application](/docs/query/getting_started/query_app/):

```typescript
import {DataFactory} from "rdf-data-factory";

const DF = new DataFactory();

const bindingsStream = await myEngine.queryBindings(`
PREFIX func: <http://example.org/functions#>
SELECT ?caps WHERE {
  ?s ?p ?o.
  BIND (func:to-upper-case(?o) AS ?caps)
}
`, {
  sources: ['https://www.rubensworks.net/'],
  extensionFunctions: {
    'http://example.org/functions#to-upper-case'(args: RDF.Term[]) {
      const arg = args[0];
      if (arg.termType === 'Literal' && arg.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
        return DF.literal(arg.value.toUpperCase(), arg.datatype);
      }
      return arg;
    },
  },
});
```

Within this `extensionFunctions` dictionary, you can provide any number of extension functions.
These functions may even be `async`.

## Callback-based extension functions

If function names are not known beforehand,
or the dictionary-based format is not usable for whatever reason,
then the callback-based `extensionFunctionCreator` entry may be used:

```typescript
import {DataFactory} from "rdf-data-factory";

const DF = new DataFactory();

const bindingsStream = await myEngine.queryBindings(`
PREFIX func: <http://example.org/functions#>
SELECT ?caps WHERE {
  ?s ?p ?o.
  BIND (func:to-upper-case(?o) AS ?caps)
}
`, {
  sources: ['https://www.rubensworks.net/'],
  extensionFunctionCreator: (funcTerm: RDF.NamedNode) => {
    if (funcTerm.value === 'http://example.org/functions#to-upper-case') {
      return (args: RDF.Term[]) => {
        const arg = args[0];
        if (arg.termType === 'Literal' && arg.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
          return DF.literal(arg.value.toUpperCase(), arg.datatype);
        }
        return arg;
      };
    }
  },
});
```

The `extensionFunctionCreator` is invoked upon any occurrence of an extension function,
and is called with the extension function name, wrapped within an [RDF/JS named node](/docs/query/advanced/rdfjs/).
The return type of this function is expected to be a function with the same signature
as the values of the  `extensionFunction` dictionary, or `undefined`.

## Extension aggregates

SPARQL also allows custom aggregates, which are called like extension functions but aggregate over the solutions of a group,
such as `func:longest(?o)` in the query below.
Implementations for such extension aggregates can be plugged in via the `extensionAggregators` context entry:

```typescript
const longest = () => {
  let longestTerm: RDF.Term | undefined;
  return {
    put([ arg ]: RDF.Term[]) {
      if (!longestTerm || arg.value.length > longestTerm.value.length) {
        longestTerm = arg;
      }
    },
    result() {
      return longestTerm;
    },
  };
};

const bindingsStream = await myEngine.queryBindings(`
PREFIX func: <http://example.org/functions#>
SELECT ?s (func:longest(?o) AS ?longest) WHERE {
  ?s ?p ?o.
}
GROUP BY ?s
`, {
  sources: ['https://www.rubensworks.net/'],
  extensionAggregators: {
    'http://example.org/functions#longest': longest,
  },
});
```

Each function in `extensionAggregators` (such as `longest`) is called synchronously once per group, for each of its calls in the query.
It returns an object with two methods, which may be `async`:
* `put` is called with the evaluated arguments of the call for each solution in the group.
  Solutions in which an argument uses an unbound variable are skipped,
  and with `DISTINCT` inside the call (e.g. `func:longest(DISTINCT ?o)`), each distinct list of arguments is only put once.
* `result` returns the aggregated RDF term, or `undefined` to leave the result unbound.

If evaluating an argument fails, or `put` or `result` throws an error, the result is left unbound for that group and a warning is logged.

Instead of `extensionAggregators`, the callback-based `extensionAggregatorCreator` entry may be used, but not both at the same time.
Unlike `extensionFunctionCreator`, which may return a promise, this callback must be synchronous,
as Comunica needs to know which function calls are aggregates while parsing the query.
For the same query as above:

```typescript
const bindingsStream = await myEngine.queryBindings(query, {
  sources: ['https://www.rubensworks.net/'],
  extensionAggregatorCreator: (aggregateTerm: RDF.NamedNode) => {
    if (aggregateTerm.value === 'http://example.org/functions#longest') {
      return longest;
    }
  },
});
```

As for extension functions, extension aggregates are only pushed down into a SPARQL endpoint
if its Service Description lists them via `sd:extensionAggregate` or `sd:extensionFunction`
(where `sd:` is `http://www.w3.org/ns/sparql-service-description#`),
and are otherwise evaluated locally.
