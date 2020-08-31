---
title: 'Components.js'
description: 'Components.js is the dependency injection framework that Comunica uses to wire components via config files.'
---

A direct consequence of the high modularity of Comunica is that it leads to
a high number of **modules that need to be wired together** before they can be used.

Comunica makes use of the **dependency injection framework [Components.js](https://componentsjs.readthedocs.io/en/latest/)**
to take care of this wiring of modules.
In essence, Components.js allows you to create [JSON-LD](https://json-ld.org/) configuration files
in which you _declaratively_ define which components you want to instantiate using what parameters.
Components.js can then _read_ these configuration files, and instantiate them as runtime JavaScript objects.

While there is [detailed documentation available for Components.js](https://componentsjs.readthedocs.io/en/latest/),
we summarize the most important parts for Comunica on this page.

<div class="note">
Before you get into the details of Components.js,
we recommend you first follow <a href="/docs/modify/getting_started/">guides on getting started with modifying Comunica</a>.
</div>

## Terminology

Before you continue reading this guide,
it is important to understand the three following concepts:

* **Module:** A collection of **components**. _For example, an npm package._
* **Component:** Something that can be instantiated. _For example, a JavaScript/TypeScript class._
* **Instance:** An instantiated **component**. _For example, a JavaScript/TypeScript class instance._

For example, the npm package `@comunica/actor-query-operation-distinct-hash` is a **module**
that exposes a single **component** `ActorQueryOperationDistinctHash`,
which implements the SPARQL `DISTINCT` operator.
During dependency injection, any number of **instances** of the component `ActorQueryOperationDistinctHash`
can be created, possibly with different parameters values.

## Describing modules in JSON-LD

A module and their components are described in JSON-LD,
and they **describe how components can be instantiated**.
Components are typically defined in a `components/` folder with the following structure: 

`components/components.jsonld`: (_root components file_)
```json
{
  "@context": "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-distinct-hash/^1.0.0/components/context.jsonld",
  "@id": "npmd:@comunica/actor-query-operation-distinct-hash",
  "@type": "Module",
  "requireName": "@comunica/actor-query-operation-distinct-hash",
  "import": [
    "files:components/Actor/QueryOperation/DistinctHash.jsonld"
  ]
}
```

`components/Actor/QueryOperation/DistinctHash.jsonld`:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-distinct-hash/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-abstract-bindings-hash/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/bus-query-operation/^1.0.0/components/context.jsonld"
  ],
  "@id": "npmd:@comunica/actor-query-operation-distinct-hash",
  "components": [
    {
      "@id": "caqodh:Actor/QueryOperation/DistinctHash",
      "requireElement": "ActorQueryOperationDistinctHash",
      "parameters": [
        {
          "@id":     "caqodh:Actor/QueryOperation/DistinctHash#hashAlgorithm",
          "default": "sha1"
        },
        {
          "@id":     "caqodh:Actor/QueryOperation/DistinctHash#digestAlgorithm",
          "default": "base64"
        }
      ]
    }
  ]
}
```

The `import` key allows components to be defined across different files,
where its values internally translate into a local file path.
For example, `"files:components/Actor/QueryOperation/DistinctHash.jsonld"`
corresponds to the local file `components/Actor/QueryOperation/DistinctHash.jsonld`.

The prefix `files:` is used to make it interpretable as a URL in JSON-LD.
This makes all modules and components _semantic_ and fully dereferenceable.
For example, `"files:components/Actor/QueryOperation/DistinctHash.jsonld"`
expands to the URL https://linkedsoftwaredependencies.org/bundles/npm/%40comunica%2Factor-query-operation-distinct-hash/^1.0.0/components/Actor/QueryOperation/DistinctHash.jsonld.

<div class="note">
<a href="https://linkedsoftwaredependencies.org/">Linked Software Dependencies</a> is a service
that exposes all npm packages as JSON-LD,
which forms a key element in Components.js.
</div>

Learn more in the Components.js documentation on [modules](https://componentsjs.readthedocs.io/en/latest/configuration/modules/)
and [components](https://componentsjs.readthedocs.io/en/latest/configuration/components/general/).

## Context files

Our components and config files always make use of URLs as identifiers for things (`@id` in JSON-LD).
Since URLs sometimes can become long, we make use of _JSON-LD context files_
to **define shortcuts and prefixes for some URLs**.

For example, the context for our distinct actor(defined in `components/context.jsonld`) could look as follows:
```json
{
  "@context": [
    {
      "npmd": "https://linkedsoftwaredependencies.org/bundles/npm/",
      "caqodh": "npmd:@comunica/actor-query-operation-distinct-hash/",
      "ActorQueryOperationDistinctHash": "caqodh:Actor/QueryOperation/DistinctHash",
      "hashAlgorithm": "caqodh:Actor/QueryOperation/DistinctHash#hashAlgorithm",
      "digestAlgorithm": "caqodh:Actor/QueryOperation/DistinctHash#digestAlgorithm"
    }
  ]
}
```

If you want to use these prefixes in any other file,
the full URL of this context has to be used in `"@context"`.
This URL will always be in the form of `"https://linkedsoftwaredependencies.org/bundles/npm/<my-package>/^1.0.0/components/context.jsonld"`.

## Creating configurations in JSON-LD

Configuration files are used to **instantiate components**.
While modules and components are defined in the `components/` folder,
we typically create our config files in `config/`.
We also define these as JSON-LD files, with pointers to our components files.

The instantiation of a Comunica engine could look like this:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-sparql/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-distinct-hash/^1.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-construct/^1.0.0/components/context.jsonld"  
  ],
  "@id": "urn:comunica:my",
  "@type": "Runner",
  "actors": [
    {
      "@id":           "myInitActor",
      "@type":         "ActorInitSparql"
    },
    {
      "@id":           "#myDistinctQueryOperator",
      "@type":         "ActorQueryOperationDistinctHash",
      "hashAlgorithm": "RSA-SHA256"
    },
    {
      "@id":           "#myConstructQueryOperator",
      "@type":         "ActorQueryOperationConstruct"
    }
  ]
}
```

Learn more in the full Components.js documentation on [configs](https://componentsjs.readthedocs.io/en/latest/configuration/configurations/semantic/).

## Package.json contents

If you want to expose components or use modular configs in your npm package,
**Components.js must know where to find the required files (components, contexts, configs) in your npm package**.

Therefore, it is required to add the following entries to your `package.json` file:
```text
{
  ...
  "lsd:module": "https://linkedsoftwaredependencies.org/bundles/npm/my-package",
  "lsd:components": "components/components.jsonld",
  "lsd:contexts": {
    "https://linkedsoftwaredependencies.org/bundles/npm/my-package/^1.0.0/components/context.jsonld": "components/context.jsonld"
  },
  "lsd:importPaths": {
    "https://linkedsoftwaredependencies.org/bundles/npm/my-package/^1.0.0/components/": "components/",
    "https://linkedsoftwaredependencies.org/bundles/npm/my-package/^1.0.0/config/": "config/"
  }
  ...
}
```

_On each line, make sure to replace `my-package` with your package `name`._

These entries have the following meaning:

* `lsd:module`: The URL that corresponds to your npm package. This will mostly be `https://linkedsoftwaredependencies.org/bundles/npm/` appended by your package name.
* `lsd:components`: Local path to your root components file. This will mostly be `components/components.jsonld`.
* `lsd:contexts`: The mapping of context URLs to local context files. This will typically contain only one entry for `components/context.jsonld`, but can be empty. This is used by Components.js when looking up contexts to first look in the local file system, to avoid expensive HTTS(S) lookups if the file already exists locally.
* `lsd:importPaths`: The mapping of component and config files to local files. This will typically contain entries for `components/` and `config/`. This is used by Components.js when looking up components or config imports to first look in the local file system, to avoid expensive HTTS(S) lookups if the file already exists locally.

Learn more in the full Components.js documentation on [exposing components](https://componentsjs.readthedocs.io/en/latest/getting_started/basics/exposing_components/).
