---
title: 'Expression Evaluator'
description: 'The expression evaluation engine of Comunica.'
---

The expression evaluator package of Comunica is used by different Comunica actors for evaluating expressions.

Concretely, the following actors make use of this:
* [`@comunica/actor-query-operation-extend`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend): Implements the extent operator.
* [`@comunica/actor-query-operation-filter-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-filter-sparqlee): Implements the filter operator.
* [`@comunica/actor-query-operation-group`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-group): Implements the group operator.
* [`@comunica/actor-query-operation-leftjoin`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-leftjoin): Implements the left join operator.
* [`@comunica/actor-query-operation-orderby-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend): Implements the order by operator.

## Using The Expression Evaluator

```ts
import { translate } from "sparqlalgebrajs";
import { stringToTerm } from "rdf-string";

// An example SPARQL query with an expression in a FILTER statement.
// We translate it to SPARQL Algebra format ...
const query = translate(`
  SELECT * WHERE {
     ?s ?p ?o
     FILTER langMatches(lang(?o), "FR")
    }
`);

// ... and get the part corresponding to "langMatches(...)".
const expression = query.input.expression;

// We create an evaluator for this expression.
// A sync version exists as well.
const evaluator = new AsyncEvaluator(expression);

// We can now evaluate some bindings as a term, ...
const result: RDF.Term = await evaluator.evaluate(
  Bindings({
    ...
    '?o': stringToTerm("Ceci n'est pas une pipe"@fr),
    ...
  })
);

// ... or as an Effective Boolean Value (e.g. for use in FILTER)
const result: boolean = await evaluator.evaluateAsEBV(bindings);
```

## Config

The expression evaluator accepts an optional config argument, that is not required for simple use cases,
but for feature completeness and spec compliance it should receive `now, baseIRI, exists, aggregate and bnode`.

For the extended date functionality (see later), an additional context item has been added: `implicitTimezone`.
The choice was made to default to the timezone `now` has.
It can be desired to set it explicitly so `implicitTimezone` does not change over time (i.e., it is not dependent on daylight saving time).

```ts
interface AsyncEvaluatorContext {
  now?: Date;
  baseIRI?: string;

  exists?: (expression: Alg.ExistenceExpression, mapping: Bindings) => Promise<boolean>;
  aggregate?: (expression: Alg.AggregateExpression) => Promise<RDF.Term>;
  bnode?: (input?: string) => Promise<RDF.BlankNode>;
  extensionFunctionCreator?: (functionNamedNode: RDF.NamedNode) => (args: RDF.Term[]) => Promise<RDF.Term> | undefined;
  overloadCache?: LRUCache<string, SomeInternalType>;
  typeCache?: LRUCache<string, SomeInternalType>;
  getSuperType?: (unknownType: string) => string;
  implicitTimezone?: { zoneHours: number; zoneMinutes: number;}; 
}
```

## Errors

This package exports an Error class called `ExpressionError` from which all SPARQL related errors inherit.
These might include unbound variables, wrong types, invalid lexical forms, and much more.
These errors can be caught, and may impact program execution in an expected way.
All other errors are unexpected, and are thus programmer mistakes or mistakes in this package.

There is also the utility function `isExpressionError` for detecting these cases.

```ts
// Make sure to catch errors if you don't control binding input
try {
  const result = await evaluator.evaluate(bindings);
  consumeResult(result);
} catch (error) {
  if (isExpressionError(error)) {
    console.log(error); // SPARQL related errors
    ...                 // Move on, ignore result, ...
  } else {
    throw error;        // Programming errors or missing features.
  }
}
```

## Exists

'Exists' operations are an annoying problem to tackle in the context of an expression evaluator,
since they make the operation stateful and context dependant.
They might span entire streams and, depending on the use case, have very different requirements for speed and memory consumption.
This package has therefore decided to delegate this responsibility back to you.

You can, if you want, pass hooks to the evaluators of the shape:

```ts
exists?: (expression: Alg.ExistenceExpression, mapping: Bindings) => Promise<boolean>;
```

If this package encounters any or existence expression, it will call this hook with the relevant information, so you can resolve it yourself.
If these hooks are not present, but an existence expression is encountered, then an error is thrown.

