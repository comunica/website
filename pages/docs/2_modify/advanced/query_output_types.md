---
title: 'Query output types'
description: 'An overview of the different output types for query operations.'
---

Comunica supports different [SPARQL query types](/docs/query/advanced/sparql_query_types/),
each of which may require different kinds of output.
For example, `SELECT` queries returns a stream of bindings,
`CONSTRUCT` and `DESCRIBE` returns a stream of quads,
and `ASK` returns a boolean.

This document gives an overview of how these different output types are represented.

## Query operation output type

All relevant types and interfaces are exposed by the
[Query Operation bus](/docs/modify/advanced/buses/#query-operation).

[`IActorQueryOperationOutput`](https://comunica.github.io/comunica/modules/bus_query_operation.html#iactorqueryoperationoutput-1)
is a TypeScript union type over the following interfaces:

* [`IActorQueryOperationOutputBindings`](https://comunica.github.io/comunica/interfaces/bus_query_operation.iactorqueryoperationoutputbindings.html): Represents a stream of bindings.
* [`IActorQueryOperationOutputQuads`](https://comunica.github.io/comunica/interfaces/bus_query_operation.iactorqueryoperationoutputquads.html): Represents a stream of quads.
* [`IActorQueryOperationOutputBoolean`](https://comunica.github.io/comunica/interfaces/bus_query_operation.iactorqueryoperationoutputboolean.html): Represents a boolean result.

## Bindings output

An output of type [`IActorQueryOperationOutputBindings`](https://comunica.github.io/comunica/interfaces/bus_query_operation.iactorqueryoperationoutputbindings.html)
looks as follows:

```typescript
interface IActorQueryOperationOutputBindings {
  type: 'bindings';
  context?: ActionContext;
  metadata?: () => Promise<{[id: string]: any}>;
  bindingsStream: BindingsStream;
  variables: string[];
  canContainUndefs: boolean;
}
```

The most important field in here is `bindingsStream`, which is of type [`BindingsStream`](https://comunica.github.io/comunica/modules/bus_query_operation.html#bindingsstream-1).
This is a stream containing [`Bindings`](https://comunica.github.io/comunica/modules/bus_query_operation.html#bindings-1),
which are of type `Map<string, RDF.Term>` where keys are variable names prefixes with `?`.

## Quads output

An output of type [`IActorQueryOperationOutputQuads`](https://comunica.github.io/comunica/interfaces/bus_query_operation.iactorqueryoperationoutputquads.html)
looks as follows:

```typescript
interface IActorQueryOperationOutputQuads {
  type: 'bindings';
  context?: ActionContext;
  metadata?: () => Promise<{[id: string]: any}>;
  quadStream: RDF.Stream & AsyncIterator<RDF.Quad>;
}
```

The most important field in here is `quadStream`, which is of type [`RDF.Stream`](/docs/query/advanced/rdfjs/)
containing [RDF/JS quads](/docs/query/advanced/rdfjs/).

## Boolean output

An output of type [`IActorQueryOperationOutputBoolean`](https://comunica.github.io/comunica/interfaces/bus_query_operation.iactorqueryoperationoutputboolean.html)
looks as follows:

```typescript
interface IActorQueryOperationOutputQuads {
  type: 'bindings';
  context?: ActionContext;
  booleanResult: Promise<boolean>;
}
```

The most important field in here is `booleanResult`, which is a promise resolving to a boolean.

## Casting an unknown output type

If your actor calls a query operation mediator, it will receive an output of type `IActorQueryOperationOutput`.
If you want to operate on the results directly,
and if you are not certain of the output type,
you will have to check the `type` field of the output,
and handle it accordingly.

If you however know beforehand what the type will be,
you can safely cast the output type with the following helper functions:

* `ActorQueryOperation.getSafeBindings`: Returns `IActorQueryOperationOutputBindings`.
* `ActorQueryOperation.getSafeQuads`: Returns `IActorQueryOperationOutputQuads`.
* `ActorQueryOperation.getSafeBoolean`: Returns `IActorQueryOperationOutputBoolean`.

For example, the minus query operation actor ([`@comunica/actor-query-operation-minus`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-minus))
can only operate on bindings streams.
As such, it can safely cast outputs as follows:

```typescript
const leftResult: IActorQueryOperationOutputBindings = ActorQueryOperation.getSafeBindings(
  await this.mediatorQueryOperation.mediate({ operation: pattern.right, context }),
);
const rightResult: IActorQueryOperationOutputBindings = ActorQueryOperation.getSafeBindings(
  await this.mediatorQueryOperation.mediate({ operation: pattern.left, context }),
);

leftResult.bindingsStream.filter(...);
```
