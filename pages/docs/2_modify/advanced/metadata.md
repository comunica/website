---
title: 'Metadata'
description: 'Information for adaptive planning of query operations.'
---

As Comunica follows a [hypermedia-driven query execution model](/docs/modify/advanced/hypermedia/)
to allow source capabilities to be detected and exploited on-the-fly,
there is a need for keeping track of the _metadata_ of such sources.
This metadata can then be used to determine how the remaining query execution should happen.

## Interface

All bindings streams and quad streams are coupled with a [`IMetadata`](https://comunica.github.io/comunica/interfaces/types.IMetadata.html) object,
which could look as follows:
```json
{
  "cardinality": { 
    "type": "estimate",
    "value": 10403,
    "dataset": "https://fragments.dbpedia.org/2016-04/en"
  },
  "canContainUndefs": false,
  "pageSize": 100,
  "requestTime": 1056,
  "order": [
    { "variable": "keyA", "order": "asc" },
    { "variable": "keyB", "order": "desc" }
  ]
}
```

The `cardinality` is one of the most important fields in this metadata object,
as it determines an estimate or exact representation of the number of entries in the current bindings or quad stream.
This information is crucial for [join query planning](/docs/modify/advanced/joins/).

## Extraction

The fields in metadata objects are determined by a combination of actors activate on the
[`@comunica/bus-rdf-metadata-extract`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata-extract) bus.
These actors will inspect the current HTTP response (body and headers) to determine what fields to populate the metadata object with.

For example, if the `hydra:count` predicate is present in the response,
the [`@comunica/actor-rdf-metadata-extract-hydra-count`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-hydra-count)
actor can use this value to determine the cardinality.

<div class="note">
Cardinalities can also be determined by source-specific actors on the
<a href="https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-quad-pattern"><code>@comunica/bus-rdf-resolve-quad-pattern</code></a> bus.
</div>

## Accumulation

Sometimes, metadata objects need to be merged together.
This is required in 2 places:
* [`@comunica/actor-rdf-resolve-quad-pattern-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-hypermedia): Merging the metadata objects discovered when following multiple links in a hypermedia source.
* [`@comunica/actor-rdf-resolve-quad-pattern-federated`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-federated): Merging the metadata objects of a quad pattern federated over different sources.

The [`@comunica/bus-rdf-metadata-accumulate`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata-accumulate) bus
consists of actors that determine how each field in metadata objects need to be merged together.
Most fields (such as `requestTime` and `pageSize`) involve a simple addition.
However, the `cardinality` fields involves more complexity, as will be explained below.

### Accumulating cardinalities

If cardinalities are exact, then the accumulating involves a simple addition:

```text
Cardinality1:   { type: 'exact', value: 100 }
Cardinality2:   { type: 'exact', value: 5 }
CardinalityOut: { type: 'exact', value: 105 }
```

If one of the cardinalities is an estimate, then the accumulated cardinality will also be an estimate, but we can still add them:

```text
Cardinality1:   { type: 'exact', value: 100 }
Cardinality2:   { type: 'estimate', value: 5 }
CardinalityOut: { type: 'estimate', value: 105 }
```

If one of the cardinalities is a dataset-wide cardinality, while the other is not dataset-wide (e.g. during link traversal),
then the first cardinality is kept:

```text
Cardinality1:   { type: 'exact', value: 100, dataset: 'ex:dataset1' }
Cardinality2:   { type: 'estimate', value: 5 }
CardinalityOut: { type: 'exact', value: 100, dataset: 'ex:dataset1' }
```

If a cardinality is a subset of a dataset (e.g. when performing a specific TPF request), then the subset cardinality is kept:

```text
Cardinality1:   { type: 'exact', value: 100, dataset: 'ex:dataset1' }
Cardinality2:   { type: 'exact', value: 5, subsetOf: 'ex:dataset1' }
CardinalityOut: { type: 'exact', value: 5, dataset: 'ex:dataset1' }
```

If cardinalities with different datasets are accumulated (e.g. during federation),
then they are directly added, without their dataset scope:

```text
Cardinality1:   { type: 'exact', value: 100, dataset: 'ex:dataset1' }
Cardinality2:   { type: 'estimate', value: 5, dataset: 'ex:dataset2' }
CardinalityOut: { type: 'estimate', value: 105 }
```

## States

All metadata objects have a `state` field, which refers to an [`IMetadataValidationState`](https://comunica.github.io/comunica/interfaces/types.IMetadataValidationState.html).
This state allows you to inspect if this metadata is still valid, or to listen to metadata invalidations.
If a metadata object is invalid, it should not be used anymore, and a new version should be requested from the bindings or quad stream.

Metadata states can for example be updated if a series of links is being followed during link traversal of a source,
with the cardinality being continuously incremented for each additional document that is found after following a link.

These metadata states enable actors to adaptively act upon newly discovered information in sources.
