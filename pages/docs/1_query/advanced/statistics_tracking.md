---
title: 'Statistics Tracking System'
description: 'Comunica provides real-time runtime statistics during query execution.'
---

Comunica includes a **dynamic runtime statistics tracking system** that monitors key performance metrics throughout query execution.  
These statistics cover aspects such as the number of intermediate results, discovered links, and dereferenced links.  

As the query executes, Comunica **emits these metrics in real time**, enabling other (future) Comunica actors to adaptively optimize query processing.  
After query completion, these statistics can be analyzed to gain insights into execution behavior and performance characteristics.  

## Link Discovery and Dereference Events

Comunica automatically tracks **link discovery** and **link dereference** events when `StatisticLinkDiscovery` and `StatisticLinkDereference` instances are added to the context under the appropriate key.  
This key is defined as the statistic class attribute `.key`.  

When querying from a JavaScript application, statistics tracking can be enabled as follows:

```typescript
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const engine = new QueryEngine();

const query: string = " .... "
const context: Record<string, any> = {};

const statistic = new StatisticLinkDiscovery()
context[statistic.key.name] = statistic;
// Insert other required elements of the context here
context[...] = ...
const bindingsStream = await this.engine.queryBindings(query, context);
```

These statistic trackers function as event emitters, allowing other processes to listen for events as follows.

```typescript
statistic.on((data) => {
    // Do something here
});
```

Other Comunica actors can access the `statistic` object by retrieving it from the context.

### Command Line

Comunica does not natively support statistic tracking from the command line.  
However, it would be easy to add it to the context using an actor subscribing to the `bus-context-preprocess`.  
The implementation would be similar to the implementation of [actor-context-preprocess-set-defaults](https://github.com/comunica/comunica/tree/master/packages/actor-context-preprocess-set-defaults).  


## Intermediate Result Events

Tracking intermediate results follows a similar approach to the other statistics, but it requires a [custom configuration](https://comunica.dev/docs/modify/getting_started/custom_config_app/) with additional setup steps.  
Intermediate result events are captured by wrapping the `query-operation` and `rdf-join` streams with a callback.  
This wrapping is performed by actors subscribing to the [bus-iterator-transform](https://github.com/comunica/comunica/tree/master/packages/bus-iterator-transform) bus, which allows multiple wraps of a single stream.

To track intermediate results produced by join actors, include the following actor:

```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^4.0.0/components/context.jsonld",

    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-rdf-join-wrap-stream/^4.0.0/components/context.jsonld"],
  "@id": "urn:comunica:default:Runner",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:rdf-join/actors#wrap-stream",
      "@type": "ActorRdfJoinWrapStream",
      "mediatorJoinSelectivity": { "@id": "urn:comunica:default:rdf-join-selectivity/mediators#main" },
      "mediatorJoin": { "@id": "urn:comunica:default:rdf-join/mediators#main" },
      "mediatorIteratorTransform": { "@id": "urn:comunica:default:iterator-transform/mediators#main" }
    }
  ]
}
```

To track intermediate results produced by query operation actors, include the following actor:

```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^4.0.0/components/context.jsonld",

    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-wrap-stream/^4.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:default:Runner",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:query-operation/actors#wrap-stream",
      "@type": "ActorQueryOperationWrapStream",
      "mediatorQueryOperation": { "@id": "urn:comunica:default:query-operation/mediators#main" },
      "mediatorIteratorTransform": { "@id": "urn:comunica:default:iterator-transform/mediators#main" }
    }
  ]
}
```

To define the wrapper applied to each intermediate result stream, include the following actor and mediator:

```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^4.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-iterator-transform-record-intermediate-results/^4.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:default:Runner",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:iterator-transform/actors#record-intermediate-results",
      "@type": "ActorIteratorTransformRecordIntermediateResults",
      "wraps": ["inner", "minus", "optional", "project"]
    }
  ]
}
```
Mediator:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/bus-iterator-transform/^4.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/mediator-combine-pipeline/^4.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:default:iterator-transform/mediators#main",
  "@type": "MediatorCombinePipeline",
  "bus": { "@id": "ActorIteratorTransform:_default_bus" },
  "filterFailures": true
}
```
The `wraps` field on the `ActorIteratorTransformRecordIntermediateResults` indicates which query operations or joins will be wrapped.  
In the example, intermediate results for inner, minus, and optional joins will be recorded, in addition to the final project result.  
These intermediate results are produced and emitted by `StatisticIntermediateResults`, which should be included in the context in the same manner as `StatisticLinkDiscovery` and `StatisticLinkDereference`.