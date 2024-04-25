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

Make sure to run `yarn run build` in the repo root to make sure that your modifications
to the TypeScript files have been compiled to JavaScript.

## 2. Set values in our config file

Everything has now been setup to define values for our parameter via the config file.

As such, we can **modify our declaration of our actor in `engines/config-query-sparql/config/query-operation/actors/query/reduced.json`** by adding a value for `"myParam"`:
```text
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^3.0.0/components/context.jsonld",

    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-reduced-my/^3.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:default:Runner",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:query-operation/actors#reduced",
      "@type": "ActorQueryOperationReducedMy",
      "mediatorQueryOperation": { "@id": "urn:comunica:default:query-operation/mediators#main" }
      "myParam": 123
    }
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

<div class="note">
When running <code>yarn run build</code>, a JSON-LD representation of your TypeScript files
will be created in the <code>components/</code> directory of your package.
The <code>components/context.jsonld</code> will list all discovered parameters that you can pass within the config file. 
</div>
