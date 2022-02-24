---
title: 'Joins'
description: 'Overview of how join operations are handled during query planning'
---

Join operations form a critical part most query engines.
The _order_ in which operations are joined, and the _algorithms_ that are used to execute those joins,
determine in large part the overall efficiency of query executions.
The acts of determining this order and the selection of the join algorithms are parts of _query planning_.

## Adaptive query planning

While most query engines perform query planning _before_ query execution,
Comunica does (part of) its query planning _during_ query execution,
which makes it an _adaptive_ query engine.
This is because Comunica aims to query over remote data sources,
which makes it difficult to determine the optimal query plan ahead of query execution.
Instead, the choices for query planning are taken as soon as they are required
and the relevant information about the sources is available.

## What is a join

SPARQL queries typically consist of many joins.
For example, the following SPARQL query requires two triple patterns to be joined:

```text
SELECT * WHERE {
  ?s <ex:p1> ?link.
  ?link <ex:p2> ?o.
}
```

A query engine can represent this as two join entries that each can produce bindings:

- Join entry 1 with bindings for variables `?s` and `?link`
- Join entry 2 with bindings for variables `?link` and `?o`

The join of these two entries will result in a new intermediary operation that produces bindings for the variables `?s`, `?link`, and `?o`.
The bindings in this intermediary operation will contain all existing combinations of these variables based on the two underlying join entries. 

For example, we assume the following bindings for the two join entries:

```text
join entry 1:
  { s: "ex:s1"; link: "ex:link1" }
  { s: "ex:s2"; link: "ex:link2" }
  { s: "ex:s3"; link: "ex:link3" }

join entry 2:
  { link: "ex:link1", o: "ex:o1" }
  { link: "ex:link1", o: "ex:o2" }
  { link: "ex:link3", o: "ex:o3" }
```

If we determine the possible combinations of these join entries following the _inner join_ semantics,
then we will obtain the following bindings:

```text
joined bindings:
  { s: "ex:s1"; link: "ex:link1"; o: "ex:o1" }
  { s: "ex:s1"; link: "ex:link1"; o: "ex:o2" }
  { s: "ex:s3"; link: "ex:link3"; o: "ex:o3" }
```

Note that the second binding of the first join entry does not appear in the final results,
because the value for `?link` (`"ex:link2"`) does not exist in the second join entry's bindings.

## Logical and physical joins

A _logical join_ type indicates the semantics of a join operation,
and are under control of the query writer.
The example above explains how the so-called **inner join** works,
which is the most common logical join within SPARQL queries.

There are however also two other logical join types that can occur within SPARQL queries:

- **Optional join** (or _left join_): a join with two entries where all bindings from the left entry are matched with the bindings from the right entry. If no matching bindings are found in the right entry, undefined values are used for those.
- **Minus join** (or _anti join_): a join with two entries where all bindings from the left entry are returned that have no corresponding bindings in the right entry.

Each logical join can be implemented via different _physical join_ algorithms.
The selection of these algorithms is usually done internally within query engines during query planning,
and is therefore not under control of the query writer.

For example, two popular algorithms for the inner join are the nested-loop-join and hash-join algorithms,
where the former is based on a nested for-loop, and the latter makes use of a hash-dictionary to achieve a lower computational complexity.

## Join actors

The [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join) bus in Comunica accepts join actions,
where each action determine the entries that require joining, and the logical join that is to be used.
For example, this bus will be invoked for the inner-join type when more than one operation (e.g. triple pattern) occurs in the query.

Currently, the following join actors are available in Comunica:

