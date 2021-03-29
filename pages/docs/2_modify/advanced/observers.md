---
title: 'Observers'
description: 'Passively observe actions executed by actors on a given bus.'
---

Observers are an optional element in [Comunica's core architecture](/docs/modify/advanced/architecture_core/).
They allow you to **listen to all actions on a bus**, without modifying the action's input or output.

Observers ([`ActionObserver`](https://comunica.github.io/comunica/classes/core.actionobserver.html)) require a `bus` parameter, which should be supplied in the config file.
Your observer implementation must override the following `onRun` method:
```typescript
interface ActionObserver {
  onRun(
    actor: Actor<IAction, IActorTest, IActorOutput>,
    action: IAction,
    output: Promise<IActorOutput>,
  ): void;
}
```
This method allows you to see the handling actor, the executed action, and a promise to the action output.

[Click here to find an example of a full observer implementation and configuration.](https://github.com/comunica/examples/tree/master/packages/actor-observe-rdf-dereference)
