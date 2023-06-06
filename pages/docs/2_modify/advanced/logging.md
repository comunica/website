---
title: 'Logging'
description: 'How to log messages from within actors.'
---

Actors can log messages at different levels,
which may be useful for debugging,
or emitting basic information.

<div class="note">
This guide focuses on invoking a logger from within an actor implementation.
<a href="/docs/query/advanced/logging/">Click here</a> if you want to learn more about configuring logging levels and printing output.
</div>

## Logging methods

All actors ([`Actor`](https://comunica.github.io/comunica/classes/_comunica_core.Actor.html)) expose the following methods:

* `logTrace(context, message, dataCb?)`
* `logDebug(context, message, dataCb?)`
* `logInfo(context, message, dataCb?)`
* `logWarn(context, message, dataCb?)`
* `logError(context, message, dataCb?)`
* `logFatal(context, message, dataCb?)`

These methods allow a log message to be emitted at the different [logging levels](/docs/query/advanced/logging/#logging-levels).

These methods require the [context](/docs/query/advanced/context/) to be passed,
and a string message.
Optionally, you can pass a callback to a JSON data hash.

## Example

Emitting a log message in an actor's `run` method can be done as follows:
```typescript
public run(action: IAction): Promise<IActorHttpOutput> {
  this.logInfo(action.context, 'This is a message');
  this.logInfo(action.context, 'This is another message, with data',
    () => ({ someParam: 'someValue' }));
}
```



