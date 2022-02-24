---
title: 'Querying with a custom configuration in a JavaScript app'
description: 'Create a custom configuration of Comunica modules with changed features, and query with it from within your application using the JavaScript API.'
---

In the previous guide, we looked into
[querying with a custom config from the command line](/docs/modify/getting_started/custom_config_cli/).
In this guide, we'll do the same from within a JavaScript application,
but we will **split up our config across different files** for convenience.

<div class="note">
This guide assumes basic knowledge on querying with Comunica.
If you haven't looked into this yet, it is recommended to follow
<a href="/docs/query/getting_started/query_app/">the getting started guide on querying within a JavaScript app</a>.
</div>

## 1. Installation

<div class="note">
This assumes you already have an npm package.
If you don't have one yet, create one using <code>npm init</code>.
You will also need a JavaScript file to write in, such as <code>main.js</code>.
</div>

In order to add Comunica SPARQL as a _dependency_ to your [Node.js](https://nodejs.org/en/) application,
we can execute the following command:
```bash
$ npm install @comunica/query-sparql
```

## 2. Creating a new query engine

While [`QueryEngine` is used to import Comunica SPARQL's default config](/docs/query/getting_started/query_app/),
we can load a custom config by creating our engine via `newEngineDynamic()`:
```javascript
const QueryEngineFactory = require('@comunica/query-sparql').QueryEngineFactory;

const myEngine = await new QueryEngineFactory().create({
    configPath: 'config.json', // Relative or absolute path 
});
```

`configPath` refers to a config file, which we will create in the next step.

## 3. Start from an existing config file

The easiest way to create a custom config, is to start from an existing one, and add/remove things to fit your needs.

Let's create a file called `config.json` in your package.

In this guide, we will start from
the [Comunica SPARQL default config file](https://github.com/comunica/comunica/blob/master/engines/config-query-sparql/config/config-default.json).
Let's **copy it's contents entirely into our `config.json`**:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/^2.0.0/components/context.jsonld"
  ],
  "import": [
    "ccqs:config/context-preprocess/actors.json",
    "ccqs:config/context-preprocess/mediators.json",
    "ccqs:config/hash-bindings/actors.json",
    "ccqs:config/hash-bindings/mediators.json",
    "ccqs:config/http/actors.json",
    "ccqs:config/http/mediators.json",
    "ccqs:config/http-invalidate/actors.json",
    "ccqs:config/http-invalidate/mediators.json",
    "ccqs:config/init/actors.json",
    "ccqs:config/optimize-query-operation/actors.json",
    "ccqs:config/optimize-query-operation/mediators.json",
    "ccqs:config/query-operation/actors.json",
    "ccqs:config/query-operation/mediators.json",
    "ccqs:config/query-parse/actors.json",
    "ccqs:config/query-parse/mediators.json",
    "ccqs:config/query-result-serialize/actors.json",
    "ccqs:config/query-result-serialize/mediators.json",
    "ccqs:config/dereference/actors.json",
    "ccqs:config/dereference/mediators.json",
    "ccqs:config/dereference-rdf/actors.json",
    "ccqs:config/dereference-rdf/mediators.json",
    "ccqs:config/rdf-join/actors.json",
    "ccqs:config/rdf-join/mediators.json",
    "ccqs:config/rdf-join-entries-sort/actors.json",
    "ccqs:config/rdf-join-entries-sort/mediators.json",
    "ccqs:config/rdf-join-selectivity/actors.json",
    "ccqs:config/rdf-join-selectivity/mediators.json",
    "ccqs:config/rdf-metadata/actors.json",
    "ccqs:config/rdf-metadata/mediators.json",
    "ccqs:config/rdf-metadata-extract/actors.json",
    "ccqs:config/rdf-metadata-extract/mediators.json",
    "ccqs:config/rdf-parse/actors.json",
    "ccqs:config/rdf-parse/mediators.json",
    "ccqs:config/rdf-parse-html/actors.json",
    "ccqs:config/rdf-resolve-hypermedia/actors.json",
    "ccqs:config/rdf-resolve-hypermedia/mediators.json",
    "ccqs:config/rdf-resolve-hypermedia-links/actors.json",
    "ccqs:config/rdf-resolve-hypermedia-links/mediators.json",
    "ccqs:config/rdf-resolve-hypermedia-links-queue/actors.json",
    "ccqs:config/rdf-resolve-hypermedia-links-queue/mediators.json",
    "ccqs:config/rdf-resolve-quad-pattern/actors.json",
    "ccqs:config/rdf-resolve-quad-pattern/mediators.json",
    "ccqs:config/rdf-serialize/actors.json",
    "ccqs:config/rdf-serialize/mediators.json",
    "ccqs:config/rdf-update-hypermedia/actors.json",
    "ccqs:config/rdf-update-hypermedia/mediators.json",
    "ccqs:config/rdf-update-quads/actors.json",
    "ccqs:config/rdf-update-quads/mediators.json"
  ]
}
```

## 4. Executing SPARQL SELECT queries

Once your engine has been created based on your custom config,
you can use it to execute any SPARQL query, such as a `SELECT` query:
```javascript
const bindingsStream = await myEngine.queryBindings(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

bindingsStream.on('data', (binding) => {
    console.log(binding.get('s').value);
    console.log(binding.get('p').value);
    console.log(binding.get('o').value);
});
```

If you wrote this in a file called `main.js`, you can invoke it by executing `node main.js`.

<div class="note">
If you run into config loading problems,
make sure your app has a <code>package.json</code> file,
otherwise config loading will fail.
</div>

## 5. Only allowing `SELECT` queries

Our goal in this step is to build a query engine that can **_only_ execute `SELECT`** queries,
and we don't want to be able to execute `CONSTRUCT` and `DESCRIBE` queries.
This will require us to remove some more actors.

While the actors for `CONSTRUCT` and `DESCRIBE` are defined in `ccqs:config/query-operation/actors.json`,
we can not just simply remove that file from our imports,
because it also contains actors for other SPARQL query operators which we don't want to remove, such as `SELECT`.

In the [guide on querying with a custom config from the command line](/docs/modify/getting_started/custom_config_cli/),
we achieved this by inlining `ccqs:config/query-operation/actors.json` into our main config file.
In this guide, we'll do this in a cleaner way by **redefining** the contents of `ccqs:config/query-operation/actors.json`
in a **separate local file**, and applying our changes there.

### 5.1. Declare config options in `package.json`

Before we can refer to other files within our config file,
we have to add some entries to our `package.json` file
so that the config files can be found during engine initialization.

Concretely, we need to **add the following entry to `package.json`**:
```text
{
  ...
  "lsd:module": true
  ...
}
```

<div class="note">
If you want to learn more about what this entry means,
read our guide on <a href="/docs/modify/advanced/componentsjs/">Components.js</a>,
a dependency injection framework that Comunica uses.
</div>

### 5.2. Create a context

In order to allow our config file to import other files,
we need to create a JSON-LD context file.

Create the file **`components/context.jsonld`** with the following contents:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/componentsjs/^4.0.0/components/context.jsonld",
    {
      "npmd": "https://linkedsoftwaredependencies.org/bundles/npm/",
      "my": "npmd:my-package/^2.0.0/"
    }
  ]
}
```

Again, make sure to replace `my-package` with your package `name`.

<div class="note">
To avoid collisions with other packages, it is recommended to use another prefix than <code>"my"</code> in your context.
</div>

### 5.3. Copying `config/query-operation/actors.json`

Next, we will create a local copy of `ccqs:config/query-operation/actors.json`.

For this, create a file **`config/query-operation/actors.json`**,
and paste in the contents of [`ccqs:config/query-operation/actors.json`](https://raw.githubusercontent.com/comunica/comunica/master/engines/config-query-sparql/config/query-operation/actors.json) ([GitHub](https://github.com/comunica/comunica/blob/master/engines/config-query-sparql/config/query-operation/actors.json)).

### 5.4. Make config refer to local `config/query-operation/actors.json`

Now that we have declared config options in our `package.json`,
created a context,
and created a local copy of `config/query-operation/actors.json`,
everything is ready to **modify our `config.json` to refer to our local `config/query-operation/actors.json`**.

For this, remove the following line from `config.json`:
```diff
-  "ccqs:config/query-operation/actors.json",
```
And replace it with the following line:
```diff
+  "my:config/query-operation/actors.json",
```

This change means that Comunica will load its query operators from our local `config/query-operation/actors.json` file,
instead of the default `ccqs:config/query-operation/actors.json` file.

If you run your app again, things should still function like before at this point.

### 5.5. Remove actors

Next, we will remove the actors we don't need.
Concretely, we will remove the following imports to actors:

* `ccqs:config/query-operation/actors/query/construct.json`: Handles `CONSTRUCT` queries.
* `ccqs:config/query-operation/actors/query/describe.json`: Handles `DESCRIBE` queries.

For this, remove the following lines:
```diff
-    "ccqs:config/query-operation/actors/query/construct.json",
-    "ccqs:config/query-operation/actors/query/describe.json",
```

### 5.6. Test changes

After this change, you should now be unable to execute `CONSTRUCT` or `DESCRIBE` queries.
Try this out by executing the following:
```bash
const quadStream = await myEngine.queryQuads(`
  CONSTRUCT WHERE {
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

quadStream.on('data', (quad) => {
    console.log(quad.subject.value);
    console.log(quad.predicate.value);
    console.log(quad.object.value);
    console.log(quad.graph.value);
});
```

Executing a `SELECT` query will still work:
```bash
const bindingsStream = await myEngine.queryBindings(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

bindingsStream.on('data', (binding) => {
    console.log(binding.get('s').value);
    console.log(binding.get('p').value);
    console.log(binding.get('o').value);
});
```

You have now successfully built your own custom Comunica engine that is a bit more lightweight than the default one.
Just like the `CONSTRUCT` and `DESCRIBE` actors,
you can remove any other actors you don't want to make it even more lightweight.

If you want, you can create additional config file parts in `config/`
and refer to them from our main `config.json` with the `my:` prefix.

<div class="note">
If you want to <em>add</em> an actor that is not present in the default Comunica SPARQL config,
have a look at 
<a href="https://github.com/comunica/examples/tree/master/packages/configure-sparql-http-solid">this example on replacing the HTTP actor with a Solid HTTP actor</a>.
</div>
