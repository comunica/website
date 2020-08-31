---
title: 'Querying with a custom configuration from the command line'
description: 'Create a custom configuration of Comunica modules with reduced features, and query with it from the command line.'
---

While packages such as [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql)
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
<a href="/docs/query/getting_started/query_cli">the getting started guide on querying from the command line</a>.
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
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-sparql/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^1.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:my",
  "@type": "Runner",
  "import": [
    "files-cais:config/sets/rdf-parsers.json",
    "files-cais:config/sets/sparql-queryoperators.json",
    "files-cais:config/sets/sparql-serializers.json"
  ]
}
``` 

Essentially, this config file contains a list of _config sets_, which are references to _other_ config files,
which are loaded in when Comunica reads this config file.

These config sets contain groups of actors.
For example, `files-cais:config/sets/sparql-queryoperators.json`
contains multiple SPARQL operator actors.

### Imported config file

For example, the imported config file `files-cais:config/sets/sparql-queryoperators.json` could look something like this:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-sparql/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^1.0.0/components/context.jsonld",

    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/bus-query-operation/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-ask/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-distinct-hash/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-filter-sparqlee/^1.0.0/components/context.jsonld",

    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/mediator-number/^1.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:my",
  "actors": [
    {
      "@id": "config-sets:sparql-queryoperators.json#myDistinctQueryOperator",
      "@type": "ActorQueryOperationDistinctHash",
      "cbqo:mediatorQueryOperation": { "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation" }
    },
    {
      "@id": "config-sets:sparql-queryoperators.json#myFilterQueryOperator",
      "@type": "ActorQueryOperationFilterSparqlee",
      "cbqo:mediatorQueryOperation": { "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation" }
    },
    {
      "@id": "config-sets:sparql-queryoperators.json#myAskQueryOperator",
      "@type": "ActorQueryOperationAsk",
      "cbqo:mediatorQueryOperation": { "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation" }
    }
  ]
}
```

This example `files-cais:config/sets/sparql-queryoperators.json` config file contains three _[actors](/docs/modify/advanced/architecture/)_ that will be loaded into Comunica,
which each fulfill a specific task:

* `ActorQueryOperationDistinctHash`: Executes the SPARQL `DISTINCT` operator.
* `ActorQueryOperationFilterSparqlee`: Executes SPARQL `FILTER` expressions.
* `ActorQueryOperationAsk`: Executes SPARQL `ASK` queries.

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
$ npm install -g @comunica/actor-init-sparql
```

## 3. Start from an existing config file

The easiest way to create a custom config, is to start from an existing one, and add/remove things to fit your needs.

Let's start by creating a new empty directory,
and create a file called `config.json`.

In this guide, we will start from
the [Comunica SPARQL default config file](https://github.com/comunica/comunica/blob/master/packages/actor-init-sparql/config/config-default.json).
Let's **copy it's contents entirely into our `config.json`**:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-sparql/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^1.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:my",
  "@type": "Runner",
  "import": [
    "files-cais:config/sets/http.json",
    "files-cais:config/sets/http-memento.json",
    "files-cais:config/sets/join.json",
    "files-cais:config/sets/rdf-dereference.json",
    "files-cais:config/sets/rdf-parsers.json",
    "files-cais:config/sets/rdf-serializers.json",
    "files-cais:config/sets/resolve-federated.json",
    "files-cais:config/sets/resolve-hypermedia.json",
    "files-cais:config/sets/resolve-rdfjs.json",
    "files-cais:config/sets/resolve-sparql.json",
    "files-cais:config/sets/sparql-init.json",
    "files-cais:config/sets/graphql-parsers.json",
    "files-cais:config/sets/sparql-optimize.json",
    "files-cais:config/sets/sparql-parsers.json",
    "files-cais:config/sets/sparql-queryoperators.json",
    "files-cais:config/sets/sparql-queryoperators-path.json",
    "files-cais:config/sets/sparql-serializers.json"
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
All of these actors are defined in the `files-cais:config/sets/rdf-serializers.json` config file.

Before we make any changes to our config file,
let us inspect the result formats that are currently available:
```bash
$ comunica-dynamic-sparql --listformats
application/ld+json
application/trig
application/n-quads
text/turtle
application/n-triples
text/n3
stats
tree
table
application/sparql-results+xml
text/tab-separated-values
application/sparql-results+json
text/csv
simple
application/json
```

The first 6 of those formats are RDF serialization formats,
which are mainly used for outputting `CONSTRUCT` query results.

If we want to remove those actors from the config file,
we can apply remove the following line from our `config.json`:
```text
    "files-cais:config/sets/rdf-serializers.json",
