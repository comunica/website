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

For example, the npm package `@comunica/actor-query-operation-reduced-hash` is a **module**
that exposes a single **component** `ActorQueryOperationReducedHash`,
which implements the SPARQL `REDUCED` operator.
During dependency injection, any number of **instances** of the component `ActorQueryOperationReducedHash`
can be created, possibly with different parameters values.

## Describing modules in JSON-LD

The `components/` directory of each package contains JSON-LD representations of the module and its components,
which **describe how components can be instantiated**.
As of Comunica version 2.x, the contents of this directory are automatically generated
using [Components-Generator.js](https://github.com/LinkedSoftwareDependencies/Components-Generator.js/),
which is invoked when running `yarn run build`.

While **these files should never be created or modified manually**,
some examples below are shown to explain their most important parts.

`components/components.jsonld`: (_root components file_)
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-reduced-hash/^3.0.0/components/context.jsonld"
  ],
  "@id": "npmd:@comunica/actor-query-operation-reduced-hash",
  "@type": "Module",
  "requireName": "@comunica/actor-query-operation-reduced-hash",
  "import": [
    "caqorh:components/ActorQueryOperationReducedHash.jsonld"
  ]
}
```

`components/ActorQueryOperationReducedHash.jsonld` (simplified):
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-reduced-hash/^3.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/core/^3.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/bus-query-operation/^3.0.0/components/context.jsonld"
  ],
  "@id": "npmd:@comunica/actor-query-operation-reduced-hash",
  "components": [
    {
      "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash",
      "@type": "Class",
      "requireElement": "ActorQueryOperationReducedHash",
      "extends": "cbqo:components/ActorQueryOperationTypedMediated.jsonld#ActorQueryOperationTypedMediated",
      "comment": "A comunica Reduced Hash Query Operation Actor.",
      "parameters": [
        {
          "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash_args_cacheSize",
          "range": "xsd:integer",
          "default": "100"
        },
        {
          "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash_args_mediatorQueryOperation",
          "range": "cc:components/Mediator.jsonld#Mediator"
        }
      ],
      "constructorArguments": [
        {
          "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash_args__constructorArgument",
          "fields": [
            {
              "keyRaw": "cacheSize",
              "value": {
                "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash_args_cacheSize"
              }
            },
            {
              "keyRaw": "mediatorQueryOperation",
              "value": {
                "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash_args_mediatorQueryOperation"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

The `import` key allows components to be defined across different files,
where its values internally translate into a local file path.
For example, `"caqorh:components/ActorQueryOperationReducedHash.jsonld"`
corresponds to the local file `components/ActorQueryOperationReducedHash.jsonld`.

The prefix `caqorh:` identifies the scope of this package.
Internally, this gives all files a unique URL
that makes all modules and components _semantic_ and fully dereferenceable.
For example, `"caqorh:components/ActorQueryOperationReducedHash.jsonld"`
expands to the URL https://linkedsoftwaredependencies.org/bundles/npm/%40comunica%2Factor-query-operation-reduced-hash/^3.0.0/components/ActorQueryOperationReducedHash.jsonld.

<div class="note">
<a href="https://linkedsoftwaredependencies.org/">Linked Software Dependencies</a> is a service
that exposes all npm packages as JSON-LD,
which forms a key element in Components.js.
</div>

Learn more in the Components.js documentation on [modules](https://componentsjs.readthedocs.io/en/latest/configuration/modules/)
and [components](https://componentsjs.readthedocs.io/en/latest/configuration/components/general/).

## Context files

The so-called context is another file in the `components/` directory that will be automatically generated using
[Components-Generator.js](https://github.com/LinkedSoftwareDependencies/Components-Generator.js/)
when invoking `yarn run build`.

This context is needed because
our components and config files always make use of URLs as identifiers for things (`@id` in JSON-LD).
Since URLs sometimes can become long, we make use of _JSON-LD context files_
to **define shortcuts and prefixes for some URLs**.

For example, the context for our reduced actor (defined in `components/context.jsonld`) could look as follows (simplified):
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/componentsjs/^5.0.0/components/context.jsonld",
    {
      "npmd": "https://linkedsoftwaredependencies.org/bundles/npm/",
      "caqorh": "npmd:@comunica/actor-query-operation-reduced-hash/^2.0.0/",
      "ActorQueryOperationReducedHash": {
        "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash",
        "@prefix": true,
        "@context": {
          "cacheSize": {
            "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash_args_cacheSize"
          },
          "mediatorQueryOperation": {
            "@id": "caqorh:components/ActorQueryOperationReducedHash.jsonld#ActorQueryOperationReducedHash_args_mediatorQueryOperation"
          }
        }
      }
    }
  ]
}
```

The relevant entries in this file that become reusable are `caqorh`, `ActorQueryOperationReducedHash`, `cacheSize`, and `mediatorQueryOperation`.
Do note that `cacheSize` and `mediatorQueryOperation` will _only_ be usable within instances of `ActorQueryOperationReducedHash`, i.e., when instantiating `ActorQueryOperationReducedHash` via `"@type"`.

If you want to use these prefixes in any other file,
the full URL of this context has to be used in `"@context"`.
This URL will always be in the form of `"https://linkedsoftwaredependencies.org/bundles/npm/<my-package>/^<major-version-of-my-package>.0.0/components/context.jsonld"`.

## Creating configurations in JSON-LD

Configuration files are used to **instantiate components**.
While modules and components are defined in the `components/` folder,
we typically create our config files in `config/`.
We also define these as JSON-LD files, with pointers to our components files.

The instantiation of a Comunica engine could look like this:
```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^3.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-init-query/^3.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-reduced-hash/^3.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-construct/^3.0.0/components/context.jsonld"  
  ],
  "@id": "urn:comunica:my",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:init/actors#query",
      "@type": "ActorInitQuery"
    },
    {
      "@id": "urn:comunica:default:query-operation/actors#reduced",
      "@type": "ActorQueryOperationReducedHash",
      "mediatorQueryOperation": { "@id": "urn:comunica:default:query-operation/mediators#main" },
      "mediatorHashBindings": { "@id": "urn:comunica:default:hash-bindings/mediators#main" }
    },
    {
      "@id": "urn:comunica:default:query-operation/actors#construct",
      "@type": "ActorQueryOperationConstruct",
      "mediatorQueryOperation": { "@id": "urn:comunica:default:query-operation/mediators#main" }
    }
  ]
}
```

Learn more in the full Components.js documentation on [configs](https://componentsjs.readthedocs.io/en/latest/configuration/configurations/semantic/).

## Package.json contents

If you want to expose components or use modular configs in your npm package,
**you must enable a flag in your `package.json` file so that Components.js can find your npm package**:
```text
{
  ...
  "lsd:module": true
  ...
}
```

Learn more in the full Components.js documentation on [exposing components](https://componentsjs.readthedocs.io/en/latest/getting_started/basics/exposing_components/).

### More control over Components.js configuration (optional)

While this is optional,
you can configure yourself where Components.js can find required files (components, contexts, configs) in your npm package**.

For this, you can add the following entries to your `package.json` file:
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
* `lsd:contexts`: The mapping of context URLs to local context files. This will typically contain only one entry for `components/context.jsonld`, but can be empty. This is used by Components.js when looking up contexts to first look in the local file system, to avoid expensive HTTP(S) lookups if the file already exists locally.
* `lsd:importPaths`: The mapping of component and config files to local files. This will typically contain entries for `components/` and `config/`. This is used by Components.js when looking up components or config imports to first look in the local file system, to avoid expensive HTTP(S) lookups if the file already exists locally.
