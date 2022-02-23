---
title: 'Query operation result types'
description: 'An overview of the different output types for query operations.'
---

Comunica supports different [SPARQL query types](/docs/query/advanced/sparql_query_types/),
each of which may require different kinds of output.
For example, `SELECT` queries returns a stream of bindings,
`CONSTRUCT` and `DESCRIBE` returns a stream of quads,
and `ASK` returns a boolean.

This document gives an overview of how these different output types are represented internally by Comunica actors.

## Query operation output type

All relevant types and interfaces are exposed by the
[Comunica types package](https://github.com/comunica/comunica/tree/master/packages/types).

[`IQueryOperationResult`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresult)
is a TypeScript union type over the following interfaces:

* [`IQueryOperationResultBindings`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresultbindings): Represents a stream of bindings.
* [`IQueryOperationResultQuads`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresultquads): Represents a stream of quads.
* [`IQueryOperationResultBoolean`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresultboolean): Represents a boolean result.
* [`IQueryOperationResultVoid`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresultvoid): Represents a void result.

## Bindings output

An output of type [`IQueryOperationResultBindings`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresultbindings)
looks as follows:

```typescript
interface IQueryOperationResultBindings {
  type: 'bindings';
  context: ActionContext;
  metadata: () => Promise<IMetadata>;
  bindingsStream: BindingsStream;
}
```

The most important field in here is `bindingsStream`, which is of type [`BindingsStream`](https://comunica.github.io/comunica/modules/types.html#bindingsstream).
This is a stream containing Bindings.

## Quads output

An output of type [`IQueryOperationResultQuads`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresultquads)
looks as follows:

```typescript
interface IQueryOperationResultQuads {
  type: 'quads';
  context: ActionContext;
  metadata: () => Promise<IMetadata>;
  quadStream: RDF.Stream & AsyncIterator<RDF.Quad>;
}
```

The most important field in here is `quadStream`, which is of type [`RDF.Stream`](/docs/query/advanced/rdfjs/)
containing [RDF/JS quads](/docs/query/advanced/rdfjs/).

## Boolean output

An output of type [`IQueryOperationResultBoolean`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresultboolean)
looks as follows:

```typescript
interface IQueryOperationResultBoolean {
  type: 'bindings';
  context: ActionContext;
  execute: () => Promise<boolean>;
}
```

The most important method in here is `execute`, which returns a promise resolving to a boolean.

## Void output

An output of type [`IQueryOperationResultVoid`](https://comunica.github.io/comunica/modules/types.html#iqueryoperationresultvoid)
looks as follows:

```typescript
interface IQueryOperationResultVoid {
  type: 'void';
  context: ActionContext;
  execute: () => Promise<void>;
}
```

The most important method in here is `execute`, which returns a void promise.

## Casting an unknown output type

If your actor calls a query operation mediator, it will receive an output of type `IActorQueryOperationOutput`.
If you want to operate on the results directly,
and if you are not certain of the output type,
you will have to check the `type` field of the output,
and handle it accordingly.

If you however know beforehand what the type will be,
you can safely cast the output type with the following helper functions:

* `ActorQueryOperation.getSafeBindings`: Returns `IQueryOperationResultBindings`.
* `ActorQueryOperation.getSafeQuads`: Returns `IQueryOperationResultQuads`.
* `ActorQueryOperation.getSafeBoolean`: Returns `IQueryOperationResultBoolean`.
* `ActorQueryOperation.getSafeVoid`: Returns `IQueryOperationResultVoid`.

For example, the minus query operation actor ([`@comunica/actor-query-operation-minus`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-minus))
can only operate on bindings streams.
As such, it can safely cast outputs as follows:

```typescript
const leftResult: IQueryOperationResultBindings = ActorQueryOperation.getSafeBindings(
  await this.mediatorQueryOperation.mediate({ operation: pattern.right, context }),
);
const rightResult: IQueryOperationResultBindings = ActorQueryOperation.getSafeBindings(
  await this.mediatorQueryOperation.mediate({ operation: pattern.left, context }),
);

leftResult.bindingsStream.filter(...);
```