```

If we now inspect the available result formats, we get the following:
```bash
$ comunica-dynamic-sparql --listformats
stats
tree
table
application/sparql-results+xml
text/tab-separated-values
application/sparql-results+json
text/csv
simple
application/json
```

As you can see, the 6 RDF serialization formats are not present anymore.
This is because Comunica has not loaded them in because we have removed them from our config file.

## 6. Only allowing `SELECT` queries

Let's take our config modifications a step further,
and let's say our goal is to build a query engine that can **_only_ execute `SELECT`** queries,
and we don't want to be able to execute `CONSTRUCT` and `DESCRIBE` queries.
This will require us to remove some more actors.

While the actors for `CONSTRUCT` and `DESCRIBE` are defined in `files-cais:config/sets/sparql-queryoperators.json`,
we can not just simply remove that file from our imports,
because it also contains actors for other SPARQL query operators which we don't want to remove, such as `SELECT`.
Instead of _just_ removing `files-cais:config/sets/sparql-queryoperators.json`,
we will remove it _and_ copy its contents directly into our config file.

### 6.1. Inline an imported config

To do this, first **remove** the following line from our `config.json`:
```text
    "files-cais:config/sets/sparql-queryoperators.json",
```

Next, **copy the `"actors"` entry** (including all values) from [`files-cais:config/sets/sparql-queryoperators.json`](https://raw.githubusercontent.com/comunica/comunica/master/packages/actor-init-sparql/config/sets/sparql-queryoperators.json) ([GitHub](https://github.com/comunica/comunica/blob/master/packages/actor-init-sparql/config/sets/sparql-queryoperators.json)),
and paste it after the `"import"` entry in our `config.json`.
Additionally, **copy all the `"@context"` entries** from [`files-cais:config/sets/sparql-queryoperators.json`](https://raw.githubusercontent.com/comunica/comunica/master/packages/actor-init-sparql/config/sets/sparql-queryoperators.json) ([GitHub](https://github.com/comunica/comunica/blob/master/packages/actor-init-sparql/config/sets/sparql-queryoperators.json)),
and overwrite the `"@context"` from our `config.json` with it.

Your `config.json` file should have the following structure now:
```text
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-sparql/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^1.0.0/components/context.jsonld",
	
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/bus-query-operation/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-ask/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-bgp-empty/^1.0.0/components/context.jsonld",
    ...
  ]
  "@id": "urn:comunica:my",
  "@type": "Runner",
  "import": [
    "files-cais:config/sets/http.json",
    "files-cais:config/sets/http-memento.json",
    ...
  ],
  "actors": [
    {
      "@id": "config-sets:sparql-queryoperators.json#myAskQueryOperator",
      "@type": "ActorQueryOperationAsk",
      "cbqo:mediatorQueryOperation": {
        "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation",
        "@type": "MediatorNumberMin",
        "field": "httpRequests",
        "ignoreErrors": true,
        "cc:Mediator/bus": { "@id": "cbqo:Bus/QueryOperation" }
      }
    },

    {
      "@id": "config-sets:sparql-queryoperators.json#myServiceQueryOperator",
      "@type": "ActorQueryOperationService",
      "cbqo:mediatorQueryOperation": { "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation" },
      "caqoserv:Actor/QueryOperation/Service/forceSparqlEndpoint": false
    },

    {
      "@id": "config-sets:sparql-queryoperators.json#mySliceQueryOperator",
      "@type": "ActorQueryOperationSlice",
      "cbqo:mediatorQueryOperation": { "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation" }
    },

    ...
  ]
}
```

<div class="note">
At this point, your config file should still be valid.
Confirm this by executing <code>comunica-dynamic-sparql</code>.
</div>

### 6.2. Remove actors

Next, we will remove the actors we don't need.
Concretely, we will remove the actors of the following types:

* `ActorQueryOperationConstruct`: Handles `CONSTRUCT` queries.
* `ActorQueryOperationDescribeSubject`: Handles `DESCRIBE` queries.

For this, find the actors (in the `"actors"` array),
and remove all actors with `"@type"` set to one of the above.

Concretely, we will remove the following entries:

```text
   {
      "@id": "config-sets:sparql-queryoperators.json#myConstructQueryOperator",
      "@type": "ActorQueryOperationConstruct",
      "cbqo:mediatorQueryOperation": { "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation" }
    },

    {
      "@id": "config-sets:sparql-queryoperators.json#myDescribeQueryOperator",
      "@type": "ActorQueryOperationDescribeSubject",
      "cbqo:mediatorQueryOperation": { "@id": "config-sets:sparql-queryoperators.json#mediatorQueryOperation" }
    },
```

### 6.3. Test changes

After this change, you should now be unable to execute `CONSTRUCT` or `DESCRIBE` queries.
Try this out by executing the following:
```bash
$ comunica-dynamic-sparql http://fragments.dbpedia.org/2016-04/en \
    "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```

Executing a `SELECT` query will still work:
```bash
$ comunica-dynamic-sparql http://fragments.dbpedia.org/2016-04/en \
    "SELECT WHERE { ?s ?p ?o } LIMIT 100"
```

You have now successfully built your own custom Comunica engine that is a bit more lightweight than the default one.
Just like the `CONSTRUCT` and `DESCRIBE` actors,
you can remove any other actors you don't want to make it even more lightweight.

<div class="note">
Loading custom configs from the command line is limited to loading from a single config file.
If you want to split up your config file over different parts, you have to <a href="/modify/getting_started/custom_config_app/">load it via the JavaScript API</a>.
</div>
