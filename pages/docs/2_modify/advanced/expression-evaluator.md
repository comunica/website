---
title: 'Expression Evaluator'
description: 'The expression evaluation engine of Comunica.'
---

To evaluate expressions, Comunica uses a collection of packages that are part of the Comunica monorepo.
Two buses specifically are of importance:
* [`@comunica/bus-expression-evaluator-factory`](): Creates an expression evaluator, more info listed bellow.
* [`@comunica/bus-function factory`](): creates function, more specifically it creates objects that are able to evaluate the desired function given the arguments.

Two different kind of functions are used `TermFunctions` and `ExpressionFunctions`, and TermFunction extends ExpressionFunction.
An `ExpressionFunction` is a function that takes control over the evaluation of its arguments, meaning that the argument of an ExpressionFunction are Expressions and not Terms.
The evaluation of the function is async.
A `TermFunction` on the other hand does not take control over the evolution of its arguments, and is synchronous.
In scenarios where you already have the term and can only are in a synchronous context, you can use a `TermFunction`.
Besides easier usage of TermFunctions, they are also easier to implement since the `declare` function of [the expression evaluator utils package]() can be used.
This `declare` function allows for easy definition of functions that have function overloading.
Functions created using `declare` use the OverloadTree, thereby also allowing for type promotion and subtype substitution.
TLDR: Use `TermFunction` when you can using `declare`, and `ExpressionFunction` when you need to.


## Using The Expression Evaluator

```ts
import type { MediatorExpressionEvaluatorFactory } from '@comunica/bus-expression-evaluator-factory';
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
const evaluator = await mediatorExpressionEvaluatorFactory
    .mediate({ algExpr: expression, context });

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
// ... or as an inetrnal Expression
evaluateAsEvaluatorExpression.evaluateAsEvaluatorExpression(bindings);
```


## Config

Just like many other actors, the ExpressionEvaluatorFactoryDefault expects a context object.
The following keys are of importance:
* KeysInitQuery.extensionFunctionCreator: A function that creates an extension function.
* KeysInitQuery.extensionFunctions: A map of function names to function implementations.
* KeysInitQuery.queryTimestamp: The timestamp to use for functions requiring a notion of "now".
* KeysInitQuery.functionArgumentsCache: see [later in this document](#functionArgumentsCache).
* KeysExpressionEvaluator.defaultTimeZone: The default timezone to use for date functions, if none given, extracts the timezone from the `queryTimestamp` value. It can be desired to set it explicitly so `implicitTimezone` does not change over time (i.e., it is not dependent on daylight saving time). 
* KeysExpressionEvaluator.superTypeProvider: A way of interacting with the type system, it's a callback that given a type unknown to the system, returns the super type of that type.
* KeysExpressionEvaluator.baseIRI: The base IRI to use for functions that require it.


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

The aggregation of bindings is handled by the [bus-bindings-aggregator-factory]().
Given a request for a certain aggregator, the factory will return an aggregator that can be used to aggregate bindings.
After all bindings have been put onto the aggregator, the result can be retrieved.
The aggregators tend to make use of other expression evaluation related busses like the
[`bus-term-comparator-factory`](), [`bus-function-factory`](), and most will use the [`bus-expression-evaluator-factory`]().
Because of the dependency on these buses, the type system can also be used.

Additionally, you should also note the order of calling and awaiting put while using the `GroupConcat` aggregator.


## functionArgumentsCache

An `functionArgumentsCache` allows the expression evaluator to cache the implementation of a function provided the| argument types.
This decreases the overhead caused by function overloading.
When not providing a cache in the context, the evaluator will create one.

This cache can be reused across multiple evaluators. Manual modification is not recommended.


## Context dependant functions

Some functions (BNODE, NOW, IRI) need a (stateful) context from the caller to function correctly according to the spec.
This context can be passed as an argument to the evaluator (see the [config section](#config) for exact types).
If they are not passed, the evaluator will use a naive implementation that might do the trick for simple use cases.

### BNODE

[spec](https://www.w3.org/TR/sparql11-query/#func-bnode)[actor]()

Blank nodes are very dependent on the rest of the SPARQL query, therefore,
we provide the option of delegating the entire responsibility back to you by accepting a blank node constructor callback.
If this is not found, we create a blank node with the given label,
or we use uuid (v4) for argument-less calls to generate definitely unique blank nodes of the shape `blank_uuid`.

`bnode(input?: string) => RDF.BlankNode`

### Now

[spec](https://www.w3.org/TR/sparql11-query/#func-now)[actor]()

All calls to now in a query must return the same value, since we aren't aware of the rest of the query,
you can provide a timestamp (`now: Date`). If it's not present, the evaluator will use the timestamp of evaluator creation,
this at least allows evaluation with multiple bindings to have the same `now` value.

### IRI

[spec](https://www.w3.org/TR/sparql11-query/#func-iri)[actor]()

To be fully spec compliant, the IRI/URI functions should take into account base IRI of the query,
which you can provide as `baseIRI: string` to the config.


## SPARQL 1.2

The expression evaluator package looks to the future and already implements some SPARQL 1.2 specification functions.

Currently, this is restricted to the [extended date](https://github.com/w3c/sparql-12/blob/main/SEP/SEP-0002/sep-0002.md) functionality.
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
