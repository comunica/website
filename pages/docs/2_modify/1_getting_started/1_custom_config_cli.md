---
title: 'Querying with a custom configuration from the command line'
description: 'Create a custom configuration of Comunica modules with reduced features, and query with it from the command line.'
---

While packages such as [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/engines/query-sparql)
ship with a default configuration that offer specific querying functionality,
it is possible to **override these configurations**,
so that you can modify the internal capabilities of your query engine.

In this guide, we will keep it simple,
and we will just **remove some parts of the config file** to create a more lightweight query engine,
and query it from the command line.
In a next guide, we will look into [querying with a custom config from a JavaScript app](/docs/modify/getting_started/custom_config_app/). 

<div class="note">
This guide assumes basic knowledge on querying with Comunica.
If you haven't looked into this yet, it is recommended to follow
<a href="/docs/query/getting_started/query_cli/">the getting started guide on querying from the command line</a>.
</div>

## 1. Requirements of a config file

Comunica is composed of a **set of _[actors](/docs/modify/advanced/architecture_core/)_**
that execute specific tasks.
For example, all SPARQL query operators (`DISTINCT`, `FILTER`, `ASK`, ...)
have a corresponding actor that implements them in a certain way.

By modifying the Comunica config file,
it is possible to **plug in** different implementations for certain SPARQL query operators,
in case you for example have a more efficient implementation yourself. 

### Main config file

A **Comunica config is written in JSON**, and typically looks something like this:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/^5.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:my",
  "@type": "Runner",
  "import": [
    "ccqs:config/context-preprocess/actors.json",
    "ccqs:config/context-preprocess/mediators.json",
    "ccqs:config/http/actors.json",
    "ccqs:config/http/mediators.json",
    "ccqs:config/init/actors.json",
    "ccqs:config/optimize-query-operation/actors.json",
    "ccqs:config/optimize-query-operation/mediators.json",
    "ccqs:config/query-operation/actors.json",
    "ccqs:config/query-operation/mediators.json"
  ]
}
``` 

Essentially, this config file contains a list of imports to smaller config files,
which are loaded in when Comunica reads this config file.

These imported config files each represent a component on a particular bus.
For example `ccqs:config/query-operation/actors.json` refers to all actors that are registered on the query operation bus,
and `ccqs:config/query-operation/mediators.json` refers to the mediators that are defined over the query operation bus.

<div class="note">
For more details on the config fragmentation and IRI strategy,
please refer to <a href="https://github.com/comunica/comunica/blob/master/engines/config-query-sparql/config/README.md">config directory README.md file on GitHub</a>.
</div>

The `ccqs:` prefix refers to the scope of the `@comunica/config-query-sparql` package,
which means that all paths following it refer to files within this package.

### Imported config file

For example, the imported config file `ccqs:config/query-operation/actors.json` could look something like this:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/^5.0.0/components/context.jsonld"
  ],
  "import": [
    "ccqs:config/query-operation/actors/query/ask.json",
    "ccqs:config/query-operation/actors/query/bgp.json",
    "ccqs:config/query-operation/actors/query/construct.json",
    "ccqs:config/query-operation/actors/query/distinct.json",
    "ccqs:config/query-operation/actors/query/extend.json",
    "ccqs:config/query-operation/actors/query/filter.json",
    "ccqs:config/query-operation/actors/query/from.json",
    "ccqs:config/query-operation/actors/query/group.json",
    "ccqs:config/query-operation/actors/query/join.json",
    "ccqs:config/query-operation/actors/query/leftjoin.json",
    "ccqs:config/query-operation/actors/query/minus.json",
    "ccqs:config/query-operation/actors/query/nop.json",
    "ccqs:config/query-operation/actors/query/orderby.json",
    "ccqs:config/query-operation/actors/query/project.json",
    "ccqs:config/query-operation/actors/query/reduced.json",
    "ccqs:config/query-operation/actors/query/slice.json",
    "ccqs:config/query-operation/actors/query/source.json",
    "ccqs:config/query-operation/actors/query/union.json",
    "ccqs:config/query-operation/actors/query/values.json"
  ]
}
```
_The actual file also imports actors for property paths and update operations._

<div class="note">
Imports from prefixes such as <code>ccqs:</code> allow you to refer to config files from npm packages.
If you want to import a local file for quick testing, you may omit this prefix
to refer to files on the local file system, such as <code>"relative/path/to/actor.json"</code>
</div>

