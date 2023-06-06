---
title: 'Core Architecture'
description: 'The low-level software architecture of Comunica for achieving modularity.'
---

This document gives an overview of the core architecture of Comunica,
which gives us the desired **modularity** and **flexibility**.

This core architecture has been implemented in [`@comunica/core`](https://github.com/comunica/comunica/tree/master/packages/core).

On top of this architecture, the more high-level [SPARQL architecture](/docs/modify/advanced/architecture_sparql/) has been defined.

<div class="video">
Watch a <a href="https://youtu.be/ydpdziVNw1k?t=2494">Webinar recording</a> to gain a high-level overview of the core architecture.
</div>

## Core components: Actor, Mediator, and Bus

Comunica's architecture has been designed with flexibility and loose coupling of components as main goals.
For this, Comunica consists of **three types of components**: **actors**, **mediators**, and **buses**.

All logic in Comunica is separated into different **actors** ([`Actor`](https://comunica.github.io/comunica/classes/_comunica_core.Actor.html)),
following the [actor model](https://en.wikipedia.org/wiki/Actor_model).
Each actor independently performs a specific task.
For example, one actor can take implement the SPARQL `UNION` operator,
another actor can parse JSON-LD documents,
and another actor can parse JSON-LD documents _in a different way_.

All actors are subscribed onto task-specific **buses** ([`Bus`](https://comunica.github.io/comunica/classes/_comunica_core.Bus.html)),
following the [publish-subscribe pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern).
For example, a SPARQL query operator bus could contain actors for `UNION`, `SELECT`, `FILTER`, and more.
An RDF parsing bus could contain actors for JSON-LD, RDFa, Turtle, and more.

Since multiple actors can exist for solving a specific task
(for example if we have two actors for parsing JSON-LD documents),
**mediators** ([`Mediator`](https://comunica.github.io/comunica/classes/_comunica_core.Mediator.html)) are used for determining the "best" actor on a bus for executing a certain action,
following the [mediator pattern](https://en.wikipedia.org/wiki/Mediator_pattern).

To ensure loose coupling of components, actors never communicate with each other directly.
Instead, they always communicate via a mediators and buses, as shown in the following figure:

<div class="docs-intro-img">
  <img src="/img/actor-mediator-bus.svg" alt="Actor Mediator Bus Architecture" style="width:100%" \>
</div>

<div class="note">
With <a href="/docs/modify/advanced/observers/">Observers</a>, you can passively observe actions executed by actors on a given bus.
</div>

<div class="note">
Optionally, actors can <a href="/docs/modify/advanced/logging/">log certain events</a>.
</div>

## Run and test phases for selecting an actor

Different mediators can select actors in different ways.
For this, the **mediator** will go through **two phases**:

1. **Test phase**: The action is sent onto the bus to all subscribed actors. The actors return the estimated conditions under which the action could be executed, without actually executing the action.
2. **Run phase**: The action is sent to a single actor for execution, where this actor is chosen by the mediator based on the returned test conditions.

For instance, the following figure shows an example of a mediator that will always pick the fastest actor on the bus as possible.

<div class="docs-intro-img">
  <img src="/img/run-test-phases.svg" alt="Run and test phase" style="width:100%" \>
</div>

Therefore, an actor must at least expose the following methods:
```typescript
export interface Actor {
  test(action: IAction): Promise<IActorTest>;
  run(action: IAction): Promise<IActorOutput>;
}
```

The interfaces `IAction`, `IActorTest`, and `IActorOutput` depend on the bus this actor is subscribed to.

Learn more about the [actors, buses](/docs/modify/advanced/buses/) and [mediators](/docs/modify/advanced/mediators/) that exist in Comunica.

## Wiring of components

All Comunica actors, buses, and mediators are implemented as [separate npm packages](https://github.com/comunica/comunica/tree/master/packages).
In order to _wire_ these different components with each other in a single application,
we make use of the **dependency injection** framework [Components.js](/docs/modify/advanced/componentsjs/).
Components.js allows us to wire components with each other using one or more [configuration files](/docs/modify/advanced/componentsjs/#creating-configurations-in-json-ld).
Plugging in different components therefore do not require any code changes, but simply a config change.

Considering these different types of components,
we make use of the following naming conventions for packages:

* Buses: `@comunica/bus-[name-of-bus-type]`
* Mediators: `@comunica/mediator-[name-of-mediator]`
* Actors: `@comunica/actor-[name-of-bus-type]-[name-of-actor]`
* Mediator types: `@comunica/mediatortype-[name-of-mediator-type]`
