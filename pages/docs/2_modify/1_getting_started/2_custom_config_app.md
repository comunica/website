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
$ npm install @comunica/actor-init-sparql
```

## 2. Creating a new query engine

While [`newEngine()` is used to import Comunica SPARQL's default config](/docs/query/getting_started/query_app/),
we can load a custom config by creating our engine via `newEngineDynamic()`:
```javascript
const newEngineDynamic = require('@comunica/actor-init-sparql').newEngineDynamic;

const myEngine = await newEngineDynamic({
  configResourceUrl: 'config.json', // Relative or absolute path 
});
```

`configResourceUrl` refers to a config file, which we will create in the next step.

## 3. Start from an existing config file

The easiest way to create a custom config, is to start from an existing one, and add/remove things to fit your needs.

Let's create a file called `config.json` in your package.

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

## 4. Executing SPARQL SELECT queries

Once your engine has been created based on your custom config,
you can use it to execute any SPARQL query, such as a `SELECT` query:
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

result.bindingsStream.on('data', (binding) => {
    console.log(binding.get('?s').value);
    console.log(binding.get('?p').value);
    console.log(binding.get('?o').value);
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

While the actors for `CONSTRUCT` and `DESCRIBE` are defined in `files-cais:config/sets/sparql-queryoperators.json`,
we can not just simply remove that file from our imports,
because it also contains actors for other SPARQL query operators which we don't want to remove, such as `SELECT`.

In the [guide on querying with a custom config from the command line](/docs/modify/getting_started/custom_config_cli/),
we achieved this by inlining `files-cais:config/sets/sparql-queryoperators.json` into our main config file.
In this guide, we'll do this in a cleaner way by **redefining** the contents of `files-cais:config/sets/sparql-queryoperators.json`
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
If you want to learn more about what this config entry mean,
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
    "https://linkedsoftwaredependencies.org/bundles/npm/componentsjs/^3.0.0/components/context.jsonld",
    {
      "files-ex": "https://linkedsoftwaredependencies.org/bundles/npm/my-package/^1.0.0/"
    }
  ]
}
```

Again, make sure to replace `my-package` with your package `name`.

### 5.3. Copying `sparql-queryoperators.json`

Next, we will create a local copy of `files-cais:config/sets/sparql-queryoperators.json`.

For this, create a file **`config/sets/sparql-queryoperators.json`**,
and paste in the contents of [`files-cais:config/sets/sparql-queryoperators.json`](https://raw.githubusercontent.com/comunica/comunica/master/packages/actor-init-sparql/config/sets/sparql-queryoperators.json) ([GitHub](https://github.com/comunica/comunica/blob/master/packages/actor-init-sparql/config/sets/sparql-queryoperators.json)).

### 5.4. Make config refer to local `sparql-queryoperators.json`

Now that we have declared config options in our `package.json`,
created a context,
and created a local copy of `sparql-queryoperators.json`,
everything is ready to **modify our `config.json` to refer to our local `sparql-queryoperators.json`**.

For this, remove the following line from `config.json`:
```text
  "files-cais:config/sets/sparql-queryoperators.json",
```
And replace it with the following line:
```text
  "files-ex:config/sets/sparql-queryoperators.json",
```

This change means that Comunica will load its query operators from our local `config/sets/sparql-queryoperators.json` file,
instead of the default `files-cais:config/sets/sparql-queryoperators.json` file.

If you run your app again, things should still function like before at this point.

### 5.5. Remove actors

Next, we will remove the actors we don't need.
Concretely, we will **remove the actors of the following types**:

* `ActorQueryOperationConstruct`: Handles `CONSTRUCT` queries.
* `ActorQueryOperationDescribeSubject`: Handles `DESCRIBE` queries.

For this, find the actors (in the `"actors"` array),
and remove all actors with `"@type"` set to one of the above.

Concretely, we will remove the following entries from `config/sets/sparql-queryoperators.json`:

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

### 5.6. Test changes

After this change, you should now be unable to execute `CONSTRUCT` or `DESCRIBE` queries.
Try this out by executing the following:
```bash
const result = await myEngine.query(`
  CONSTRUCT WHERE {
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

result.quadStream.on('data', (quad) => {
    console.log(quad.subject.value);
    console.log(quad.predicate.value);
    console.log(quad.object.value);
    console.log(quad.graph.value);
});
```

Executing a `SELECT` query will still work:
```bash
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

result.bindingsStream.on('data', (binding) => {
    console.log(binding.get('?s').value);
    console.log(binding.get('?p').value);
    console.log(binding.get('?o').value);
});
```

You have now successfully built your own custom Comunica engine that is a bit more lightweight than the default one.
Just like the `CONSTRUCT` and `DESCRIBE` actors,
you can remove any other actors you don't want to make it even more lightweight.

If you want, you can create additional config file parts in `config/sets/`
and refer to them from our main `config.json` with the `files-ex:` prefix.

<div class="note">
If you want to <em>add</em> an actor that is not present in the default Comunica SPARQL config,
have a look at 
<a href="https://github.com/comunica/examples/tree/master/packages/configure-sparql-http-solid">this example on replacing the HTTP actor with a Solid HTTP actor</a>.
</div>