An example consumer/hook can be found in [Comunica](https://github.com/comunica/comunica/blob/master/packages/actor-query-operation-filter-sparqlee/lib/ActorQueryOperationFilterSparqlee.ts).;

## Aggregates

An `AggregateEvaluator` to which you can pass the individual bindings in the stream, and ask the aggregated result back, is provided.
It uses the internal type system for operations such as `sum` and `avg`.

```ts
const stream = [bindings1, bindings2, bindings3];

if (stream.length === 0) {
  return AggregateEvaluator.emptyValue(aggregateExpression);
} else {
  const evaluator = new AggregateEvaluator(aggregateExpression, bindings[0]);
  stream.slice(1).forEach((bindings) => evaluator.put(bindings));
  return evaluator.result();
}
```

We have not found any SPARQL Algebra for which this occurs,
but we happen to find any aggregate expressions nested in the expression (or even at the top level),
we will call (similarly to EXISTS) an aggregate hook you might have provided.

```ts
aggregate?: (expression: Alg.AggregateExpression) => Promise<RDF.Term>;
```

You can probably ignore this.

We also provide an `AsyncAggregateEvaluator` to that works the same way `AggregateEvaluator` does.
The signature of only the `put` method changes to be async. It is up to you to handle this correctly.
You are for example expected to await all puts before you ask for `result`.
You should also note the order of calling and awaiting put while using the `GroupConcat` aggregator.

## Extension functions

This section explains how to pass extension functions to the evaluator.
You don't need to do this directly. If you want to provide extension function to a
Comunica engine follow the [extension function docs](https://comunica.dev/docs/query/advanced/extension_functions/).

Extension functions can be added by providing the `extensionFunctionCreator` in the config.
Example
```ts
config.extensionFunctionCreator = (functionName: RDF.NamedNode) => {
   if (functionNamedNode.value === 'https://example.org/functions#equal') {
      return async (args: RDF.Term[]) => {
         return literal(String(args[0].equals(args[1])), 'http://www.w3.org/2001/XMLSchema#boolean');       
      }
   }
}
```

## Overload function caching

An functionArgumentsCache allows the partial evaluator to cache the implementation of a function provided the argument types.
When not providing a cache in the context, the evaluator will create one.

This cache can be reused across multiple evaluators. Manual modification is not recommended.

## Context dependant functions

Some functions (BNODE, NOW, IRI) need a (stateful) context from the caller to function correctly according to the spec.
This context can be passed as an argument to the evaluator (see the [config section](#config) for exact types).
If they are not passed, the evaluator will use a naive implementation that might do the trick for simple use cases.

### BNODE

[spec](https://www.w3.org/TR/sparql11-query/#func-bnode)

Blank nodes are very dependent on the rest of the SPARQL query, therefore,
we provide the option of delegating the entire responsibility back to you by accepting a blank node constructor callback.
If this is not found, we create a blank node with the given label,
or we use uuid (v4) for argument-less calls to generate definitely unique blank nodes of the shape `blank_uuid`.

`bnode(input?: string) => RDF.BlankNode`

### Now

[spec](https://www.w3.org/TR/sparql11-query/#func-now)

All calls to now in a query must return the same value, since we aren't aware of the rest of the query,
you can provide a timestamp (`now: Date`). If it's not present, the evaluator will use the timestamp of evaluator creation,
this at least allows evaluation with multiple bindings to have the same `now` value.

### IRI

[spec](https://www.w3.org/TR/sparql11-query/#func-iri)

To be fully spec compliant, the IRI/URI functions should take into account base IRI of the query,
which you can provide as `baseIRI: string` to the config.

## SPARQL 1.2

The partial evaluator package looks already implements some SPARQL 1.2 specification functions.

Currently, this is restricted to the [extended date](https://github.com/w3c/sparql-12/blob/main/SEP/SEP-0002/sep-0002.md) functionality.
Please note that the new sparql built-in `ADJUST` function has not been implemented due to package dependencies.

## Type System

The type system of the partial evaluator is tailored for doing (supposedly) quick evaluation of overloaded functions.

A function definition object consists of a tree-like structure with a type (e.g. `xsd:float`) at each internal node.
Each level of the tree represents an argument of the function
(e.g. function with arity two also has a tree of depth two).
The leaves contain a function implementation matching the concrete types defined by the path of the tree.

When a function is called with some arguments, a depth first search,
to find an implementation among all overloads matching the types of the arguments,
is performed in the tree.

**[Subtype substitution](https://www.w3.org/TR/xpath-31/#dt-subtype-substitution)** is handled for literal terms.
What this means is that for every argument of the function, and it's associated accepted type,
When a function accepts a type, it also accepts all subtypes for that argument.
These sub/super-type relations define the following type tree:

<div class="docs-intro-img">
  <img src="/img/expression-evaluator-type-scheme.svg" alt="Type scheme known by expression evaluator" style="width:100%" \>
</div>

So, when expecting an argument of type `xsd:integer` we could provide `xsd:long` instead and the
function call would still succeed. The type of the term does not change in this operation.

The expression evaluator also handles **[type promotion](https://www.w3.org/TR/xpath-31/#promotion)**.
Type promotion defines some rules where a types can be promoted to another, even if there is no super-type relation.
Examples include `xsd:float`  and `xsd:decimal` to `xsd:double`and `xsd:anyURI` to `xsd:string`.
In this case, the datatype of the term will change to the type it is promoted to.