This example config file imports several smaller config files,
where each config file contains a single _[actor](/docs/modify/advanced/architecture_core/)_ that will be loaded into Comunica.

For example, the `ccqs:config/query-operation/actors/query/ask.json` file could look as follows:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^5.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-ask/^5.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:default:Runner",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:query-operation/actors#ask",
      "@type": "ActorQueryOperationAsk",
      "mediatorQueryOperation": { "@id": "urn:comunica:default:query-operation/mediators#main" }
    }
  ]
}
```

Each configured actor fulfills a specific task, e.g.:

* `ActorQueryOperationAsk`: Executes SPARQL `ASK` queries.
* `ActorQueryOperationDistinctIdentity`: Executes the SPARQL `DISTINCT` operator.
* `ActorQueryOperationFilter`: Executes SPARQL `FILTER` expressions.

<div class="note">
While the exact meaning of these config files are not important for this guide,
if you want to learn more about its details,
have a look at the guide on
<a href="/docs/modify/advanced/componentsjs/#creating-configurations-in-json-ld">configuration files</a>.
</div>

## 2. Install Comunica SPARQL

Since we want to override the default config of **Comunica SPARQL**,
we have to make sure its package is installed first:

```bash
$ npm install -g @comunica/query-sparql
```

## 3. Start from an existing config file

The easiest way to create a custom config, is to start from an existing one, and add/remove things to fit your needs.

Let's start by creating a new empty directory,
and create a file called `config.json`.

In this guide, we will start from the default config of Comunica SPARQL,
which is provided by the **config package** [`@comunica/config-query-sparql`](https://github.com/comunica/comunica/tree/master/engines/config-query-sparql/config).
This package contains several versions of this config:
`config-default.json` contains the actors of the first release of the current major version,
and files such as `config-default-v5-4-1.json` also contain the actors that were added in later minor versions.
You should pick the one with the **highest version**.
At the time of writing, this is [`config-default-v5-4-1.json`](https://github.com/comunica/comunica/blob/master/engines/config-query-sparql/config/config-default-v5-4-1.json).

<div class="note">
Only build upon config files from <b>config packages</b>, such as <code>@comunica/config-query-sparql</code>.
Do <b>not</b> import the config files of <b>engine packages</b>,
such as <code>config/config-default.json</code> in <code>@comunica/query-sparql</code>.
Those files are internal to the engine and change in minor releases,
which can break your custom engine after an update.
<a href="/docs/modify/advanced/config_versioning/">Read more about config versioning</a>.
</div>

Let's **copy its contents entirely into our `config.json`**:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/^5.0.0/components/context.jsonld"
  ],
  "import": [
    "ccqs:config/bindings-aggregator-factory/actors-v5-4-1.json",
    "ccqs:config/bindings-aggregator-factory/mediators.json",
    "ccqs:config/context-preprocess/actors.json",
    "ccqs:config/context-preprocess/mediators.json",
    "ccqs:config/expression-evaluator-factory/actors.json",
    "ccqs:config/expression-evaluator-factory/mediators.json",
    "ccqs:config/function-factory/actors.json",
    "ccqs:config/function-factory/mediators.json",
    "ccqs:config/hash-bindings/actors.json",
    "ccqs:config/hash-bindings/mediators.json",
    "ccqs:config/hash-quads/actors.json",
    "ccqs:config/hash-quads/mediators.json",
    "ccqs:config/http/actors-v5-4-1.json",
    "ccqs:config/http/mediators.json",
    "ccqs:config/http-invalidate/actors.json",
    "ccqs:config/http-invalidate/mediators.json",
    "ccqs:config/init/actors-v5-4-1.json",
    "ccqs:config/merge-bindings-context/actors.json",
    "ccqs:config/merge-bindings-context/mediators.json",
    "ccqs:config/optimize-query-operation/actors-v5-4-1.json",
    "ccqs:config/optimize-query-operation/mediators.json",
    "ccqs:config/query-operation/actors-v5-3-0.json",
    "ccqs:config/query-operation/actors/query/union-ordered.json",
    "ccqs:config/query-operation/mediators.json",
    "ccqs:config/query-parse/actors.json",
    "ccqs:config/query-parse/mediators.json",
    "ccqs:config/query-process/actors.json",
    "ccqs:config/query-process/mediators.json",
    "ccqs:config/query-result-serialize/actors.json",
    "ccqs:config/query-result-serialize/mediators.json",
    "ccqs:config/query-serialize/actors.json",
    "ccqs:config/query-serialize/mediators.json",
    "ccqs:config/query-source-dereference-link/actors.json",
    "ccqs:config/query-source-dereference-link/mediators.json",
    "ccqs:config/query-source-identify/actors-v5-4-1.json",
    "ccqs:config/query-source-identify/mediators.json",
    "ccqs:config/query-source-identify-hypermedia/actors-v5-1-0.json",
    "ccqs:config/query-source-identify-hypermedia/mediators.json",
    "ccqs:config/dereference/actors.json",
    "ccqs:config/dereference/mediators.json",
    "ccqs:config/dereference-rdf/actors.json",
    "ccqs:config/dereference-rdf/mediators.json",
    "ccqs:config/rdf-join/actors-v5-4-1.json",
    "ccqs:config/rdf-join/mediators.json",
    "ccqs:config/rdf-join-entries-sort/actors.json",
    "ccqs:config/rdf-join-entries-sort/mediators.json",
    "ccqs:config/rdf-join-selectivity/actors.json",
    "ccqs:config/rdf-join-selectivity/mediators.json",
    "ccqs:config/rdf-metadata/actors.json",
    "ccqs:config/rdf-metadata/mediators.json",
    "ccqs:config/rdf-metadata-accumulate/actors.json",
    "ccqs:config/rdf-metadata-accumulate/mediators.json",
    "ccqs:config/rdf-metadata-extract/actors-v5-3-0.json",
    "ccqs:config/rdf-metadata-extract/mediators.json",
    "ccqs:config/rdf-parse/actors.json",
    "ccqs:config/rdf-parse/mediators.json",
    "ccqs:config/rdf-parse-html/actors.json",
    "ccqs:config/rdf-resolve-hypermedia-links/actors.json",
    "ccqs:config/rdf-resolve-hypermedia-links/mediators.json",
    "ccqs:config/rdf-resolve-hypermedia-links-queue/actors.json",
    "ccqs:config/rdf-resolve-hypermedia-links-queue/mediators.json",
    "ccqs:config/rdf-serialize/actors.json",
    "ccqs:config/rdf-serialize/mediators.json",
    "ccqs:config/rdf-update-hypermedia/actors.json",
    "ccqs:config/rdf-update-hypermedia/mediators.json",
    "ccqs:config/rdf-update-quads/actors.json",
    "ccqs:config/rdf-update-quads/mediators.json",
    "ccqs:config/term-comparator-factory/actors.json",
    "ccqs:config/term-comparator-factory/mediators.json",
    "ccqs:config/warmup/actors.json",
    "ccqs:config/warmup/mediators.json"
  ]
}
```

