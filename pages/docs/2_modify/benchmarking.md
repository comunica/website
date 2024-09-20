---
title: 'Benchmarking'
description: 'Guidelines on running experiments with Comunica.'
---

This page lists guidelines on how to run experiments with Comunica.
This can be useful for researchers that want to evaluate their modification,
or for Comunica core developers that want to check performance.

## Considerations when benchmarking

### Running Node in production mode

If you want to do benchmarking with Comunica in Node.js, make sure to **run Node.js in production** mode as follows:

```bash
NODE_ENV=production node packages/some-package/bin/some-bin.js
```

### Taking into account startup time of the engine

If you want to run experiments, it is important to take into account the **time it takes for the query engine to start**.
When measuring execution time, one should _only_ measure the actual time it takes for the engine to execute the query,
excluding the query engine's startup time.

As such, simply measuring the execution time via the command line is not advised.
Instead, one should either make use of a [SPARQL endpoint](/docs/query/getting_started/setup_endpoint/),
the `stats` writer on the command line,
or measure query execution via JavaScript.

### Warming up the JavaScript engine

Since most modern JavaScript engines (such as the V8 engine used by Node.js) are based on Just In Time (JIT) compilation,
they take some time to compile and to learn about the application's structure to apply optimizations.
As such, it is important to warm up your query engine before doing measurements over it,
unless you specifically want to measure the cold-start performance.
The **recommended way to do this is to set up [a Comunica SPARQL endpoint](/docs/query/getting_started/setup_endpoint/)**,
do some warmup queries over it, and only then execute the actual benchmark.

Engines such as V8 tend to each an optimal state rather quickly,
so not too many warmup rounds are required for execution time to stabilize.
The number of warmup rounds can depend on your engine's version, machine, and query set.

## Simple benchmarking using the stats writer

The easiest way to do simple benchmarking is to make use of the `-t stats` [result format](/docs/query/advanced/result_formats/).

```bash
$ NODE_ENV=production \
    comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100" \
    -t stats
```

This will output CSV in the form of:
```csv
Result,Delay (ms),HTTP requests
1,136.638436,2
2,137.211264,2
3,137.385467,2
...
98,151.781901,2
99,151.838555,2
100,151.898222,2
TOTAL,152.175256,2
```

This tells us:

* The number of query results
* The cumulative time for each result to be emitted
* The cumulative number of HTTP requests required up until each result

## Simple benchmarking in JavaScript

When [creating a Comunica query engine from a JavaScript application](/docs/query/getting_started/query_app/),
measuring a query's execution time can be done as follows:
```javascript
// Start a timer
console.time("myTimer");

const bindingsStream = await myEngine.queryBindings(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

bindingsStream.on('data', (binding) => {
    // Optionally do some logging
});
bindingsStream.on('end', () => {
    // End the timer
    console.timeEnd("myTimer");
});
```

Measuring execution time from JavaScript gives you more flexibility compared to the command line.

Examples for more advanced benchmarking in JavaScript can be found in the [examples repo](https://github.com/comunica/examples/).

## Reproducible benchmarking via JBR

[JBR](https://github.com/rubensworks/jbr.js)
is a JavaScript-based benchmarking framework
for easily creating and running various benchmarks with engines such as Comunica and [LDF Server](https://github.com/LinkedDataFragments/Server.js).
It is useful if you want to compare different configurations of Comunica or other engines with each other.

Together with the (semantic) configuration files of Comunica and LDF Server,
this tool completes the whole provenance chain of experimental results:

* **Setup** of sofware based on configuration
* **Generating** experiment input data
* **Execution** of experiments based on parameters
* Description of environment **dependencies** during experiments
* **Reporting** of results
* **Archiving** results into a single file for easy exchange
