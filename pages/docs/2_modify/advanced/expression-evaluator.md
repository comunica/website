---
title: 'Expression Evaluator'
description: 'The expression evaluation engine of Comunica.'
---

To evaluate expressions, Comunica uses a collection of packages that are part of the Comunica monorepo.
Two buses specifically are of importance:
* [`@comunica/bus-expression-evaluator-factory`](https://github.com/comunica/comunica/tree/master/packages/bus-expression-evaluator-factory): Creates an expression evaluator, more info listed below.
* [`@comunica/bus-function-factory`](https://github.com/comunica/comunica/tree/master/packages/bus-function-factory): Creates functions, more specifically objects that are able to evaluate the desired function given the arguments.

Two different kinds of functions are used, `TermFunction` and `ExpressionFunction`, where TermFunction extends ExpressionFunction.
An `ExpressionFunction` takes control over the evaluation of its arguments, meaning that its arguments are Expressions and not Terms.
The evaluation of the function is async.
A `TermFunction` on the other hand does not take control over the evaluation of its arguments, and is synchronous.
In scenarios where you already have the terms and are in a synchronous context, you can use a `TermFunction`.
Besides being easier to use, TermFunctions are also easier to implement, since the `declare` function of [the expression evaluator utils package](https://github.com/comunica/comunica/tree/master/packages/utils-expression-evaluator) can be used.
This `declare` function allows for easy definition of functions that have function overloading.
Functions created using `declare` use the OverloadTree, thereby also allowing for type promotion and subtype substitution.
TLDR: Use `TermFunction` with `declare` when you can, and `ExpressionFunction` when you need to.

Note that while individual TermFunctions are synchronous, evaluating an expression is always asynchronous:
there is no synchronous evaluator.


## Standalone usage

[`@comunica/expressions-sparql`](https://github.com/comunica/comunica/tree/master/engines/expressions-sparql)
is an engine that evaluates expressions without querying, for use outside of a Comunica query engine.
It is the successor of the standalone `sparqlee` package.

```typescript
import { ExpressionEngine } from '@comunica/expressions-sparql';
import { BindingsFactory } from '@comunica/utils-bindings-factory';
import { toAlgebra } from '@traqula/algebra-sparql-1-2';
import { Parser } from '@traqula/parser-sparql-1-2';
import { DataFactory } from 'rdf-data-factory';

const DF = new DataFactory();
const BF = new BindingsFactory(DF);

// An example SPARQL query with an expression in a FILTER statement.
// We translate it to SPARQL Algebra format ...
const query: any = toAlgebra(new Parser().parse(`
  SELECT * WHERE {
     ?s ?p ?o
     FILTER langMatches(lang(?o), "FR")
  }
`));

// ... and create an evaluator for the part corresponding to "langMatches(...)".
const engine = new ExpressionEngine();
const evaluator = await engine.createEvaluator(query.input.expression);

// We can now evaluate some bindings as a term, ...
const term = await evaluator.evaluate(BF.fromRecord({ o: DF.literal("Ceci n'est pas une pipe", 'fr') }));

// ... or as an Effective Boolean Value (e.g. for use in FILTER)
const bool = await evaluator.evaluateAsEBV(BF.fromRecord({ o: DF.literal('This is not a pipe', 'en') }));
```

The same engine creates [aggregators](#aggregates) with `createAggregator`,
and term comparators with `createTermComparator`.
Because it configures no query operations, it cannot evaluate `EXISTS`.


## Usage within an engine

Actors obtain the same evaluator through a `MediatorExpressionEvaluatorFactory` over the
[expression evaluator factory bus](https://github.com/comunica/comunica/tree/master/packages/bus-expression-evaluator-factory):

```typescript
const evaluator = await this.mediatorExpressionEvaluatorFactory
    .mediate({ algExpr: expression, context });
```

Besides `evaluate` and `evaluateAsEBV`, `evaluateAsEvaluatorExpression` returns the internal term
representation instead of an RDF/JS term, which avoids a conversion when the result is fed back into
the evaluator.


## Config

Just like many other actors, the ExpressionEvaluatorFactoryDefault expects a context object.
The following keys are of importance:
* KeysInitQuery.dataFactory: The RDF/JS data factory used to produce the resulting terms.
* KeysInitQuery.extensionFunctionCreator: A function that creates an extension function.
* KeysInitQuery.extensionFunctions: A map of function names to function implementations.
* KeysInitQuery.queryTimestamp: The timestamp to use for functions requiring a notion of "now".
* KeysInitQuery.functionArgumentsCache: see [later in this document](#functionArgumentsCache).
* KeysInitQuery.baseIRI: The base IRI to use for functions that require it.
* KeysExpressionEvaluator.defaultTimeZone: The default timezone to use for date functions, if none given, extracts the timezone from the `queryTimestamp` value. It can be desired to set it explicitly so `implicitTimezone` does not change over time (i.e., it is not dependent on daylight saving time).
* KeysExpressionEvaluator.superTypeProvider: A way of interacting with the type system, it's a callback that given a type unknown to the system, returns the super type of that type.
* KeysExpressionEvaluator.nonLexicalComparison: A boolean denoting the behaviour of comparators (e.g. <, >, =) when used with non-lexical literal operands.
  * `true`: treats it as a literal and compare both operands.
  * `false`: throws an error (default).
* KeysExpressionEvaluator.fullTermComparison: A boolean denoting the behaviour of comparators (e.g. <, >, =) when used with non-literal and mixed operands. Such non-literals are IRIs, blank nodes, languageStrings and triple terms.
  * `true`: compares them by type first and then by string value (see [non-lexical and full term comparison](#non-lexical-and-full-term-comparison)).
  * `false`: throws an error (default).


## Errors

The utils-expression-evaluator exports an Error class called `ExpressionError` from which all SPARQL related errors inherit.
These might include unbound variables, wrong types, invalid lexical forms, and much more.
These errors can be caught, and may impact program execution in an expected way.
All other errors are unexpected, and are thus programmer mistakes or mistakes in the context of the expression evaluator.

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


## Aggregates

The aggregation of bindings is handled by the [bus-bindings-aggregator-factory](https://github.com/comunica/comunica/tree/master/packages/bus-bindings-aggregator-factory).
Given a request for a certain aggregator, the factory will return an aggregator that can be used to aggregate bindings.
After all bindings have been put onto the aggregator, the result can be retrieved.
The aggregators tend to make use of other expression evaluation related busses like the
[`bus-term-comparator-factory`](https://github.com/comunica/comunica/tree/master/packages/bus-term-comparator-factory),
[`bus-function-factory`](https://github.com/comunica/comunica/tree/master/packages/bus-function-factory),
and most will use the [`bus-expression-evaluator-factory`](https://github.com/comunica/comunica/tree/master/packages/bus-expression-evaluator-factory).
Because of the dependency on these buses, the type system can also be used.

Additionally, you should also note the order of calling and awaiting `putBindings` while using the `GroupConcat` aggregator.

Outside of an engine, [`@comunica/expressions-sparql`](#standalone-usage) exposes these aggregators through
`createAggregator`.


## functionArgumentsCache

A `functionArgumentsCache` allows the expression evaluator to cache the implementation of a function given the argument types.
This decreases the overhead caused by function overloading.
When not providing a cache in the context, the evaluator will create one.

This cache can be reused across multiple evaluators. Manual modification is not recommended.


## Context dependant functions

Some functions (BNODE, NOW, IRI) need a (stateful) context from the caller to function correctly according to the spec.
This context can be passed as an argument to the evaluator (see the [config section](#config) for exact types).
If they are not passed, the evaluator will use a naive implementation that might do the trick for simple use cases.

### BNODE

[spec](https://www.w3.org/TR/sparql11-query/#func-bnode)[actor](https://github.com/comunica/comunica/tree/master/packages/actor-function-factory-expression-bnode)

Blank nodes are very dependent on the rest of the SPARQL query, therefore,
we provide the option of delegating the entire responsibility back to you by accepting a blank node constructor callback.
If this is not found, we create a blank node with the given label,
or we use uuid (v4) for argument-less calls to generate definitely unique blank nodes of the shape `blank_uuid`.

`bnode(input?: string) => RDF.BlankNode`

### Now

[spec](https://www.w3.org/TR/sparql11-query/#func-now)[actor](https://github.com/comunica/comunica/tree/master/packages/actor-function-factory-term-now)

All calls to now in a query must return the same value, since we aren't aware of the rest of the query,
you can provide a timestamp (`now: Date`). If it's not present, the evaluator will use the timestamp of evaluator creation,
this at least allows evaluation with multiple bindings to have the same `now` value.

### IRI

[spec](https://www.w3.org/TR/sparql11-query/#func-iri)[actor](https://github.com/comunica/comunica/tree/master/packages/actor-function-factory-term-iri)

To be fully spec compliant, the IRI/URI functions should take into account base IRI of the query,
which you can provide as `baseIRI: string` to the config.


## SPARQL 1.2

The expression evaluator package looks to the future and already implements some SPARQL 1.2 specification functions.

This includes the [extended date](https://github.com/w3c/sparql-12/blob/main/SEP/SEP-0002/sep-0002.md) functionality,
the directional language tag functions (`hasLANG`, `hasLANGDIR`, `LANGDIR`, `STRLANGDIR`),
and the triple term functions (`isTRIPLE`, `TRIPLE`, `SUBJECT`, `PREDICATE`, `OBJECT`).
Please note that the new sparql built-in `ADJUST` function has not been implemented due to package dependencies.


## Type System

The type system of the expression evaluator is tailored for doing (supposedly) quick evaluation of overloaded functions.

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
Examples include `xsd:float` and `xsd:decimal` to `xsd:double`and `xsd:anyURI` to `xsd:string`.
In this case, the datatype of the term will change to the type it is promoted to.


## Deviations from the SPARQL specification

Two functions have known deviations from the SPARQL specification in a few minor edge-cases.
These are the
[regex](https://github.com/comunica/comunica/tree/master/packages/actor-function-factory-term-regex)
and
[replace](https://github.com/comunica/comunica/tree/master/packages/actor-function-factory-term-replace)
functions.
These two functions require the implementation of a Regular Expression Engine.
Instead of implementing and bundling our own implementation of such an engine,
we use the implementation provided by the JavaScript language (in unicode-mode, without [Annex B](https://262.ecma-international.org/6.0/#sec-regular-expressions-patterns)).
This choice saves bundle size and probably execution time in comparison to implementing our own engine.
Furthermore, it reduces implementation and maintenance cost on our side.
As a result of using the JS Regex Engine, our implementation of those functions has some known non-spec compliant edge cases,
examples of which can be found in the skipped test blocks in
[op.regex-test.ts](https://github.com/comunica/comunica/blob/master/packages/actor-function-factory-term-regex/test/op.regex-test.ts)
and
[op.replace-test.ts](https://github.com/comunica/comunica/blob/master/packages/actor-function-factory-term-replace/test/op.replace-test.ts).

### Non-lexical and full term comparison

Note that this is for both comparison with the comparator functions (if you set the `nonLexicalComparison` and `fullTermComparison` options to true) and comparison used for `ORDER BY`.

Two terms are first compared by term type, in which the following order is used (from lowest to highest):

1. blank nodes
2. IRIs
3. (non-lexical) literals
4. quads
5. default graphs

[SPARQL 1.2](https://w3c.github.io/sparql-query/spec/#modOrderBy) defined ordering for the first four and we say default graphs is the lowest in priority.

For 2 operands of the same term type, except literals, the string values are compared. For (non-lexical) literals first the data types are compared and if they're equal, their values are compared. Different numeric data types are seen as equal (e.g. `xsd:integer` = `xsd:decimal`).

A few examples:

```SPARQL
_:abc < ex:abc < "abc"^^xsd:integer
"true"^^xsd:boolean < "abc"^^xsd:integer
"abc"^^xsd:integer = "abc"^^xsd:decimal
```

You can find a ton more examples in [`TermComparator-test.ts`](https://github.com/comunica/comunica/blob/b7128e8e97af0e8a73ab9147f8455702a8e76147/packages/actor-term-comparator-factory-expression-evaluator/test/TermComparator-test.ts).

