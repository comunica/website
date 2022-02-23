---
title: 'Exposing your custom config as an npm package'
description: 'Wrap your config in an npm package, and expose a CLI tool and a JavaScript API.'
---

In this guide, we will wrap our custom config into a new npm package,
so that we can **expose it as a proper reusable query engine**.
This package will be able to do everything packages such as Comunica SPARQL (`@comunica/query-sparql`) can do.
This means that this package will have a CLI tool, and that it will expose a JavaScript API for use in other packages.

<div class="note">
A fully functional example can be found
<a href="https://github.com/comunica/examples/tree/master/packages/configure-sparql-http-solid">here</a>.
</div>

## 1. Initialize a new package

Initialize a new **empty npm package** as follows:
```bash
$ npm init
```

All init packages have to extend from **Comunica SPARQL**.
As such, add it as a dependency as follows:
```bash
$ npm install @comunica/query-sparql
```

We recommend to also **install TypeScript** as a dev dependency:
```bash
$ npm install -D typescript
```

Add a `tsconfig.json` file with the following contents:
```text
{
  "compileOnSave": true,
  "compilerOptions": {
    "module": "commonjs",
    "lib": [
      "es6",
      "dom"
    ],
    "target": "es2017",
    "noImplicitAny": true,
    "removeComments": false,
    "preserveConstEnums": true,
    "sourceMap": true,
    "inlineSources": true,
    "declaration": true
  },
  "include": [
    "index.ts",
    "lib/**/*",
    "bin/**/*"
  ],
  "exclude": [
    "**/node_modules",
    "**/test/*"
  ]
}
```


<div class="note">
If your custom config also depends on other packages
that are not included in Comunica SPARQL,
you have to install them here as well.
</div>

## 2. Add a config file

### 2.1. Create config file

We assume here that **you already have created a custom config file**.
[Click here to learn how to create one](/docs/modify/getting_started/custom_config_app/) should you not have done this already.

Create a `config/` folder, and add your config file (`config-default.json`) in here.

If you config file includes other config sets, you can include them in this folder as well.
In this case, you also have to make sure to include the context file in `components/context.jsonld`.

The only requirement here is that there is at least a file **`config/config-default.json`**.

### 2.2. Declare config options in `package.json`

<div class="note">
If your config file is decomposed into several files,
you may already have done this step.
</div>

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
If you want to learn more about what this config entry means,
read our guide on <a href="/docs/modify/advanced/componentsjs/">Components.js</a>,
a dependency injection framework that Comunica uses.
</div>

## 3. Compiling the config into JavaScript

In order to make the query engine start as fast as possible,
we will pre-compile our config file into a JavaScript file.

We will configure this in such as way that we can still modify our config file if needed,
and recompile the JavaScript file easily.

For this, add the following **scripts to our `package.json`** file:
```text
{
  ...
  "scripts": {
    ...
    "prepublishOnly": "npm run build",
    "build:engine": "comunica-compile-config config/config-default.json > engine-default.js",
    "build:lib": "tsc",
    "build": "npm run build:lib && npm run build:engine",
    "postinstall": "npm run build"
  },
}
```

Try if your script works correctly by running:
```bash
$ npm run build
```

Afterwards, you should have an `engine-default.js` file in your folder.

## 4. Creating command line tools

In this step, we will create three command line tools:

* `bin/query.js`: The main CLI tool.
* `bin/http.js`: Script for starting a SPARQL endpoint.
* `bin/query-dynamic.js`: A [CLI tool in which you can load a custom config](/docs/modify/getting_started/custom_config_cli/).

Each of these CLI tools are optional, and you only have to create those you want.
For this, **create the following files**:

`bin/query.js`:
```typescript
#!/usr/bin/env node
import {runArgsInProcessStatic} from "@comunica/runner-cli";
runArgsInProcessStatic(require('../engine-default.js'));
```

`bin/http.js`:
```typescript
#!/usr/bin/env node
import {HttpServiceSparqlEndpoint} from "@comunica/query-sparql";
HttpServiceSparqlEndpoint.runArgsInProcess(process.argv.slice(2), process.stdout, process.stderr,
  __dirname + '/../', process.env, __dirname + '/../config/config-default.json', () => process.exit(1));
```

`bin/query-dynamic.js`:
```typescript
#!/usr/bin/env node
import {runArgsInProcess} from "@comunica/runner-cli";
runArgsInProcess(__dirname + '/../', __dirname + '/../config/config-default.json');
```

As a final step, we have to make sure that we expose our CLI tools from the package.
As such, add the following **bin entries to `package.json`**:
```text
{
  ...
  "bin": {
    "my-comunica": "./bin/query.js",
    "my-comunica-http": "./bin/http.js",
    "my-comunica-dynamic": "./bin/query-dynamic.js"
  },
}
```
_You can replace `my-comunica` with any name you want.`

If needed, [custom arguments may be added to CLI tools](/docs/modify/advanced/custom_cli_arguments/).

## 5. Exposing a JavaScript API

In order to use your query engine as a dependency in other packages,
we have to expose its JavaScript API.
We will also immediately make it browser-friendly.

For this, first create a file **`index-browser.ts`**:
```typescript
import {ActorInitSparql} from '@comunica/query-sparql/lib/ActorInitSparql-browser';

/**
 * Create a new comunica engine from the default config.
 * @return {ActorInitSparql} A comunica engine.
 */
export function new QueryEngine(): ActorInitSparql {
  return require('./engine-default.js');
}
```

Next, create a file **`index.ts`**:
```typescript
export {newEngine} from './index-browser';

import {ActorInitSparql} from '@comunica/query-sparql/lib/ActorInitSparql-browser';
import {IQueryOptions, newEngineDynamicArged} from "@comunica/query-sparql/lib/QueryDynamic";

/**
 * Create a new dynamic comunica engine from a given config file.
 * @param {IQueryOptions} options Optional options on how to instantiate the query evaluator.
 * @return {Promise<QueryEngine>} A promise that resolves to a fully wired comunica engine.
 */
export function newEngineDynamic(options?: IQueryOptions): Promise<ActorInitSparql> {
  return newEngineDynamicArged(options || {}, __dirname, __dirname + '/config/config-default.json');
}
```

As a final step,
make sure to expose the following entries in your **`package.json`** file:
```text
{
  ...
  "main": "index.js",
  "browser": {
    "./index.js": "./index-browser.js"
  }
}
```

## 6. Indicating what files should be published

Not all files should be published to npm when releasing the package,
and not all files should be added to git repositories.

For this **create the following files**:

`.npmignore`
```text
```
_`.npmignore` MUST exist and MUST be empty._

`.gitignore`
```text
engine-default.js
node_modules
lib/**/*.js
lib/**/*.js.map
lib/**/*.d.ts
test/**/*.js
test/**/*.js.map
test/**/*.d.ts
bin/**/*.js
bin/**/*.js.map
bin/**/*.d.ts
index.js
index.js.map
index.d.ts
index-browser.js
index-browser.js.map
index-browser.d.ts
```

As a final step, **add following entries to `package.json`**:
```text
{
  ...
  "files": [
    "components",
    "config",
    "bin/**/*.d.ts",
    "bin/**/*.js",
    "index.js",
    "index.d.ts",
    "index-browser.d.ts",
    "index-browser.js",
    "engine-default.js"
  ],
}
```

## 7. Publish to npm

Now, you are ready to [publish your package to npm](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages),
and allow other to use it via the CLI or via the JavaScript API.
