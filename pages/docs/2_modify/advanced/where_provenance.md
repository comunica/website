---
title: 'Source attribution'
description: 'Comunica can annotate query result bindings with the sources used to produced these bindings.'
---

Comunica can track the sources that contribute to query results, which corresponds to [where-provenance](https://homepages.inf.ed.ac.uk/opb/papers/ICDT2001.pdf). 
However, this feature is not enabled by default due to the overhead of computing source attributions. 
Enabling it requires a [custom configuration](https://comunica.dev/docs/modify/getting_started/custom_config_app/).

To achieve this, Comunica wraps all query sources in a `QuerySourceAddSourceAttribution` via `ActorQuerySourceIdentifyHypermediaAnnotateSource`. This actor sets the URL of each query source in the context of the bindings it produces.

During joins, the contexts of these bindings are merged using the `SetUnionBindingsContextMergeHandler`, which is constructed by `ActorMergeBindingsContextUnion`.

## Serializing Source Attribution

When using Comunica via the command line, only the result bindings are shown by default, and the binding context is discarded.

To include source attribution in the output, you can use `ActorQueryProcessAnnotateSourceBinding`, which binds computed attributions to the `_source` key.

## Configuration

First add the following actors to the Comunica configuration:

```json
{
    "@context": [
        "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^4.0.0/components/context.jsonld",
        "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-source-identify-hypermedia-annotate-source/^4.0.0/components/context.jsonld"    
    ],
    "@id": "urn:comunica:default:Runner",
    "@type": "Runner",
    "actors": [ 
        {
            "@id": "urn:comunica:default:query-source-identify-hypermedia/actors#annotate-source",
            "@type": "ActorQuerySourceIdentifyHypermediaAnnotateSource",
            "mediatorMergeBindingsContext": { "@id": "urn:comunica:default:merge-bindings-context/mediators#main" },
            "mediatorQuerySourceIdentifyHypermedia": { "@id": "urn:comunica:default:query-source-identify-hypermedia/mediators#main" },
            "beforeActors": [
                { "@id": "urn:comunica:default:query-source-identify-hypermedia/actors#none" },
                { "@id": "urn:comunica:default:rdf-resolve-quad-pattern/actors#sparql" },
                { "@id": "urn:comunica:default:query-source-identify-hypermedia/actors#qpf" }
            ]
        }
    ]
}
```

`ActorMergeBindingsContextUnion`:

```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^4.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-merge-bindings-context-union/^4.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:default:Runner",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:merge-bindings-context/actors#source-binding-union",
      "@type": "ActorMergeBindingsContextUnion",
      "contextKey": "@comunica/bus-merge-bindings-context:sourcesBinding"
    }
  ]
}
```

`ActorQueryProcessAnnotateSourceBinding` (Optional):

```json
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^4.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-process-annotate-source-binding/^4.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:default:Runner",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:query-process/actors#annotate-source-binding",
      "@type": "ActorQueryProcessAnnotateSourceBinding",
      "mediatorQueryProcess": { "@id": "urn:comunica:default:query-process/mediators#main" },
      "beforeActors": [
        { "@id": "urn:comunica:default:query-process/actors#sequential" }
      ]
    }
  ]
}
```

## Expected Output

With this configuration, running the following query:

```bash
node engines/query-sparql/bin/query.js https://ruben.verborgh.org/profile/ https://www.rubensworks.net/publications/ -q "PREFIX schema: <http://schema.org/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT *
WHERE {
  ?article a schema:ScholarlyArticle;
     foaf:maker|schema:author ?author;
           foaf:name|schema:name ?name.
}"
```

will produce:

```text
{"article":"_:bc_1_df_11_4","author":"https://www.linkedin.com/in/bryanelliotttam/","name":"\"Optimizing Traversal Queries of Sensor Data Using a Rule-Based Reachability Approach\"","_source":"\"[\"https://www.rubensworks.net/publications/\"]\""},
{"article":"_:bc_1_df_11_4","author":"https://www.rubensworks.net/","name":"\"Optimizing Traversal Queries of Sensor Data Using a Rule-Based Reachability Approach\"","_source":"\"[\"https://www.rubensworks.net/publications/\"]\""},
...
```

<div class="note">
This actor does not work when the `aggregateTraversalStore` is enabled in `ActorQuerySourceIdentifyHypermedia`.
</div>