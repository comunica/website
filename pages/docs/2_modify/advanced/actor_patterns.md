---
title: 'Actor Patterns'
description: 'Overview of common design patterns for actors'
---

Below, you can find several actor design patterns that are used within Comunica.

## Wrapper

Actors such as [`@comunica/actor-http-proxy`](https://github.com/comunica/comunica/tree/master/packages/actor-http-proxy)
and [`@comunica/actor-http-memento`](https://github.com/comunica/comunica/tree/master/packages/actor-http-memento)
follow a wrapper-based design.
This means that they wrap around existing functionality in the bus without precisely knowing what that behaviour is.
The actor can then invoke this existing functionality, and optionally modify the input and output.

The wrapper design can be achieved by giving a mediator reference of the same bus that the actor is registered to.
In this case, the proxy actor exists on the HTTP bus, but it also has a reference to an HTTP mediator.
Furthermore, wrapper actors usually need to run before all other actors on the bus,
which can be achieved in the Components.js config using `"beforeActors": { "@id": "urn:comunica:default:http/actors#fetch" }`.

The `run()` method of wrapper usually involves modifying the input action,
annotating the context with a key to avoid the same actor to be re-invoked with infinite recursion,
invoking the mediator, and modifying the output.

An example of the wrapper approach can be found in [`ActorHttpProxy`](https://github.com/comunica/comunica/blob/master/packages/actor-http-proxy/lib/ActorHttpProxy.ts).
