---
title: 'Mediators'
description: 'An overview of all mediators in Comunica.'
---

Mediators form a critical part of [Comunica's core architecture](/docs/modify/advanced/architecture_core/).
They are responsible for **selecting one actor from a bus**, based on a given task.

While actors perform the actual logic, they never communicate with each other directly.
Instead, they always communicate through mediators, to reduce coupling between actors.
If a different actor selection technique is needed,
a different mediator can be configured without having to change any buses or actors.

## Mediator implementations

| Name | Package | Description |
| ---- | ------- | ----------- |
| Race | [`@comunica/mediator-race`](https://github.com/comunica/comunica/tree/master/packages/mediator-race) | Picks the first actor that resolves its test. |
| Number | [`@comunica/mediator-number`](https://github.com/comunica/comunica/tree/master/packages/mediator-number) | Mediates over a single number field. It can either choose the actor with the maximum or with the minimum value. |
| All | [`@comunica/mediator-all`](https://github.com/comunica/comunica/tree/master/packages/mediator-all) | Special mediator that runs _all_ actors that resolve their test in parallel. |
| Combine Pipeline | [`@comunica/mediator-combine-pipeline`](https://github.com/comunica/comunica/tree/master/packages/mediator-combine-pipeline) | Special mediator that goes over all actors in sequence and forwards I/O. This requires the action input and the actor output to be of the same type. |
| Combine Union | [`@comunica/mediator-combine-union`](https://github.com/comunica/comunica/tree/master/packages/mediator-combine-union) | Special mediator that takes the union of all actor results. |
| Join Coefficients Fixed | [`@comunica/mediator-join-coefficients-fixed`](https://github.com/comunica/comunica/tree/master/packages/mediator-join-coefficients-fixed) | Mediates over join actors implementing the [Join Coefficients mediator type](https://github.com/comunica/comunica/tree/master/packages/mediatortype-join-coefficients). |

## Mediator types

Comunica contains several packages named `@comunica/mediatortype-*`
that expose interfaces that extend the `IActorTest` interface.
These interfaces can be reused in different actors to indicate what properties can be mediated over.

The following mediator types are available:

| Name | Package | Description |
| ---- | ------- | ----------- |
| HTTP Requests | [`@comunica/mediatortype-httprequests`](https://github.com/comunica/comunica/tree/master/packages/mediatortype-httprequests) | Number of HTTP requests required for an action. |
| Iterations | [`@comunica/mediatortype-iterations`](https://github.com/comunica/comunica/tree/master/packages/mediatortype-iterations) | Number of iterations that are needed for joining streams. |
| Priority | [`@comunica/mediatortype-priority`](https://github.com/comunica/comunica/tree/master/packages/mediatortype-priority) | Priority of an actor, for example used for parsers and serializers in content negotiation. |
| Time | [`@comunica/mediatortype-time`](https://github.com/comunica/comunica/tree/master/packages/mediatortype-time) | Estimated time an action will take. |
| Join Coefficients | [`@comunica/mediatortype-join-coefficients`](https://github.com/comunica/comunica/tree/master/packages/mediatortype-join-coefficients) | Represents the cost of a join operation on the [RDF Join bus](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join). |

## Configuring and using a mediator

### Defining a component mediator parameter

The following components file shows how a `mediatorJoin` parameter is added to [`@comunica/actor-query-operation-join`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-join):
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-join/^3.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/bus-query-operation/^3.0.0/components/context.jsonld"
  ],
  "@id": "npmd:@comunica/actor-query-operation-join",
  "components": [
    {
      "@id": "caqoj:Actor/QueryOperation/Join",
      "@type": "Class",
      "extends": "cbqo:Actor/QueryOperationTypedMediated",
      "requireElement": "ActorQueryOperationJoin",
      "comment": "A comunica Join Query Operation Actor.",
      "parameters": [
        {
          "@id": "caqoj:mediatorJoin",
          "comment": "A mediator for joining Bindings streams",
          "required": true,
          "unique": true
        }
      ],
      "constructorArguments": [
        {
          "extends": "cbqo:Actor/QueryOperationTypedMediated/constructorArgumentsObject",
          "fields": [
            {
              "keyRaw": "mediatorJoin",
              "value": "caqoj:mediatorJoin"
            }
          ]
        }
      ]
    }
  ]
}
```

### Instantiating a component mediator

The following config file shows how we instantiate an actor with a race mediator over the RDF join bus ([`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join)):
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-join/^3.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/mediator-race/^3.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:my",
  "actors": [
    {
      "@id": "config-sets:sparql-queryoperators.json#myJoinQueryOperator",
      "@type": "ActorQueryOperationJoin",
      "caqoj:mediatorJoin": {
        "@id": "config-sets:sparql-queryoperators.json#mediatorRdfJoin",
        "@type": "MediatorRace",
        "cc:Mediator/bus": { "@id": "cbrj:Bus/RdfJoin" }
      }
    }
  ]
}
``` 

### Invoking a mediator in TypeScript

Invoking the mediator in a TypeScript actor implementation is done like this:
```typescript
import { IActionContext } from '@comunica/types';
import { AIActorTest, Mediator } from '@comunica/core';
import { ActorRdfJoin, IActionRdfJoin } from '@comunica/bus-rdf-join';
import { IMediatorTypeIterations } from '@comunica/mediatortype-iterations';
import type { TestResult } from '@comunica/core';
import { passTestVoid } from '@comunica/core';

export class ActorQueryOperationJoin extends ActorQueryOperationTypedMediated<Algebra.Join> {

  public readonly mediatorJoin: Mediator<ActorRdfJoin,
  IActionRdfJoin, IMediatorTypeIterations, IActorQueryOperationOutput>;

  public constructor(args: IActorQueryOperationJoinArgs) {
    super(args, 'join');
  }

  public async testOperation(pattern: Algebra.Join, context: IActionContext): Promise<TestResult<IActorTest>> {
    return passTestVoid();
  }

  public async runOperation(pattern: Algebra.Join, context: IActionContext): Promise<IActorQueryOperationOutput> {
    const myAction: IActionRdfJoin = { ... }; 
    return this.mediatorJoin.mediate(myAction);
  }
}

export interface IActorQueryOperationJoinArgs extends IActorQueryOperationTypedMediatedArgs {
  mediatorJoin: Mediator<ActorRdfJoin, IActionRdfJoin, IMediatorTypeIterations, IActorQueryOperationOutput>;
}
```
