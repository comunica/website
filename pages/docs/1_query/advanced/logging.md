---
title: 'Logging'
description: 'Loggers can be set to different logging levels to inspect what Comunica is doing behind the scenes.'
---

If you want to inspect what is going on during query execution,
you can enable a logger in Comunica.

<div class="note">
This guide focuses on configuring logging levels and printing output.
<a href="/docs/modify/advanced/logging/">Click here</a> if you want to learn more about invoking a logger from within an actor implementation.
</div>

## Logging on the command line

Using Comunica SPARQL on the command line, logging can be enabled via the `-l` option.
For example, printing debug-level logs can be done as follows:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100" \
    -l debug
```
```text
[2020-07-31T11:38:47.632Z]  INFO: Requesting https://fragments.dbpedia.org/2016-04/en {
  actor: 'https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-sparql/^1.0.0/config/sets/http.json#myHttpFetcher'
}
[2020-07-31T11:38:47.775Z]  INFO: Identified as qpf source: https://fragments.dbpedia.org/2016-04/en {
  actor: 'https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-sparql/^1.0.0/config/sets/resolve-hypermedia.json#myHypermediaQpfResolver'
}
[2020-07-31T11:38:47.777Z]  INFO: Requesting https://fragments.dbpedia.org/2016-04/en {
  actor: 'https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-sparql/^1.0.0/config/sets/http.json#myHttpFetcher'
}
```

All log messages will be printed to standard error (`stderr`).

If you only want to print the logs, you can void all query results as follows:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100" \
    -l debug > /dev/null
```

If you want to redirect all logs to a file, you can forward them like this:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100" \
    -l debug 2> /path/to/log.txt
```

## Logging levels

The following logging levels are available in Comunica:

* `trace`
* `debug`
* `info`
* `warn`
* `error`
* `fatal`

<div class="note">
When enabling a level, all levels below are also enabled.
For example, when enabling <code>error</code>, then <code>fatal</code> will also be enabled.
</div>

## Logging in an application

Using the `log` [context entry](/docs/query/advanced/context/), you can enable logging in a [JavaScript application that uses Comunica](/docs/query/getting_started/query_app/):
```javascript
import {LoggerPretty} from "@comunica/logger-pretty";

const result = await myEngine.query('SELECT * WHERE { ?s ?p ?o }', {
  sources: ['http://fragments.dbpedia.org/2015/en'],
  log: new LoggerPretty({ level: 'debug' }),
});
```

This logger makes use of `LoggerPretty`, which will print everything to standard error (`stderr`),
just like Comunica SPARQL on the command line.

Alternatively, more advanced logging can be achieved by making use of [`@comunica/logger-bunyan`](https://github.com/comunica/comunica/tree/master/packages/logger-bunyan/),
or by implementing your own logger that implements the [`Logger` interface](https://github.com/comunica/comunica/blob/master/packages/core/lib/Logger.ts).
