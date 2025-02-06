---
title: 'Statistics Tracking System'
description: 'Comunica makes runtime statistics available during query execution.'
---

Comunica features a dynamic runtime statistics tracking system that continuously monitors various performance metrics during query execution. These statistics include the number of intermediate results produced, discovered links, and dereferenced links. 
As the query is run, Comunica emits these metrics in real time, providing insights into execution behavior and potential optimization opportunities.
These statistics can be analyzed after query completion to understand execution characteristics or used internally by future algorithms to adaptively optimize query processing.

## Link Discovery and Dereference Events

Comunica will automatically track discovery and dereference events when a `StatisticLinkDiscovery` and `StatisticLinkDereference` are added to the context under the appropriate key. This key is a class attribute `StatisticLinkDereference.key`.
 
When querying from a javascript application, statistic tracking can be enabled like this:

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

These statistic trackers are event emitters and other processes can listen to the events as follows.

```typescript
statistic.on((data) => {
    // Do something here
});
```

Other Comunica actors can obtain this `statistic` object by retrieving it from the context.

### Command Line

Comunica does not natively support statistic tracking from the command line. However, it would be easy to add it to the context using an actor subscribing to the `bus-context-preprocess`. The implementation would be similar to the implementation of [actor-context-preprocess-set-defaults](https://github.com/comunica/comunica/tree/master/packages/actor-context-preprocess-set-defaults)

## Intermediate Result Events

While tracking intermediate results functions similarly to the previous statistics, it requires additional configuration steps. Intermediate result events are registered by wrapping `query-operation` and `rdf-join` streams with a callback. The wrapping is done by actors subscribing to the [bus-iterator-transform](https://github.com/comunica/comunica/tree/master/packages/bus-iterator-transform) bus which allows a single stream to be wrapped multiple times. TODO: Add example config with explanation that you can decide what streams from what operations to wrap
