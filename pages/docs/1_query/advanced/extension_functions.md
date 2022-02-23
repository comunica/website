---
title: 'Extension Functions'
description: 'Providing implementations for SPARQL extension functions.'
---

SPARQL allows non-standard, [custom extension functions](https://www.w3.org/TR/sparql11-query/#extensionFunctions) to be used within queries.
In order to provide an implementation to these extension functions,
Comunica allows developers to plug them in via the context.

<div class="note">
Take into account that when writing SPARQL queries with extension functions,
that these queries will not be portable to other types of query engines anymore,
as these extension functions may not be standardized.
</div>

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