## 4. Execute with Comunica SPARQL

While we usually use `comunica-sparql` to invoke Comunica SPARQL on the command line,
we can instead call `comunica-dynamic-sparql` with exactly the same arguments
to allow **loading in a custom config file**.

In order to specify a custom config file,
we have to set the path to our config file via the `COMUNICA_CONFIG` environment variable:
```bash
$ export COMUNICA_CONFIG="config.json"
```

If you now execute `comunica-dynamic-sparql`,
it will load in your `config.json` file.

Let's try a simple query to see if this works:
```bash
$ comunica-dynamic-sparql http://fragments.dbpedia.org/2016-04/en \
    "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```

<div class="note">
If you don't define the <code>COMUNICA_CONFIG</code> environment variable,
<code>comunica-dynamic-sparql</code> will fallback to the default Comunica SPARQL config file.
</div>

<div class="note">
<code>comunica-dynamic-sparql</code> has a significant startup delay compared to <code>comunica-sparql</code>,
since it now have to load in, parse, and interpret a config file.
<code>comunica-dynamic-sparql</code> should therefore only be used for simple testing
before you <a href="/docs/modify/getting_started/custom_config_app/">use your query engine in a separate package</a>.
</div>

## 5. Removing RDF serialization actors

As an example, we will **remove all actors that can output results in any RDF format**.
All of these actors are defined in the `ccqs:config/rdf-serialize/actors.json` config file.

Before we make any changes to our config file,
let us inspect the result formats that are currently available:
```bash
$ comunica-dynamic-sparql --listformats
stats
application/sparql-results+json
text/shaclc
text/shaclc-ext
application/ld+json
application/n-quads
application/n-triples
application/trig
text/n3
text/turtle
tree
table
application/sparql-results+xml
text/tab-separated-values
text/csv
simple
application/json
```