- **Inner join**
  - [`@comunica/actor-rdf-join-inner-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-hash): Hash join of two entries.
  - [`@comunica/actor-rdf-join-inner-nestedloop`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-nestedloop): Nested loop join of two entries.
  - [`@comunica/actor-rdf-join-inner-none`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-none): Join between zero entries, and returns a single binding.
  - [`@comunica/actor-rdf-join-inner-single`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-single): Join of a single entry, and returns the entry itself.
  - [`@comunica/actor-rdf-join-inner-symmetrichash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-symmetrichash): Symmetric hash join of two entries.
  - [`@comunica/actor-rdf-join-inner-multi-empty`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-empty): Multi-join that accepts any number of inner-join entries of which at least one is empty and returns an empty stream.
  - [`@comunica/actor-rdf-join-inner-multi-bind`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-bind): Multi-join that inner-joins 2 or more streams by picking the one with the lowest cardinality, binding each item with the remaining operations, and recursively resolving those operations by delegating to [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation).
  - [`@comunica/actor-rdf-join-inner-multi-sequential`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-sequential): Multi-join by just picking the two of them hierarchically.
  - [`@comunica/actor-rdf-join-inner-multi-smallest`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-smallest): Multi-join by always picking the first two streams with smallest estimate cardinality.
- **Optional join**
  - [`@comunica/actor-rdf-join-optional-bind`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-optional-bind): Join 2 streams using the bind join algorithm. It binds each item of the first stream with the second operation, and recursively resolving that operation by delegating to [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation).
  - [`@comunica/actor-rdf-join-optional-nestedloop`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-optional-nestedloop): Join 2 streams using the nested loop join algorithm.
- **Minus join**
  - [`@comunica/actor-rdf-join-minus-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-minus-hash): Join 2 streams using the hash join algorithm. This actor does _not_ support streams that can have undefined values.
  - [`@comunica/actor-rdf-join-minus-hash-undef`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-minus-hash-undef): Join 2 streams using the hash join algorithm. This actor supports streams that can have undefined values.

## Selecting physical joins

<div class="note">
Actor selection in Comunica is done using mediators.
Learn more about mediators in the <a href="/docs/modify/advanced/architecture_core/">core architecture</a>.
</div>

The [Join Coefficients Mediator](https://github.com/comunica/comunica/tree/master/packages/mediator-join-coefficients-fixed) is a mediator that will select the "optimal" join actor based on their join coefficients (cost estimates).
Each join actor can calculate their join coefficients based on metadata that is provided by data sources.

The available join coefficients that are calculated by each join actor are:

- `iterations`: An estimation of how many iterations over items are executed. This is used to determine the CPU cost.
- `persistedItems`: An estimation of how many items are stored in memory. This is used to determine the memory cost.
- `blockingItems`: An estimation of how many items block the stream. This is used to determine the time the stream is not progressing anymore.
- `requestTime`: An estimation of the time to request items from sources. This is used to determine the I/O cost.

The Join Coefficients Mediator
can be configured with weights to calculate an overall cost based on these join coefficients,
after which the actor with the lowest overall cost will be allowed to execute the action.

<div class="note">
If you want to inspect or debug the chosen physical joins,
you can use the <a href="/docs/query/advanced/explain/">explain functionality</a>,
or make use of the <a href="/docs/query/advanced/logging/">logger</a>.
</div>

### Physical join selection example

We assume two join entries with the following cardinalities (a.k.a., estimated number of bindings):

- Join entry 1: 10
- Join entry 2: 1.000

Assuming the availability of the nested-loop-join and hash-join actors,
these will calculate the join coefficients as follows:

- Nested-loop-join
  - `iterations = 10 * 1.000 = 10.000`
  - `persistedItems = 0`
  - `blockingItems = 0`
- Hash-join
  - `iterations = 10 + 1.000 = 1.010`
  - `persistedItems = 10`
  - `blockingItems = 10`

_The `requestTime` join coefficient is omitted out for simplicity._

If the Join Coefficients Mediator gives equal weights to all join coefficients,
then it can come up with the following overall costs, which would make hash-join the selected physical actor:

- Nested-loop-join: `10.000 + 0 + 0 = 10.000`
- Hash-join: `1.010 + 10 + 10 = 1.030`

However, if the Join Coefficients Mediator would be configured to give a much higher weight (`10.000`)
to the number of blocking items (e.g. when early results are prioritized),
then the overall costs would become, which would make nested-loop join the selected physical actor:

- Nested-loop-join: `10.000 + 0 * 1.000 + 0 = 10.000`
- Hash-join: `1.010 + 10 * 10.000 + 10 = 11.020`
