---
title: 'Adding a config parameter to an actor'
description: 'For an existing actor, add a parameter that can be customized in the config file.'
---

In this guide, we will add a parameter to an existing actor,
and show how to set values for this parameter via the config file.

We will start from the actor we have created in the [guide on contributing a new actor](/docs/modify/getting_started/contribute_actor/).

## 1. Modifying the constructor

We want to add a parameter that is set at configuration/startup time.
For this, we need to make sure that our actor accepts this parameter via the constructor.

For this, first create a **new interface** that is used as single argument in the constructor:
```typescript
export interface IActorQueryOperationReducedMyArgs extends IActorQueryOperationTypedMediatedArgs {
  myParam: number;
}
```
Here, `IActorQueryOperationTypedMediatedArgs` is the default constructor argument
for query operation actors that contains common parameters that will automatically be set behind the scenes.

Next, **replace our constructor** with the following:
```typescript
public constructor(args: IActorQueryOperationReducedMyArgs) {
  super(args, 'reduced');
}
```

In order to use the passed parameter values,
add the following field in your class:

```typescript
private readonly myParam: number;
```

In order to temporarily check the passed parameter value,
we can add a `console.log` statement in the `runOperation` method. 

## 2. Defining our parameter in the components file

Before we can set values of our parameter in the config file,
we have to declaratively define this parameter in our [components file](/docs/modify/advanced/componentsjs/). 

For this, **adjust `components/Actor/QueryOperation/ReducedMy.jsonld`** as follows:
```jsonld
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-reduced-my/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/bus-query-operation/^1.0.0/components/context.jsonld"
  ],
  "@id": "npmd:@comunica/actor-query-operation-reduced-my",
  "components": [
    {
      "@id": "caqorm:Actor/QueryOperation/ReducedMy",
      "@type": "Class",
      "extends": "cbqo:Actor/QueryOperationTypedMediated",
      "requireElement": "ActorQueryOperationReducedMy",
      "comment": "A comunica Reduced My Query Operation Actor.",
      "parameters": [
        {
          "@id": "caqorm:Actor/QueryOperation/ReducedMy#myParam",
          "range": "xsd:integer",
          "required": true,
          "unique": true
        }
      ],
      "constructorArguments": [
        {
          "@id": "caqorm:Actor/QueryOperation/ReducedMy#constructorArgumentsObject",
          "extends": "cbqo:Actor/QueryOperationTypedMediated/constructorArgumentsObject",
          "fields": [
            {
              "keyRaw": "myParam",
              "value": "caqorm:Actor/QueryOperation/ReducedMy#myParam"
            }
          ]
        }
      ]
    }
  ]
}

```
The new entries are in `"parameters"` and `"constructorArguments"`,
and refer to the new parameter we have defined in our TypeScript constructor.

## 3. Set values in our config file

Everything has now been setup to define values for our parameter via the config file.

As such, we can **modify our declaration of our actor in `engines/query-sparql/config/sets/sparql-queryoperators.json`**:
```text
{
  "@context": [
    ...
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-reduced-my/^1.0.0/components/context.jsonld",
  ],
  "@id": "urn:comunica:my",
  "actors": [
    ...
    {
      "@id": "config-sets:sparql-queryoperators.json#myReducedQueryOperator",
      "@type": "ActorQueryOperationReducedMy",
      "cbqo:mediatorQueryOperation": { "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation" },
      "caqorm:Actor/QueryOperation/ReducedMy#myParam": 123
    },
  ]
}
```

As a test, you can now attempt a [query execution with our config](/docs/modify/getting_started/contribute_actor/#7--testing-with-comunica-sparql).
If you placed a `console.log` statement in your actor,
you should now see the value `123` on stdout.

<div class="note">
In this guide, we showed how to define an integer parameter.
You can instead also define other parameter types,
where parameters can even accept other components (such as mediators).
</div>