The 8 formats from `text/shaclc` to `text/turtle` are RDF serialization formats,
which are mainly used for outputting `CONSTRUCT` query results.

If we want to remove those actors from the config file,
we can remove the following line from our `config.json`:
```diff
-    "ccqs:config/rdf-serialize/actors.json",
```

If we now inspect the available result formats, we get the following:
```bash
$ comunica-dynamic-sparql --listformats
stats
application/sparql-results+json
tree
table
application/sparql-results+xml
text/tab-separated-values
text/csv
simple
application/json
```

As you can see, the 8 RDF serialization formats are not present anymore.
This is because Comunica has not loaded them in because we have removed them from our config file.

## 6. Only allowing `SELECT` queries

Let's take our config modifications a step further,
and let's say our goal is to build a query engine that can **_only_ execute `SELECT`** queries,
and we don't want to be able to execute `CONSTRUCT` and `DESCRIBE` queries.
This will require us to remove some more actors.

While the actor for `CONSTRUCT` is defined in `ccqs:config/query-operation/actors-v5-3-0.json`,
we can not just simply remove that file from our imports,
because it also contains actors for other SPARQL query operators which we don't want to remove, such as `SELECT`.
Instead of _just_ removing `ccqs:config/query-operation/actors-v5-3-0.json`,
we will remove it _and_ copy its contents directly into our config file.

<div class="note">
Just like <code>config-default-v5-4-1.json</code>, <code>query-operation/actors-v5-3-0.json</code> is a versioned config file.
When the actors of a bus change in a minor release, a new versioned file is created for it,
so the file that our config imports keeps the same set of actors.
</div>

### 6.1. Inline an imported config

To do this, first **remove** the following line from our `config.json`:
```text
-    "ccqs:config/query-operation/actors-v5-3-0.json",
```

Next, **copy the `"import"` entries** from [`ccqs:config/query-operation/actors-v5-3-0.json`](https://raw.githubusercontent.com/comunica/comunica/master/engines/config-query-sparql/config/query-operation/actors-v5-3-0.json) ([GitHub](https://github.com/comunica/comunica/blob/master/engines/config-query-sparql/config/query-operation/actors-v5-3-0.json)),
and paste it after the current `"import"` entries in our `config.json`.

Your `config.json` file should have the following structure now:
```text
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/^5.0.0/components/context.jsonld"
  ],
  "import": [
    "ccqs:config/bindings-aggregator-factory/actors-v5-4-1.json",
    "ccqs:config/bindings-aggregator-factory/mediators.json",
    ...
    "ccqs:config/warmup/actors.json",
    "ccqs:config/warmup/mediators.json",

    "ccqs:config/query-operation/actors/query/ask.json",
    "ccqs:config/query-operation/actors/query/bgp.json",
    "ccqs:config/query-operation/actors/query/construct.json",
    ...
    "ccqs:config/query-operation/actors/update/drop.json",
    "ccqs:config/query-operation/actors/update/load.json"
  ]
}

```

<div class="note">
At this point, your config file should still be valid.
Confirm this by executing <code>comunica-dynamic-sparql</code>.
</div>

### 6.2. Remove actors

Next, we will remove the query operation actor we don't need:
`ccqs:config/query-operation/actors/query/construct.json`, which handles `CONSTRUCT` queries.
We don't need to remove a separate actor for `DESCRIBE` queries,
because these are rewritten into `CONSTRUCT` queries before they are executed.

For this, remove the following line:
```diff
-    "ccqs:config/query-operation/actors/query/construct.json",
```

### 6.3. Test changes

After this change, you should now be unable to execute `CONSTRUCT` or `DESCRIBE` queries.
Try this out by executing the following:
```bash
$ comunica-dynamic-sparql http://fragments.dbpedia.org/2016-04/en \
    "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
Query operation processing failed: none of the configured actors were able to handle the operation type construct
...
```

Executing a `SELECT` query will still work:
```bash
$ comunica-dynamic-sparql http://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100"
```

You have now successfully built your own custom Comunica engine that is a bit more lightweight than the default one.
Just like the `CONSTRUCT` actor,
you can remove any other actors you don't want to make it even more lightweight.

<div class="note">
Loading custom configs from the command line is limited to loading from a single custom config file.
If you want to split up your config file over different parts, you have to <a href="/docs/modify/getting_started/custom_config_app/">load it via the JavaScript API</a>.
</div>
