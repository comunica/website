---
title: 'Config versioning'
description: 'How to extend and manage config files.'
---

Custom Comunica engines are created by writing a config file from scratch, or by building upon existing config files provided by Comunica.
Not all of these files are meant to be built upon, and choosing the wrong ones is the most common reason
why a custom engine **breaks after a minor Comunica update**.

In short:

* **Do** build upon config files from a **config package**, such as [`@comunica/config-query-sparql`](https://github.com/comunica/comunica/tree/master/engines/config-query-sparql) (prefix `ccqs:`).
* **Do** start from the **versioned config file with the highest version**, such as `ccqs:config/config-default-v5-4-1.json`.
* **Don't** import the config files of **engine packages**, such as `config/config-default.json` in `@comunica/query-sparql`.

## Config packages versus engine packages

Comunica publishes two kinds of packages that contain config files:

|                                       | Config packages                                                        | Engine packages                                                                                    |
|---------------------------------------|------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Examples                              | `@comunica/config-query-sparql`, `@comunica/config-expressions-sparql` | `@comunica/query-sparql`, `@comunica/query-sparql-file`, `@comunica/query-sparql-rdfjs`, ...       |
| Meant for                             | Building your own engine                                               | Using a ready-made engine                                                                          |
| Can your config import its files?     | Yes                                                                    | No                                                                                                 |
| Do its files change in minor updates? | No actors are added to an existing file                                | Yes, they are changed whenever the engine gets new actors                                          |

The config file of an engine package usually consists of a single import of a versioned config file from a config package.
For example, `config/config-default.json` in `@comunica/query-sparql` 5.5.0 looks as follows:

```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/^5.0.0/components/context.jsonld"
  ],
  "import": [
    "ccqs:config/config-default-v5-4-1.json"
  ]
}
```

Whenever a minor release adds actors to the engine, this import is pointed to a newer versioned file.
For example, `@comunica/query-sparql` 5.4.1 imported `ccqs:config/config-default-v5-3-0.json`,
and 5.5.0 changed this to `ccqs:config/config-default-v5-4-1.json`, which adds 11 actors and a new bus.

If your config imports an engine package's config file,
your engine silently receives such changes as soon as your dependencies are updated within the same major version.
These new actors were not taken into account in your config, so they can conflict with the actors you added, removed, or overrode.
This can lead to errors when the engine is instantiated or compiled, or to changed behaviour without any error.

## Versioned config files

Within a major version, Comunica does not add actors to existing config files in its config packages.
Adding an actor to a config file requires the package of that actor to be installed,
so adding one in a minor or patch update would break packages that import that file but do not depend on the new actor yet.

Instead, when actors are added, copies of the affected config files are created with a version suffix,
together with copies of the entry config files that import them.
This is why `@comunica/config-query-sparql` contains files such as:

```text
config/config-default.json
config/config-default-v5-1-3.json
config/config-default-v5-3-0.json
config/config-default-v5-4-1.json
```

Here, `config-default.json` is the baseline of the current major version (5.0.0),
and `config-default-v5-4-1.json` has the highest version at the time of writing.

The same holds for the other entry configs (`config-file`, `config-file-browser`, `config-rdfjs`, and `config-rdfjs-lite`),
and for the bus-level files that they import, such as `ccqs:config/rdf-join/actors-v5-4-1.json`.

Once published, a versioned config file keeps the same set of actors for the remainder of the major version.
Later releases can still fix parameter values inside it.
In the next major version, all versioned files are removed, and the unversioned files become the new baseline.

<div class="note">
The version in a file name is the Comunica version during which the file was <em>created</em>,
which is not necessarily the release that first published it.
For example, <code>config-default-v5-4-1.json</code> was first published in version 5.5.0 of <code>@comunica/config-query-sparql</code>.
So always check which files exist in the version of the config package that you have installed.
</div>

## Choosing a config file to build upon

1. Pick the entry config that matches the kind of engine you want to build upon:
    * `config-default`: [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/engines/query-sparql)
    * `config-file`: [Comunica SPARQL File](https://github.com/comunica/comunica/tree/master/engines/query-sparql-file)
    * `config-file-browser`: the browser variant of Comunica SPARQL File
    * `config-rdfjs`: [Comunica SPARQL RDF/JS](https://github.com/comunica/comunica/tree/master/engines/query-sparql-rdfjs)
    * `config-rdfjs-lite`: [Comunica SPARQL RDF/JS Lite](https://github.com/comunica/comunica/tree/master/engines/query-sparql-rdfjs-lite)
2. Take the variant of this file with the highest version suffix that exists in `node_modules/@comunica/config-query-sparql/config/`.
   This is the variant that the corresponding engine package uses.
   You can confirm this by _looking at_ (not importing) the engine package's config file, such as `node_modules/@comunica/query-sparql/config/config-default.json`.
3. Either import that file, or copy its contents into your own config file and change them.

For example, the following config results in an engine with the same actors as Comunica SPARQL 5.5.0,
to which you can add imports of your own config files:

```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/^5.0.0/components/context.jsonld"
  ],
  "import": [
    "ccqs:config/config-default-v5-4-1.json"
  ]
}
```

Don't do this instead, even though it may seem to give the same result today:

```text
  "import": [
    "node_modules/@comunica/query-sparql/config/config-default.json"
  ]
```

If you want to remove or replace actors, copy the imports of the versioned file into your own config file,
as explained in the guide on [querying with a custom configuration](/docs/modify/getting_started/custom_config_cli/).

## Dependencies

Your package must be able to load the packages of all actors in your config:

* **Depend on the config package directly**, with a minimum version that contains the versioned file you build upon.
  For example, `"@comunica/config-query-sparql": "^5.5.0"` when using `config-default-v5-4-1.json`.
* **Depend on the packages of all actors** in your config.
  The [Comunica Packager](https://github.com/comunica/comunica/tree/master/packages/packager) determines these from your config file,
  as explained in the guide on [exposing your custom config as an npm package](/docs/modify/getting_started/custom_init/).

Don't rely on an engine package such as `@comunica/query-sparql` to provide the packages of your actors.
Its dependencies follow its own config, so a later version may no longer depend on an actor that your config still uses.

## Upgrading to a newer versioned config

Since your config refers to a file that does not get new actors,
updating Comunica within the same major version will not change the set of actors in your engine.
If you want to use actors that were added in a newer Comunica release, you upgrade explicitly:

1. Update your Comunica dependencies.
2. Change your import to the newer versioned file, such as from `config-default-v5-3-0.json` to `config-default-v5-4-1.json`.
   If you copied the contents of a versioned file, compare the old and new versioned files, and apply the differences to your own copy.
3. Rebuild and test your engine.

When a new **major** version of Comunica is released, the versioned files are removed,
so your config must then be updated, following the migration notes in the [release blog post](/blog/).

## Fixing an engine that broke after a minor update

If your engine broke after a minor or patch update of Comunica,
check whether your config imports a config file from an engine package.
If so, replace it by the versioned config file that this engine package used in the last version that worked for you.

For example, if your engine imported `config/config-default.json` from `@comunica/query-sparql`,
and it last worked with version 5.4.1,
then [that file in version 5.4.1](https://github.com/comunica/comunica/blob/v5.4.1/engines/query-sparql/config/config-default.json)
shows that you should import `ccqs:config/config-default-v5-3-0.json` instead.
Afterwards, you can [upgrade to a newer versioned config](#upgrading-to-a-newer-versioned-config) when you are ready to.
