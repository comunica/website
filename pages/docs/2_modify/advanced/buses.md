---
title: 'Buses and Actors'
description: 'An overview of all buses in Comunica and their actors.'
---

This page gives an **overview of all _buses_ and _actors_**
that are used in the default Comunica engines,
such as [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/engines/query-sparql)
and [Comunica SPARQL File](https://github.com/comunica/comunica/tree/master/engines/query-sparql-file)
Other configurations such as [Comunica SPARQL HDT](https://github.com/comunica/comunica-query-sparql-hdt) contain additional actors and buses.

This builds upon the [core architecture](/docs/modify/advanced/architecture_core/) of _actors_, _mediators_, and _buses_.
An overview of how these buses and actors are connected can be found in the [SPARQL architecture](/docs/modify/advanced/architecture_sparql/).

## Context Preprocess

_Package: [`@comunica/bus-context-preprocess`](https://github.com/comunica/comunica/tree/master/packages/bus-context-preprocess)_

A bus in which actors can optionally modify the [query context](/docs/query/advanced/context/).

Subscribed actors need to implement [`ActorContextPreprocess`](https://comunica.github.io/comunica/classes/_comunica_bus_context_preprocess.ActorContextPreprocess.html).

| Name                   | Package                                                                                                                                                                  | Description                                                                                                                                                             |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Convert Shortcuts      | [`@comunica/actor-context-preprocess-convert-shortcuts`](https://github.com/comunica/comunica/tree/master/packages/actor-context-preprocess-convert-shortcuts)           | Expands shortcuts in the context to full context keys.                                                                                                                  |
| Query Source Identify  | [`@comunica/actor-context-preprocess-query-source-identify`](https://github.com/comunica/comunica/tree/master/packages/actor-context-preprocess-query-source-identify)   | Identifies all query sources in the context using the [Query Source Identify bus](https://github.com/comunica/comunica/tree/master/packages/bus-query-source-identify). |
| Query Source Skolemize | [`@comunica/actor-context-preprocess-query-source-skolemize`](https://github.com/comunica/comunica/tree/master/packages/actor-context-preprocess-query-source-skolemize) | Places all identified query sources in a skolemization wrapper.                                                                                                         |
| Set Defaults           | [`@comunica/actor-context-preprocess-set-defaults`](https://github.com/comunica/comunica/tree/master/packages/actor-context-preprocess-set-defaults)                     | Will set default context values for query engines, such as the logger, timestamp, function arguments cache, ...                                                         |
| Source To Destination  | [`@comunica/actor-context-preprocess-source-to-destination`](https://github.com/comunica/comunica/tree/master/packages/actor-context-preprocess-source-to-destination)       | Defines the write destination only if a single query source has been defined.                                                                                           |


## Dereference

_Package: [`@comunica/bus-dereference`](https://github.com/comunica/comunica/tree/master/packages/bus-dereference)_

Dereferences a path or URL into a (generic) stream.

Subscribed actors need to implement [`ActorDereference`](https://comunica.github.io/comunica/classes/_comunica_bus_dereference.ActorDereference.html).

### Actors

| Name     | Package                                                                                                                    | Description                                |
|----------|----------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| File     | [`@comunica/actor-dereference-file`](https://github.com/comunica/comunica/tree/master/packages/actor-dereference-file)     | Dereferences a local file.                 |
| HTTP     | [`@comunica/actor-dereference-http`](https://github.com/comunica/comunica/tree/master/packages/actor-dereference-http)     | Dereferences a remote file.                |
| Fallback | [`@comunica/actor-dereference-fallback`](https://github.com/comunica/comunica/tree/master/packages/actor-dereference-fallback) | A fallback actor with the lowest priority. |


## Dereference RDF

_Package: [`@comunica/bus-dereference-rdf`](https://github.com/comunica/comunica/tree/master/packages/bus-dereference-rdf)_

Dereferences a path or URL into a stream of quads.

Subscribed actors need to implement [`ActorDereferenceRdf`](https://comunica.github.io/comunica/classes/_comunica_bus_dereference_rdf.ActorDereferenceRdf.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Parse | [`@comunica/actor-dereference-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/actor-dereference-rdf-parse) | Dereferences RDF using [`@comunica/bus-dereference`](https://github.com/comunica/comunica/tree/master/packages/bus-dereference). Invokes parsing with [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse). |


## Hash Bindings

_Package: [`@comunica/bus-hash-bindings`](https://github.com/comunica/comunica/tree/master/packages/bus-hash-bindings)_

A bus for hashing `Bindings`.

Subscribed actors need to implement [`ActorHashBindings`](https://comunica.github.io/comunica/classes/_comunica_bus_hash_bindings.ActorHashBindings.html).

### Actors

| Name | Package                                                                                                                       | Description                 |
|------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| SHA1 | [`@comunica/actor-hash-bindings-sha1`](https://github.com/comunica/comunica/tree/master/packages/actor-hash-bindings-sha1) | Hashes bindings using SHA1. |


## Hash Quads

_Package: [`@comunica/bus-hash-quads`](https://github.com/comunica/comunica/tree/master/packages/bus-hash-quads)_

A bus for hashing `RDF.Quad`.

Subscribed actors need to implement [`ActorHashQuads`](https://comunica.github.io/comunica/classes/_comunica_bus_hash_quads.ActorHashQuads.html).

### Actors

| Name | Package                                                                                                              | Description              |
|------|----------------------------------------------------------------------------------------------------------------------|--------------------------|
| SHA1 | [`@comunica/actor-hash-quads-sha1`](https://github.com/comunica/comunica/tree/master/packages/actor-hash-quads-sha1) | Hashes quads using SHA1. |


## HTTP

_Package: [`@comunica/bus-http`](https://github.com/comunica/comunica/tree/master/packages/bus-http)_

Performs HTTP(S) requests.

Subscribed actors need to implement [`ActorHttp`](https://comunica.github.io/comunica/classes/_comunica_bus_http.ActorHttp.html).

### Actors

| Name    | Package                                                                                                        | Description                                                       |
|---------|----------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| Memento | [`@comunica/actor-http-memento`](https://github.com/comunica/comunica/tree/master/packages/actor-http-memento) | Implements the [Memento protocol](/docs/query/advanced/memento/). |
| Native  | [`@comunica/actor-http-native`](https://github.com/comunica/comunica/tree/master/packages/actor-http-native)   | Performs requests using Node's request library.                   |
| Fetch   | [`@comunica/actor-http-fetch`](https://github.com/comunica/comunica/tree/master/packages/actor-http-fetch)     | Performs requests using the fetch API.                            |
| Proxy   | [`@comunica/actor-http-proxy`](https://github.com/comunica/comunica/tree/master/packages/actor-http-proxy)     | Run requests through a proxy.                                     |
| Wayback | [`@comunica/actor-http-wayback`](https://github.com/comunica/comunica/tree/master/packages/actor-http-wayback)   | Run requests through the Wayback machine.                         |


## HTTP Invalidate

_Package: [`@comunica/bus-http-invalidate`](https://github.com/comunica/comunica/tree/master/packages/bus-http-invalidate)_

A bus for HTTP invalidation events.

Subscribed actors need to implement [`ActorHttpInvalidate`](https://comunica.github.io/comunica/classes/_comunica_bus_http.ActorHttp.html).


## Init

_Package: [`@comunica/bus-init`](https://github.com/comunica/comunica/tree/master/packages/bus-init)_

All Comunica engines start here. This is where they accept generic input parameters, such as CLI arguments.

Subscribed actors need to implement [`ActorInit`](https://comunica.github.io/comunica/classes/_comunica_bus_init.ActorInit.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Query | [`@comunica/actor-init-query`](https://github.com/comunica/comunica/tree/master/packages/actor-init-query) | Initializes query execution by parsing a given query, optimizing, executing, and serializing results. |


## Merge Bindings Context

_Package: [`@comunica/bus-merge-bindings-context`](https://github.com/comunica/comunica/tree/master/packages/bus-init)_

A bus for creating merge handlers that are responsible for merging context entries in bindings with different values.

Subscribed actors need to implement [`ActorMergeBingsContext`](https://comunica.github.io/comunica/classes/_comunica_bus_merge_bindings_context.ActorMergeBingsContext.html).

### Actors

| Name  | Package | Description                                          |
|-------| ------- |------------------------------------------------------|
| Union | [`@comunica/actor-actor-merge-binding-factory-context-union`](https://github.com/comunica/comunica/tree/master/packages/actor-merge-binding-factory-context-union) | Merges context entry values by taking the set-union. |


## Optimize Query Operation

_Package: [`@comunica/bus-optimize-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-optimize-query-operation)_

Apply optional optimizations to the SPARQL algebra before actual execution.
Optionally, a modified context can be returned.

Subscribed actors need to implement [`ActorOptimizeQueryOperation`](https://comunica.github.io/comunica/classes/_comunica_bus_optimize_query_operation.ActorOptimizeQueryOperation.html).

### Actors

| Name                           | Package                                                                                                                                                                                            | Description                                                                                                                                               |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Assign Sources Exhaustive      | [`@comunica/actor-optimize-query-operation-assign-sources-exhaustive`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-assign-sources-exhaustive)         | Converts every quad pattern in the query to a union of quad patterns per source.                                                                          |
| BGP to Join                    | [`@comunica/actor-optimize-query-operation-bgp-to-join`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-bgp-to-join)                                     | Converts BGPs into join operations.                                                                                                                       |
| Construct Distinct             | [`@comunica/actor-optimize-query-operation-construct-distinct`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-construct-distinctv)                      | Wraps the top-level Construct clause in Distinct if --distinct flag is on.                                                                                |
| Describe To Constructs Subject | [`@comunica/actor-optimize-query-operation-describe-to-constructs-subject`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-assign-sources-exhaustive)    | Converts [SPARQL `DESCRIBE`](https://www.w3.org/TR/sparql11-query/#describe) operations to construct queries with all triples related to a given subject. |
| Filter Pushdown                | [`@comunica/actor-optimize-query-operation-filter-pushdown`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-filter-pushdown)                             | Pushes down filter expressions into the query plan as deep as possible.                                                                                   |
| Join BGP                       | [`@comunica/actor-optimize-query-operation-join-bgp`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-join-bgp)                                           | Merges joins of multiple BGPs into a single BGP.                                                                                                          |
| Join Connected                 | [`@comunica/actor-optimize-query-operation-join-connected`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-join-connected)                               | Clusters entries within a join operation into separate sub-joins if they are connected by variables.                                                      |
| Group Sources                  | [`@comunica/actor-optimize-query-operation-group-sources`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-group-sources)                                 | Groups exclusive groups of query operations into sources only if those sources support those grouped operations.                                          |
| Prune Empty Source Operations  | [`@comunica/actor-optimize-query-operation-prune-empty-source-operations`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-prune-empty-source-operations) | Removes operations from the query plan that are guaranteed to produce empty results.                                                                      |
| Rewrite Add                    | [`@comunica/actor-optimize-query-operation-rewrite-add`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-rewrite-add)                                     | Rewrites ADD operators as DELETEINSERT operations.                                                                                                        |
| Rewrite Copy                   | [`@comunica/actor-optimize-query-operation-rewrite-copy`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-rewrite-copy)                                   | Rewrites COPY operators as DELETEINSERT operations.                                                                                                       |
| Rewrite Move                   | [`@comunica/actor-optimize-query-operation-rewrite-move`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-rewrite-move)                                   | Rewrites MOVE operators as DELETEINSERT operations.                                                                                                       |


## Query Operation

_Package: [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation)_

Evaluates [SPARQL algebra operations](/docs/modify/advanced/algebra/).

Subscribed actors need to implement [`ActorQueryOperation`](https://comunica.github.io/comunica/classes/_comunica_bus_query_operation.ActorQueryOperation.html)
or [`ActorQueryOperationTyped`](https://comunica.github.io/comunica/classes/_comunica_bus_query_operation.ActorQueryOperationTyped.html).

### Actors

| Name                    | Package                                                                                                                                                           | Description                                                                                                                                                         |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Ask                     | [`@comunica/actor-query-operation-ask`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-ask)                                      | Handles `ASK` operations.                                                                                                                                           |
| BGP join                | [`@comunica/actor-query-operation-bgp-join`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-bgp-join)                            | Handles BGPs by delegating to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join).                                   |
| Construct               | [`@comunica/actor-query-operation-construct`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-construct)                          | Handles `CONSTRUCT` operations.                                                                                                                                     |
| Describe subject        | [`@comunica/actor-query-operation-describe-subject`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-describe-subject)            | Handles `DESCRIBE` operations.                                                                                                                                      |
| Distinct hash           | [`@comunica/actor-query-operation-distinct-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-distinct-hash)                  | Handles `DISTINCT` operations through hashing.                                                                                                                      |
| Extend                  | [`@comunica/actor-query-operation-extend`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend)                                | Handles `EXTEND` operations.                                                                                                                                        |
| Filter                  | [`@comunica/actor-query-operation-filter`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-filter)                                | Handles `FILTER` operations.                                                                                                                                        |
| From quad               | [`@comunica/actor-query-operation-from-quad`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-from-quad)                          | handles `FROM` operations by considering FROM and FROM NAMED as target graph elements in quads.                                                                     |
| Group                   | [`@comunica/actor-query-operation-group`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-group)                                  | Handles `GROUP BY` operations.                                                                                                                                      |
| Join                    | [`@comunica/actor-query-operation-join`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-join)                                    | Handles join operations by delegating as inner join to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join).          |
| Left join               | [`@comunica/actor-query-operation-leftjoin`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-leftjoin)                            | Handles `OPTIONAL` operations by delegating as optional join to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join). |
| Minus                   | [`@comunica/actor-query-operation-minus`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-minus)                                  | Handles `MINUS` operations by delegating as minus join to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join).       |
| Nop                     | [`@comunica/actor-query-operation-nop`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-nop)                                      | Handles `NOP` operations.                                                                                                                                           |
| Order by                | [`@comunica/actor-query-operation-orderby`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-orderby)                      | Handles `ORDER BY` operations.                                                                                                                                      |
| Path Alt                | [`@comunica/actor-query-operation-path-alt`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-alt)                            | Handles `alt` property path expressions.                                                                                                                            |
| Path Inv                | [`@comunica/actor-query-operation-path-inv`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-inv)                            | Handles `inv` property path expressions.                                                                                                                            |
| Path Link               | [`@comunica/actor-query-operation-path-link`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-link)                          | Handles `link` property path expressions.                                                                                                                           |
| Path Nps                | [`@comunica/actor-query-operation-path-nps`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-nps)                            | Handles `nps` property path expressions.                                                                                                                            |
| Path One or more        | [`@comunica/actor-query-operation-path-one-or-more`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-one-or-more)            | Handles `one-or-more` property path expressions.                                                                                                                    |
| Path Seq                | [`@comunica/actor-query-operation-path-seq`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-seq)                            | Handles `seq` property path expressions.                                                                                                                            |
| Path Zero or more       | [`@comunica/actor-query-operation-path-zero-or-more`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-zero-or-more)          | Handles `zero-or-more` property path expressions.                                                                                                                   |
| Path Zero or one        | [`@comunica/actor-query-operation-path-zero-or-one`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-zero-or-one)            | Handles `zero-or-one` property path expressions.                                                                                                                    |
| Project                 | [`@comunica/actor-query-operation-project`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-project)                              | Handles `SELECT` operations.                                                                                                                                        |
| Reduced hash            | [`@comunica/actor-query-operation-reduced-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-reduced-hash)                    | Handles `REDUCED` operations through hashing.                                                                                                                       |
| Service                 | [`@comunica/actor-query-operation-service`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-service)                              | Handles `SERVICE` operations.                                                                                                                                       |
| Slice                   | [`@comunica/actor-query-operation-slice`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-slice)                                  | Handles `LIMIT` and `OFFSET` operations.                                                                                                                            |
| Source                  | [`@comunica/actor-query-operation-source`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-sparql-endpoint)                       | Delegates operations annotated with a query source towards that source.                                                                |
| Union                   | [`@comunica/actor-query-operation-union`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-union)                                  | Handles `UNION` operations.                                                                                                                                         |
| Values                  | [`@comunica/actor-query-operation-values`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-values)                                | Handles `VALUES` operations.                                                                                                                                        |
| Update Clear            | [`@comunica/actor-query-operation-update-clear`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-clear)                    | Handles `CLEAR` operations.                                                                                                                                         |
| Update Composite Update | [`@comunica/actor-query-operation-update-compositeupdate`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-compositeupdate) | Handles `composition of multiple SPARQL update operations.                                                                                                          |
| Update Create           | [`@comunica/actor-query-operation-update-create`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-create)                  | Handles `CREATE` operations.                                                                                                                                        |
| Update Delete Insert    | [`@comunica/actor-query-operation-update-deleteinsert`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-deleteinsert)      | Handles `INSERT DATA`, `DELETE DATA`, and `INSERT/DELETE` operations.                                                                                               |
| Update Drop             | [`@comunica/actor-query-operation-update-drop`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-drop)                      | Handles `DROP` operations.                                                                                                                                          |
| Update Load             | [`@comunica/actor-query-operation-update-load`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-load)                      | Handles `LOAD` operations.                                                                                                                                          |


## Query Parse

_Package: [`@comunica/bus-query-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-query-parse)_

Parsing an input query into (SPARQL) algebra.

Subscribed actors need to implement [`ActorQueryParse`](https://comunica.github.io/comunica/classes/_comunica_bus_query_parse.ActorQueryParse.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| SPARQL | [`@comunica/actor-query-parse-sparql`](https://github.com/comunica/comunica/tree/master/packages/actor-query-parse-sparql) | Uses [SPARQLAlgebra.js](https://github.com/joachimvh/SPARQLAlgebra.js) for parsing SPARQL query strings into SPARQL algebra. |
| GraphQL | [`@comunica/actor-query-parse-graphql`](https://github.com/comunica/comunica/tree/master/packages/actor-query-parse-graphql) | Parses GraphQL strings into SPARQL algebra following the [GraphQL-LD](/docs/query/advanced/graphql_ld/) approach. |


## Query Process

_Package: [`@comunica/bus-query-process`](https://github.com/comunica/comunica/tree/master/packages/bus-query-parse)_

A bus for fully processing a query. This usually involves parsing, optimizing, and evaluating, which can be delegated to other buses.

Subscribed actors need to implement [`ActorQueryProcess`](https://comunica.github.io/comunica/classes/_comunica_bus_query_process.ActorQueryProcess.html).

### Actors

| Name             | Package                                                                                                                                                  | Description                                                                                               |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Annotate Source Binding  | [`@comunica/actor-query-process-annotate-source-binding`](https://github.com/comunica/comunica/tree/master/packages/actor-query-process-annotate-source-binding) | Annotates bindings with their sources.                                                                    |
| Explain Logical  | [`@comunica/actor-query-process-explain-logical`](https://github.com/comunica/comunica/tree/master/packages/actor-query-process-explain-logical)         | Explains the logical query plan after parsing and optimizing.                                             |
| Explain Parsed   | [`@comunica/actor-query-process-explain-parsed`](https://github.com/comunica/comunica/tree/master/packages/actor-query-process-explain-parsed)           | Explains the parsed query.                                                                                |
| Explain Physical | [`@comunica/actor-query-process-explain-physical`](https://github.com/comunica/comunica/tree/master/packages/actor-query-process-explain-physical)       | Explains the physical query plan after parsing, optimizing, and evaluating.                               |
| Sequential       | [`@comunica/actor-query-process-sequential`](https://github.com/comunica/comunica/tree/master/packages/actor-query-process-sequential)                   | Processes a query in a sequential manner. It first parses the query, optimizes it, and then evaluates it. |


## Query Result Serialize

_Package: [`@comunica/bus-query-result-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-query-result-serialize)_

Serializes the query result into a text-based serialization.

Subscribed actors need to implement [`ActorQueryResultSerialize`](https://comunica.github.io/comunica/classes/_comunica_bus_query_result_serialize.ActorQueryResultSerialize.html).

### Actors

| Name | Package                                                                                                                               | Description |
| ---- |---------------------------------------------------------------------------------------------------------------------------------------| ----------- |
| JSON | [`@comunica/actor-query-result-serialize-json`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-json) | Serializes to a simple JSON format. |
| RDF | [`@comunica/actor-query-result-serialize-rdf`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-rdf)          | Serializes to an RDF format by delegating to [`@comunica/bus-rdf-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-serialize). |
| Simple | [`@comunica/actor-query-result-serialize-simple`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-)          | Serializes to a simple format. |
| SPARQL CSV | [`@comunica/actor-query-result-serialize-sparql-csv`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-csv)   | Serializes to SPARQL/CSV. |
| SPARQL JSON | [`@comunica/actor-query-result-serialize-sparql-json`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-json) | Serializes to SPARQL/JSON. |
| SPARQL TSV | [`@comunica/actor-query-result-serialize-sparql-tsv`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-tsv)   | Serializes to SPARQL/TSV. |
| SPARQL XML | [`@comunica/actor-query-result-serialize-sparql-xml`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-xml)   | Serializes to SPARQL/XML. |
| Stats | [`@comunica/actor-query-result-serialize-stats`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-stats)      | Serializes basic statistics. |
| Table | [`@comunica/actor-query-result-serialize-table`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-table)      | Serializes in a simple table format. |
| Tree | [`@comunica/actor-query-result-serialize-tree`](https://github.com/comunica/comunica/tree/master/packages/actor-query-result-serialize-tree)        | Serializes to a JSON tree. |


## Query Source Identify

_Package: [`@comunica/bus-query-source-identify`](https://github.com/comunica/comunica/tree/master/packages/bus-query-source-identify)_

Identifying the types of query sources.

Subscribed actors need to implement [`ActorQuerySourceIdentify`](https://comunica.github.io/comunica/classes/_comunica_bus_query_source_identify.ActorQuerySourceIdentify.html).

### Actors

| Name          | Package                                                                                                                                                  | Description                                                                                |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| Serialized    | [`@comunica/actor-query-source-identify-serialized`](https://github.com/comunica/comunica/tree/master/packages/actor-query-source-identify-serialized)    | Handles serialized sources..                                                               |
| Hypermedia    | [`@comunica/actor-query-source-identify-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/actor-query-source-identify-hypermedia)   | Handles [hypermedia-based sources](/docs/modify/advanced/hypermedia/). |
| RDF/JS Source | [`@comunica/actor-query-source-identify-rdfjs`](https://github.com/comunica/comunica/tree/master/packages/actor-query-source-identify-rdfjs) | Handles [RDF/JS Sources](https://comunica.dev/docs/query/advanced/rdfjs_querying/).        |


## Query Source Identify Hypermedia

_Package: [`@comunica/bus-query-source-identify-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/bus-query-source-identify)_

Identifying a query source based on the extracted metadata.

Subscribed actors need to implement [`ActorQuerySourceIdentifyHypermedia`](https://comunica.github.io/comunica/classes/_comunica_bus_query_source_identify_hypermedia.ActorQuerySourceIdentifyHypermedia.html).

### Actors

| Name | Package                                                                                                                                                                     | Description                                                                                                                     |
| ---- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Annotate Source | [`@comunica/actor-query-source-identify-hypermedia-annotate-source`](https://github.com/comunica/comunica/tree/master/packages/actor-query-source-identify-hypermedia-annotate-source) | This actor wraps around other hypermedia sources and adds the URL from which the bindings are derived to the binding's context. |
| None | [`@comunica/actor-query-source-identify-hypermedia-none`](https://github.com/comunica/comunica/tree/master/packages/actor-query-source-identify-hypermedia-none)            | The source is considered a raw RDF file, for which all data quads matching the quad pattern are returned.                       |
| QPF | [`@comunica/actor-query-source-identify-hypermedia-qpf`](https://github.com/comunica/comunica/tree/master/packages/actor-query-source-identify-hypermedia-qpf)              | The source is considered a [Triple/Quad Pattern Fragments](https://linkeddatafragments.org/) interface.                         |
| SPARQL | [`@comunica/actor-query-source-identify-hypermedia-sparql`](https://github.com/comunica/comunica/tree/master/packages/actor-query-source-identify-hypermedia-sparql)        | The source is considered a SPARQL endpoint if it has a service description, for which we use the SPARQL protocol.               |


## RDF Join

_Package: [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join)_

Handles joining of bindings streams.

It supports different logical join types, such as inner, optional, and minus joins.

Subscribed actors need to implement [`ActorRdfJoin`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_join.ActorRdfJoin.html).

### Actors

| Name                                 | Package                                                                                                                                                                          | Description                                                                                                                                                                                                                                                                                                                                            |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Inner Hash                           | [`@comunica/actor-rdf-join-inner-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-hash)                                                     | Inner hash join of two entries.                                                                                                                                                                                                                                                                                                                        |
| Inner Nested loop                    | [`@comunica/actor-rdf-join-inner-nestedloop`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-nestedloop)                                         | Inner nested loop join of two entries.                                                                                                                                                                                                                                                                                                                 |
| Inner None                           | [`@comunica/actor-rdf-join-inner-none`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-none)                                                     | Inner join between zero entries, and returns a single binding.                                                                                                                                                                                                                                                                                         |
| Inner Single                         | [`@comunica/actor-rdf-join-inner-single`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-single)                                                 | Inner join of a single entry, and returns the entry itself.                                                                                                                                                                                                                                                                                            |
| Inner Symmetric hash                 | [`@comunica/actor-rdf-join-inner-symmetrichash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-symmetrichash)                                   | Inner symmetric hash join of two entries.                                                                                                                                                                                                                                                                                                              |
| Inner Multi empty                    | [`@comunica/actor-rdf-join-inner-multi-empty`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-empty)                                       | Inner multi-join that accepts any number of inner-join entries of which at least one is empty and returns an empty stream.                                                                                                                                                                                                                             |
| Inner Multi Bind                     | [`@comunica/actor-rdf-join-inner-multi-bind`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-bind)                                         | Inner multi-join that inner-joins 2 or more streams by picking the one with the lowest cardinality, binding each item with the remaining operations, and recursively resolving those operations by delegating to [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation).                     |
| Inner Multi Bind Source              | [`@comunica/actor-rdf-join-inner-multi-bind-source`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-bind-source)                           | Inner multi-join that inner-joins 2 or more streams by picking the one with the lowest cardinality, chunking it according to a certain block size, and joining each chunk with the remaining query by pushing it into the source.                                                                                                                      |
| Inner Multi sequential               | [`@comunica/actor-rdf-join-inner-multi-sequential`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-sequential)                             | Inner multi-join by just picking the two of them hierarchically.                                                                                                                                                                                                                                                                                       |
| Inner Multi smallest                 | [`@comunica/actor-rdf-join-inner-multi-smallest`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-smallest)                                 | Inner multi-join by always picking the first two streams with smallest estimate cardinality.                                                                                                                                                                                                                                                           |
| Inner Multi smallest filter bindings | [`@comunica/actor-rdf-join-inner-multi-smallest-filter-bindings`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-smallest-filter-bindings) | Inner multi-join that inner-joins 2 or more streams by joining the smallest two, and joining the result with the remaining streams by delegating back to the [RDF Join bus](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join). While joining the smallest two, the first stream is pushed down as filter into the second stream.. |
| Minus Hash                           | [`@comunica/actor-rdf-join-minus-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-minus-hash)                                                     | Anti-join (minus) of 2 streams using the hash join algorithm. This actor does _not_ support streams that can have undefined values.                                                                                                                                                                                                                    |
| Minus Hash undef                     | [`@comunica/actor-rdf-join-minus-hash-undef`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-minus-hash-undef)                                         | Anti-join (minus) of 2 streams using the hash join algorithm. This actor supports streams that can have undefined values.                                                                                                                                                                                                                              |
| Optional Bind                        | [`@comunica/actor-rdf-join-optional-bind`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-optional-bind)                                               | Left-join (optional) 2 streams using the bind join algorithm. It binds each item of the first stream with the second operation, and recursively resolving that operation by delegating to [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation).                                            |
| Optional Hash                        | [`@comunica/actor-rdf-join-optional-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-optional-hash)                                               | Left-join (optional) 2 streams using the hash join algorithm.                                                                                                                                                                                                                                                                                          |
| Optional Nested loop                 | [`@comunica/actor-rdf-join-optional-nestedloop`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-optional-nestedloop)                                   | Left-join (optional) 2 streams using the nested loop join algorithm.                                                                                                                                                                                                                                                                                   |
| Optional Opt Plus                    | [`@comunica/actor-rdf-join-optional-optplus`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-optional-optplus)                                            | Left-join (optional) 2 streams using the [OPT+](https://www.researchgate.net/publication/333627321_OPT_A_Monotonic_Alternativeto_OPTIONAL_in_SPARQL) algorithm.                                                                                                                                                                                                                                                                                             |


## RDF Join Entries Sort

_Package: [`@comunica/bus-rdf-join-entries-sort`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join-entries-sort)_

Determines the order in which join entries should be ordered.

Subscribed actors need to implement [`ActorRdfJoinEntriesSort`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_join_entries_sort.ActorRdfJoinEntriesSort.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Cardinality | [`@comunica/actor-rdf-join-entries-sort-cardinality`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-entries-sort-cardinality) | Orders join entries by increasing cardinality. |


## RDF Join Selectivity

_Package: [`@comunica/bus-rdf-join-selectivity`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join-selectivity)_

Calculates or estimates the selectivity of joins.

Subscribed actors need to implement [`ActorRdfJoinSelectivity`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_join_selectivity.ActorRdfJoinSelectivity.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Variable Counting | [`@comunica/actor-rdf-join-selectivity-variable-counting`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-selectivity-variable-counting) | Estimates the selectivity by counting the overlap of variables and non-variables in patterns. |


## RDF Metadata

_Package: [`@comunica/bus-rdf-metadata`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata)_

Extracts the quads relevant for metadata from the stream of data quads.

Subscribed actors need to implement [`ActorRdfMetadata`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_metadata.ActorRdfMetadata.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| All | [`@comunica/actor-rdf-metadata-all`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-all) | Considers all incoming quads as both data and metadata quads. |
| Primary topic | [`@comunica/actor-rdf-metadata-primary-topic`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-primary-topic) | Splits off the metadata based on the existence of a `foaf:primaryTopic` link. |


## RDF Metadata Accumulate

_Package: [`@comunica/bus-rdf-metadata-accumulate`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata-accumulate)_

A bus for aggregating metadata objects together.

Subscribed actors need to implement [`ActorRdfMetadataAccumulate`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_metadata_accumulate.ActorRdfMetadataAccumulate.html).

### Actors

| Name               | Package                                                                                                                                                                | Description                              |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| Can Contain Undefs | [`@comunica/actor-rdf-metadata-accumulate-cancontainundefs`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-accumulate-cancontainundefs) | Accumulate the `canContainUndefs` field. |
| Cardinality        | [`@comunica/actor-rdf-metadata-accumulate-cardinality`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-accumulate-cardinality)           | Accumulate the `cardinality` field.      |
| Page Size          | [`@comunica/actor-rdf-metadata-accumulate-pagesize`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-accumulate-pagesize)                 | Accumulate the `pageSize` field.         |
| Request Time       | [`@comunica/actor-rdf-metadata-accumulate-requesttime`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-accumulate-requesttime)           | Accumulate the `requestTime` field.      |

## RDF Metadata Extract

_Package: [`@comunica/bus-rdf-metadata-extract`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata-extract)_

Create an object with metadata for a given metadata quad stream.

Subscribed actors need to implement [`ActorRdfMetadataExtract`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_metadata_extract.ActorRdfMetadataExtract.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Allow HTTP Methods | [`@comunica/actor-rdf-metadata-extract-allow-http-methods`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-allow-http-methods) | Extract the `Allow` HTTP response header. |
| Hydra Controls | [`@comunica/actor-rdf-metadata-extract-hydra-controls`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-hydra-controls) | Extract controls using the Hydra vocabulary. |
| Hydra Count | [`@comunica/actor-rdf-metadata-extract-hydra-count`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-hydra-count) | Extract count estimates using the Hydra vocabulary. |
| Hydra Page size | [`@comunica/actor-rdf-metadata-extract-hydra-pagesize`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-hydra-pagesize) | Extract page sizes using the Hydra vocabulary. |
| Patch SPARQL Update | [`@comunica/actor-rdf-metadata-extract-patch-sparql-update`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-patch-sparql-update) | Checks for the presence of `application/sparql-update` in the `Accept-Patch` header. |
| Put Accepted | [`@comunica/actor-rdf-metadata-extract-put-accepted`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-put-accepted) | Extracts the [`Accept-Put`](https://solidproject.org/TR/protocol#accept-put) HTTP response header. |
| Request Time | [`@comunica/actor-rdf-metadata-extract-request-time`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-request-time) | Extracts the time it took to request the page in milliseconds. |
| SPARQL Service | [`@comunica/actor-rdf-metadata-extract-sparql-service`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-sparql-service) | Extract SPARQL service description metadata. |


## RDF Parse

_Package: [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse)_

Parses quads from a serialization format.

Subscribed actors need to implement [`ActorRdfParse`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_parse.ActorRdfParse.html).

### Actors

| Name     | Package                                                                                                                    | Description                                                                                                                                            |
|----------|----------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| HTML     | [`@comunica/actor-rdf-parse-html`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html)         | Parses HTML documents by delegating to [`@comunica/bus-rdf-parse-html`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse-html). |
| JSON-LD  | [`@comunica/actor-rdf-parse-jsonld`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-jsonld)     | Parses JSON-LD.                                                                                                                                        |
| N3       | [`@comunica/actor-rdf-parse-n3`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-n3)             | Parses Turtle, Trig, N-triples, or N-Quads.                                                                                                            |
| RDF/XML  | [`@comunica/actor-rdf-parse-rdfxml`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-rdfxml)     | Parses RDF/XML.                                                                                                                                        |
| XML RDFa | [`@comunica/actor-rdf-parse-xml-rdfa`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-xml-rdfa) | Parses RDFa in XML.                                                                                                                                    |
| SHACLC   | [`@comunica/actor-rdf-parse-shaclc`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-shaclc)     | Parses SHACLC.                                                                                                                                         |


## RDF Parse HTML

_Package: [`@comunica/bus-rdf-parse-html`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse-html)_

Parses quads from an HTML document.

Subscribed actors need to implement [`ActorRdfParseHtml`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_parse_html.ActorRdfParseHtml.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| RDFa | [`@comunica/actor-rdf-parse-html-rdfa`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html-rdfa) | Parses RDFa. |
| Microdata | [`@comunica/actor-rdf-parse-html-microdata`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html-microdata) | Parses Microdata to RDF. |
| Script | [`@comunica/actor-rdf-parse-html-script`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html-script) | Parses script tags and attempts to parse them by delegating to [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse). |


## RDF Resolve Hypermedia Links

_Package: [`@comunica/bus-rdf-resolve-hypermedia-links`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-hypermedia-links)_

Determines which links should be followed from the metadata of the current source.

Subscribed actors need to implement [`ActorRdfResolveHypermediaLinks`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_resolve_hypermedia_links.ActorRdfResolveHypermediaLinks.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Next | [`@comunica/actor-rdf-resolve-hypermedia-links-next`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-links-next) | Follow next page links. |

## RDF Resolve Hypermedia Links Queue

_Package: [`@comunica/bus-rdf-resolve-hypermedia-links-queue`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-hypermedia-links-queue)_

Creates [`ILinkQueue`](https://comunica.github.io/comunica/interfaces/_comunica_bus_rdf_resolve_hypermedia_links_queue.ilinkqueue.html) instances,
which enables different strategies for queueing links.

Subscribed actors need to implement [`ActorRdfResolveHypermediaLinksQueue`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_resolve_hypermedia_links_queue.ActorRdfResolveHypermediaLinksQueue.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| FIFO | [`@comunica/actor-rdf-resolve-hypermedia-links-queue-fifo`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-links-queue-fifo) | Provides a link queue following the first in, first out strategy |


## RDF Serialize

_Package: [`@comunica/bus-rdf-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-serialize)_

Serializes quads to an RDF serialization format.

Subscribed actors need to implement [`ActorRdfSerialize`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_serialize.ActorRdfSerialize.html).

### Actors

| Name    | Package                                                                                                                        | Description                                        |
|---------|--------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| JSON-LD | [`@comunica/actor-rdf-serialize-jsonld`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-serialize-jsonld) | Serializes to JSON-LD.                             |
| N3      | [`@comunica/actor-rdf-serialize-n3`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-serialize-n3)         | Serializes to Turtle, Trig, N-triples, or N-Quads. |
| SHACLC  | [`@comunica/actor-rdf-serialize-shaclc`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-serialize-shaclc) | Serializes to SHACLC.                              |


## RDF Update Hypermedia

_Package: [`@comunica/bus-rdf-update-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-update-hypermedia)_

Handle a destination based on the extracted metadata.

Subscribed actors need to implement [`ActorRdfUpdateHypermedia`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_update_hypermedia.ActorRdfUpdateHypermedia.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| SPARQL | [`@comunica/actor-rdf-update-hypermedia-patch-sparql-update`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-update-hypermedia-patch-sparql-update) | The destination is considered an HTTP APIs accepting `PATCH` requests containing SPARQL Update queries (`application/sparql-update`), such as [Solid servers](https://github.com/solid/solid-spec/blob/master/api-rest.md#alternative-using-sparql-1). |


## RDF Update Quads

_Package: [`@comunica/bus-rdf-update-quads`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-update-quads)_

Handle the insertion and deletion of streams of quads for a given destination type.

Subscribed actors need to implement [`ActorRdfUpdateQuads`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_update_quads.ActorRdfUpdateQuads.html)
or [`ActorRdfUpdateQuadsDestination`](https://comunica.github.io/comunica/classes/_comunica_bus_rdf_update_quads.ActorRdfUpdateQuadsDestination.html)

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| RDF/JS Store | [`@comunica/actor-rdf-update-quads-rdfjs-store`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-update-quads-rdfjs-store) | The destination is considered an [RDF/JS Store](https://comunica.dev/docs/query/advanced/rdfjs_querying/). |
| Hypermedia | [`@comunica/actor-rdf-update-quads-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-update-quads-hypermedia) | The destination that handles updates by interpreting hypermedia links and controls. |
