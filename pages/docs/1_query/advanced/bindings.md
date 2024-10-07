---
title: 'Bindings'
description: 'Bindings objects are used to represent results of SPARQL SELECT queries'
---

SPARQL `SELECT` query results are represented as a stream of _bindings_ (sometimes also referred to as `BindingsStream`),
where each bindings object represents a mapping from zero or more variables to RDF terms.

<div class="note">
The SPARQL specification uses <a href="https://www.w3.org/TR/sparql11-query/#sparqlSolutions">solution mapping</a> as terminology to refer to bindings.
This means that a bindings object is equivalent to a solution mapping,
and a <i>solution sequence</i> is equivalent to a bindings stream.
</div>

Bindings object are represented using the [RDF/JS `Bindings`](http://rdf.js.org/query-spec/#bindings-interface) interface,
and can be created using any RDF/JS [`BindingsFactory`](http://rdf.js.org/query-spec/#bindingsfactory-interface).
Comunica provides the [`@comunica/bindings-factory`](https://github.com/comunica/comunica/tree/master/packages/bindings-factory) package that implements these interfaces.

Below, several examples are shown on how these bindings objects can be used.
Please refer to [the README of `@comunica/bindings-factory`](https://github.com/comunica/comunica/tree/master/packages/bindings-factory) for a complete overview of its operations.

## Reading values of bindings

### `Bindings.has()`

The `has()` method is used to check if a value exists for the given variable.
The variable can either be supplied as a string (without `?` prefix), or as an RDF/JS variable.

```typescript
if (bindings.has('var1')) {
  console.log('Has var1!');
}
if (bindings.has(DF.variable('var2'))) {
  console.log('Has var2!');
}
```

### `Bindings.get()`

The `get()` method is used to read the bound value of variable.
The variable can either be supplied as a string (without `?` prefix), or as an RDF/JS variable.

```typescript
import * as RDF from '@rdfjs/types';

const term1: RDF.Term | undefined = bindings.get('var1');
const term2: RDF.Term | undefined = bindings.get(DF.variable('var2'));
```

### Entry iteration

Each bindings object is an Iterable over its key-value entries,
where each entry is a tuple of type `[RDF.Variable, RDF.Term]`.

```typescript
// Iterate over all entries
for (const [ key, value ] of bindings) {
  console.log(key);
  console.log(value);
}

// Save the entries in an array
const entries = [ ...bindings ];
```

<div class="note">
The iteration order is undefined,
so you should not assume a specific order of keys.
Instead, you can rely on the <a href="/docs/query/getting_started/query_app/#7-2-iterating-bindings-in-the-SELECTed-order">query result's metadata</a> which defines variables in a fixed order.
</div>

### `Bindings.toString`

The `toString()` method returns a compact string representation of the bindings object,
which can be useful for debugging.

```typescript
console.log(bindings.toString());

/*
Can output in the form of:
{
  "a": "ex:a",
  "b": "ex:b",
  "c": "ex:c"
}
 */
```

## Creating bindings

First, a bindings factory must be created:
```typescript
import * as RDF from '@rdfjs/types';
import { DataFactory } from '@comunica/data-factory';
import { BindingsFactory } from '@comunica/bindings-factory';

const DF = new DataFactory();
const BF = new BindingsFactory(DF);
```

Bindings can be created in different ways:
```typescript
const bindings1: RDF.Bindings = BF.bindings([
  [ DF.variable('var1'), DF.literal('abc') ],
  [ DF.variable('var2'), DF.literal('def') ],
]);

const bindings2: RDF.Bindings = BF.fromRecord({
  var1: DF.literal('abc'),
  var2: DF.literal('def'),
});
```
