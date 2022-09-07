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

## Init

_Package: [`@comunica/bus-init`](https://github.com/comunica/comunica/tree/master/packages/bus-init)_

All Comunica engines start here. This is where they accept generic input parameters, such as CLI arguments.

Subscribed actors need to implement [`ActorInit`](https://comunica.github.io/comunica/classes/bus_init.ActorInit.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Query | [`@comunica/actor-init-query`](https://github.com/comunica/comunica/tree/master/packages/actor-init-query) | Initializes query execution by parsing a given query, optimizing, executing, and serializing results. |


## Context Preprocess

_Package: [`@comunica/bus-context-preprocess`](https://github.com/comunica/comunica/tree/master/packages/bus-context-preprocess)_

A bus in which actors can optionally modify the [query context](/docs/query/advanced/context/).

Subscribed actors need to implement [`ActorContextPreprocess`](https://comunica.github.io/comunica/classes/bus_context_preprocess.ActorContextPreprocess.html).

_Contains no actors yet._


## Query Parse

_Package: [`@comunica/bus-query-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-query-parse)_

Parsing an input query into (SPARQL) algebra.

Subscribed actors need to implement [`ActorQueryParse`](https://comunica.github.io/comunica/classes/bus_query_parse.ActorQueryParse.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| SPARQL | [`@comunica/actor-query-parse-sparql`](https://github.com/comunica/comunica/tree/master/packages/actor-query-parse-sparql) | Uses [SPARQLAlgebra.js](https://github.com/joachimvh/SPARQLAlgebra.js) for parsing SPARQL query strings into SPARQL algebra. |
| GraphQL | [`@comunica/actor-query-parse-graphql`](https://github.com/comunica/comunica/tree/master/packages/actor-query-parse-graphql) | Parses GraphQL strings into SPARQL algebra following the [GraphQL-LD](/docs/query/advanced/graphql_ld/) approach. |


## Optimize Query Operation

_Package: [`@comunica/bus-optimize-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-optimize-query-operation)_

Apply optional optimizations to the SPARQL algebra before actual execution.
Optionally, a modified context can be returned.

Subscribed actors need to implement [`ActorOptimizeQueryOperation`](https://comunica.github.io/comunica/classes/bus_optimize_query_operation.ActorOptimizeQueryOperation.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| BGP to Join | [`@comunica/actor-optimize-query-operation-bgp-to-join`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-bgp-to-join) | Converts BGPs into join operations. |
| Join BGP | [`@comunica/actor-optimize-query-operation-join-bgp`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-join-bgp) | Merges joins of multiple BGPs into a single BGP. |
| Join Connected | [`@comunica/actor-optimize-query-operation-join-connected`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-join-connected) | Clusters entries within a join operation into separate sub-joins if they are connected by variables. |


## Query Operation

_Package: [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation)_

Evaluates [SPARQL algebra operations](/docs/modify/advanced/algebra/).

Subscribed actors need to implement [`ActorQueryOperation`](https://comunica.github.io/comunica/classes/bus_query_operation.ActorQueryOperation.html)
or [`ActorQueryOperationTyped`](https://comunica.github.io/comunica/classes/bus_query_operation.ActorQueryOperationTyped.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Ask | [`@comunica/actor-query-operation-ask`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-ask) | Handles `ASK` operations. |
| BGP join | [`@comunica/actor-query-operation-bgp-join`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-bgp-join) | Handles BGPs by delegating to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join). |
| Construct | [`@comunica/actor-query-operation-construct`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-construct) | Handles `CONSTRUCT` operations. |
| Describe subject | [`@comunica/actor-query-operation-describe-subject`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-describe-subject) | Handles `DESCRIBE` operations. |
| Distinct hash | [`@comunica/actor-query-operation-distinct-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-distinct-hash) | Handles `DISTINCT` operations through hashing. |
| Extend | [`@comunica/actor-query-operation-extend`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend) | Handles `EXTEND` operations. |
| Filter direct | [`@comunica/actor-query-operation-filter-direct`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-filter-direct) | Handles `FILTER` operations in a direct, but non-spec-compliant manner. |
| Filter Sparqlee | [`@comunica/actor-query-operation-filter-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-filter-sparqlee) | Handles `FILTER` operations using [Sparqlee](/docs/modify/advanced/sparqlee/) |
| From quad | [`@comunica/actor-query-operation-from-quad`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-from-quad) | handles `FROM` operations by considering FROM and FROM NAMED as target graph elements in quads. |
| Group | [`@comunica/actor-query-operation-group`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-group) | Handles `GROUP BY` operations. |
| Join | [`@comunica/actor-query-operation-join`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-join) | Handles join operations by delegating as inner join to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join). |
| Left join | [`@comunica/actor-query-operation-leftjoin`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-leftjoin) | Handles `OPTIONAL` operations by delegating as optional join to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join). |
| Minus | [`@comunica/actor-query-operation-minus`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-minus) | Handles `MINUS` operations by delegating as minus join to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join). |
| Order by direct | [`@comunica/actor-query-operation-orderby-direct`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-orderby-direct) | Handles `ORDER BY` operations in a direct, but non-spec-compliant manner. |
| Order by Sparqlee | [`@comunica/actor-query-operation-orderby-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-orderby-sparqlee) | Handles `ORDER BY` operations using [Sparqlee](/docs/modify/advanced/sparqlee/) |
| Path Alt | [`@comunica/actor-query-operation-path-alt`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-alt) | Handles `alt` property path expressions. |
| Path Inv | [`@comunica/actor-query-operation-path-inv`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-inv) | Handles `inv` property path expressions. |
| Path Link | [`@comunica/actor-query-operation-path-link`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-link) | Handles `link` property path expressions. |
| Path Nps | [`@comunica/actor-query-operation-path-nps`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-nps) | Handles `nps` property path expressions. |
| Path One or more | [`@comunica/actor-query-operation-path-one-or-more`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-one-or-more) | Handles `one-or-more` property path expressions. |
| Path Seq | [`@comunica/actor-query-operation-path-seq`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-seq) | Handles `seq` property path expressions. |
| Path Zero or more | [`@comunica/actor-query-operation-path-zero-or-more`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-zero-or-more) | Handles `zero-or-more` property path expressions. |
| Path Zero or one | [`@comunica/actor-query-operation-path-zero-or-one`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-path-zero-or-one) | Handles `zero-or-one` property path expressions. |
| Project | [`@comunica/actor-query-operation-project`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-project) | Handles `SELECT` operations. |
| Quad pattern | [`@comunica/actor-query-operation-quadpattern`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-quadpattern) | Handles triple/quad patterns. |
| Reduced hash | [`@comunica/actor-query-operation-reduced-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-reduced-hash) | Handles `REDUCED` operations through hashing. |
| Service | [`@comunica/actor-query-operation-service`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-service) | Handles `SERVICE` operations. |
| Slice | [`@comunica/actor-query-operation-slice`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-slice) | Handles `LIMIT` and `OFFSET` operations. |
| SPARQL endpoint | [`@comunica/actor-query-operation-sparql-endpoint`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-sparql-endpoint) | Delegates a full SPARQL query to a SPARQL endpoint if there is only a single SPARQL endpoint source. |
| Union | [`@comunica/actor-query-operation-union`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-union) | Handles `UNION` operations. |
| Values | [`@comunica/actor-query-operation-values`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-values) | Handles `VALUES` operations. |
| Update Add | [`@comunica/actor-query-operation-update-add-rewrite`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-add-rewrite) | Handles `ADD` operations by rewriting the operation in terms of an insert. |
| Update Clear | [`@comunica/actor-query-operation-update-clear`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-clear) | Handles `CLEAR` operations. |
| Update Composite Update | [`@comunica/actor-query-operation-update-compositeupdate`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-compositeupdate) | Handles `composition of multiple SPARQL update operations. |
| Update Copy | [`@comunica/actor-query-operation-update-copy-rewrite`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-copy-rewrite) | Handles `COPY` operations by rewriting the operation in terms of drop and add. |
| Update Create | [`@comunica/actor-query-operation-update-create`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-create) | Handles `CREATE` operations. |
| Update Delete Insert | [`@comunica/actor-query-operation-update-deleteinsert`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-deleteinsert) | Handles `INSERT DATA`, `DELETE DATA`, and `INSERT/DELETE` operations. |
| Update Drop | [`@comunica/actor-query-operation-update-drop`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-drop) | Handles `DROP` operations. |
| Update Load | [`@comunica/actor-query-operation-update-load`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-load) | Handles `LOAD` operations. |
| Update Move | [`@comunica/actor-query-operation-update-move-rewrite`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-update-move-rewrite) | Handles `COPY` operations by rewriting the operation in terms of drop and add. |

## Query Serialize

_Package: [`@comunica/bus-query-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-query-serialize)_

Serializes the query result into a text-based serialization.

Subscribed actors need to implement [`ActorQuerySerialize`](https://comunica.github.io/comunica/classes/bus_query_serialize.actorqueryserialize.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| JSON | [`@comunica/actor-query-serialize-json`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-json) | Serializes to a simple JSON format. |
| RDF | [`@comunica/actor-query-serialize-rdf`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-rdf) | Serializes to an RDF format by delegating to [`@comunica/bus-rdf-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-serialize). |
| Simple | [`@comunica/actor-query-serialize-simple`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-) | Serializes to a simple format. |
| SPARQL CSV | [`@comunica/actor-query-serialize-sparql-csv`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-csv) | Serializes to SPARQL/CSV. |
| SPARQL JSON | [`@comunica/actor-query-serialize-sparql-json`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-json) | Serializes to SPARQL/JSON. |
| SPARQL TSV | [`@comunica/actor-query-serialize-sparql-tsv`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-tsv) | Serializes to SPARQL/TSV. |
| SPARQL XML | [`@comunica/actor-query-serialize-sparql-xml`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-xml) | Serializes to SPARQL/XML. |
| Stats | [`@comunica/actor-query-serialize-stats`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-stats) | Serializes basic statistics. |
| Table | [`@comunica/actor-query-serialize-table`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-table) | Serializes in a simple table format. |
| Tree | [`@comunica/actor-query-serialize-tree`](https://github.com/comunica/comunica/tree/master/packages/actor-query-serialize-tree) | Serializes to a JSON tree. |


## RDF Serialize

_Package: [`@comunica/bus-rdf-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-serialize)_

Serializes quads to an RDF serialization format.

Subscribed actors need to implement [`ActorRdfSerialize`](https://comunica.github.io/comunica/classes/bus_rdf_serialize.ActorRdfSerialize.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| JSON-LD | [`@comunica/actor-rdf-serialize-jsonld`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-serialize-jsonld) | Serializes to JSON-LD. |
| N3 | [`@comunica/actor-rdf-serialize-n3`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-serialize-n3) | Serializes to Turtle, Trig, N-triples, or N-Quads. |


## RDF Join

_Package: [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join)_

Handles joining of bindings streams.

It supports different logical join types, such as inner, optional, and minus joins.

Subscribed actors need to implement [`ActorRdfJoin`](https://comunica.github.io/comunica/classes/bus_rdf_join.ActorRdfJoin.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Inner Hash | [`@comunica/actor-rdf-join-inner-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-hash) | Inner hash join of two entries. |
| Inner Nested loop | [`@comunica/actor-rdf-join-inner-nestedloop`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-nestedloop) | Inner nested loop join of two entries. |
| Inner None | [`@comunica/actor-rdf-join-inner-none`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-none) | Inner join between zero entries, and returns a single binding. |
| Inner Single | [`@comunica/actor-rdf-join-inner-single`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-single) | Inner join of a single entry, and returns the entry itself. |
| Inner Symmetric hash | [`@comunica/actor-rdf-join-inner-symmetrichash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-symmetrichash) | Inner symmetric hash join of two entries. |
| Inner Multi empty | [`@comunica/actor-rdf-join-inner-multi-empty`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-empty) | Inner multi-join that accepts any number of inner-join entries of which at least one is empty and returns an empty stream. |
| Inner Multi Bind | [`@comunica/actor-rdf-join-inner-multi-bind`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-bind) | Inner multi-join that inner-joins 2 or more streams by picking the one with the lowest cardinality, binding each item with the remaining operations, and recursively resolving those operations by delegating to [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation). |
| Inner Multi sequential | [`@comunica/actor-rdf-join-inner-multi-sequential`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-sequential) | Inner multi-join by just picking the two of them hierarchically. |
| Inner Multi smallest | [`@comunica/actor-rdf-join-inner-multi-smallest`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-inner-multi-smallest) | Inner multi-join by always picking the first two streams with smallest estimate cardinality. |
| Minus Hash | [`@comunica/actor-rdf-join-minus-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-minus-hash) | Anti-join (minus) of 2 streams using the hash join algorithm. This actor does _not_ support streams that can have undefined values. |
| Minus Hash undef | [`@comunica/actor-rdf-join-minus-hash-undef`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-minus-hash-undef) | Anti-join (minus) of 2 streams using the hash join algorithm. This actor supports streams that can have undefined values. |
| Optional Bind | [`@comunica/actor-rdf-join-optional-bind`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-optional-bind) | Left-join (optional) 2 streams using the bind join algorithm. It binds each item of the first stream with the second operation, and recursively resolving that operation by delegating to [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation). |
| Optional Nested loop | [`@comunica/actor-rdf-join-optional-nestedloop`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-optional-nestedloop) | Left-join (optional) 2 streams using the nested loop join algorithm. |


## RDF Join Entries Sort

_Package: [`@comunica/bus-rdf-join-entries-sort`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join-entries-sort)_

Determines the order in which join entries should be ordered.

Subscribed actors need to implement [`ActorRdfJoinEntriesSort`](https://comunica.github.io/comunica/classes/bus_rdf_join_entries_sort.ActorRdfJoinEntriesSort.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Cardinality | [`@comunica/actor-rdf-join-entries-sort-cardinality`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-entries-sort-cardinality) | Orders join entries by increasing cardinality. |


## RDF Join Selectivity

_Package: [`@comunica/bus-rdf-join-selectivity`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join-selectivity)_

Calculates or estimates the selectivity of joins.

Subscribed actors need to implement [`ActorRdfJoinSelectivity`](https://comunica.github.io/comunica/classes/bus_rdf_join_selectivity.ActorRdfJoinSelectivity.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Variable Counting | [`@comunica/actor-rdf-join-selectivity-variable-counting`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-selectivity-variable-counting) | Estimates the selectivity by counting the overlap of variables and non-variables in patterns. |


## RDF Resolve Quad Pattern

_Package: [`@comunica/bus-rdf-resolve-quad-pattern`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-quad-pattern)_

Translates a quad pattern into a stream of quad.

Subscribed actors need to implement [`ActorRdfResolveQuadPattern`](https://comunica.github.io/comunica/classes/bus_rdf_resolve_quad_pattern.ActorRdfResolveQuadPattern.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Federated | [`@comunica/actor-rdf-resolve-quad-pattern-federated`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-federated) | Translates the array of sources in the [query context](/docs/query/advanced/context/) into the union of quad streams by resolving each source separately in the *RDF Resolve Quad Pattern* bus. |
| Hypermedia | [`@comunica/actor-rdf-resolve-quad-pattern-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-hypermedia) | Resolves the quad stream of a resource by interpreting hypermedia links and controls. |
| RDF/JS Source | [`@comunica/actor-rdf-resolve-quad-pattern-rdfjs-source`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-rdfjs-source) | Resolves the quad stream from an [RDF/JS Source](/docs/query/advanced/rdfjs_querying/) |


## Dereference

_Package: [`@comunica/bus-dereference`](https://github.com/comunica/comunica/tree/master/packages/bus-dereference)_

Dereferences a path or URL into a (generic) stream.

Subscribed actors need to implement [`ActorDereference`](https://comunica.github.io/comunica/classes/bus_dereference.ActorDereference.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| File | [`@comunica/actor-dereference-file`](https://github.com/comunica/comunica/tree/master/packages/actor-dereference-file) | Dereferences a local file. |
| HTTP | [`@comunica/actor-dereference-http-parse`](https://github.com/comunica/comunica/tree/master/packages/actor-dereference-http-parse) | Dereferences a remote file. |


## Dereference RDF

_Package: [`@comunica/bus-dereference-rdf`](https://github.com/comunica/comunica/tree/master/packages/bus-dereference-rdf)_

Dereferences a path or URL into a stream of quads.

Subscribed actors need to implement [`ActorDereferenceRdf`](https://comunica.github.io/comunica/classes/bus_dereference_rdf.ActorDereferenceRdf.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Parse | [`@comunica/actor-dereference-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/actor-dereference-rdf-parse) | Dereferences RDF using [`@comunica/bus-dereference`](https://github.com/comunica/comunica/tree/master/packages/bus-dereference). Invokes parsing with [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse). |


## RDF Parse

_Package: [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse)_

Parses quads from a serialization format.

Subscribed actors need to implement [`ActorRdfParse`](https://comunica.github.io/comunica/classes/bus_rdf_parse.ActorRdfParse.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| HTML | [`@comunica/actor-rdf-parse-html`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html) | Parses HTML documents by delegating to [`@comunica/bus-rdf-parse-html`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse-html). |
| JSON-LD | [`@comunica/actor-rdf-parse-jsonld`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-jsonld) | Parses JSON-LD. |
| N3 | [`@comunica/actor-rdf-parse-n3`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-n3) | Parses Turtle, Trig, N-triples, or N-Quads. |
| RDF/XML | [`@comunica/actor-rdf-parse-rdfxml`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-rdfxml) | Parses RDF/XML. |
| XML RDFa | [`@comunica/actor-rdf-parse-xml-rdfa`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-xml-rdfa) | Parses RDFa in XML. |


## RDF Parse HTML

_Package: [`@comunica/bus-rdf-parse-html`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse-html)_

Parses quads from an HTML document.

Subscribed actors need to implement [`ActorRdfParseHtml`](https://comunica.github.io/comunica/classes/bus_rdf_parse_html.ActorRdfParseHtml.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| RDFa | [`@comunica/actor-rdf-parse-html-rdfa`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html-rdfa) | Parses RDFa. |
| Microdata | [`@comunica/actor-rdf-parse-html-microdata`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html-microdata) | Parses Microdata to RDF. |
| Script | [`@comunica/actor-rdf-parse-html-script`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html-script) | Parses script tags and attempts to parse them by delegating to [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse). |


## HTTP

_Package: [`@comunica/bus-http`](https://github.com/comunica/comunica/tree/master/packages/bus-http)_

Performs HTTP(S) requests.

Subscribed actors need to implement [`ActorHttp`](https://comunica.github.io/comunica/classes/bus_http.ActorHttp.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Memento | [`@comunica/actor-http-memento`](https://github.com/comunica/comunica/tree/master/packages/actor-http-memento) | Implements the [Memento protocol](/docs/query/advanced/memento/). |
| Native | [`@comunica/actor-http-native`](https://github.com/comunica/comunica/tree/master/packages/actor-http-native) | Performs requests using Node's request library. |
| Fetch | [`@comunica/actor-http-fetch`](https://github.com/comunica/comunica/tree/master/packages/actor-http-fetch) | Performs requests using the fetch API. |
| Proxy | [`@comunica/actor-http-proxy`](https://github.com/comunica/comunica/tree/master/packages/actor-http-proxy) | Run requests through a proxy. |


## HTTP Invalidate

_Package: [`@comunica/bus-http-invalidate`](https://github.com/comunica/comunica/tree/master/packages/bus-http-invalidate)_

A bus for HTTP invalidation events.

Subscribed actors need to implement [`ActorHttpInvalidate`](https://comunica.github.io/comunica/classes/bus_http.ActorHttp.html).


## RDF Metadata

_Package: [`@comunica/bus-rdf-metadata`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata)_

Extracts the quads relevant for metadata from the stream of data quads.

Subscribed actors need to implement [`ActorRdfMetadata`](https://comunica.github.io/comunica/classes/bus_rdf_metadata.ActorRdfMetadata.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| All | [`@comunica/actor-rdf-metadata-all`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-all) | Considers all incoming quads as both data and metadata quads. |
| Primary topic | [`@comunica/actor-rdf-metadata-primary-topic`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-primary-topic) | Splits off the metadata based on the existence of a `foaf:primaryTopic` link. |


## RDF Metadata Extract

_Package: [`@comunica/bus-rdf-metadata-extract`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata-extract)_

Create an object with metadata for a given metadata quad stream.

Subscribed actors need to implement [`ActorRdfMetadataExtract`](https://comunica.github.io/comunica/classes/bus_rdf_metadata_extract.ActorRdfMetadataExtract.html).

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


## RDF Resolve Hypermedia Links

_Package: [`@comunica/bus-rdf-resolve-hypermedia-links`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-hypermedia-links)_

Determines which links should be followed from the metadata of the current source.

Subscribed actors need to implement [`ActorRdfResolveHypermediaLinks`](https://comunica.github.io/comunica/classes/bus_rdf_resolve_hypermedia_links.ActorRdfResolveHypermediaLinks.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Next | [`@comunica/actor-rdf-resolve-hypermedia-links-next`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-links-next) | Follow next page links. |

## RDF Resolve Hypermedia Links Queue

_Package: [`@comunica/bus-rdf-resolve-hypermedia-links-queue`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-hypermedia-links-queue)_

Creates [`ILinkQueue`](https://comunica.github.io/comunica/interfaces/bus_rdf_resolve_hypermedia_links_queue.ilinkqueue.html) instances,
which enables different strategies for queueing links.

Subscribed actors need to implement [`ActorRdfResolveHypermediaLinksQueue`](https://comunica.github.io/comunica/classes/bus_rdf_resolve_hypermedia_links_queue.ActorRdfResolveHypermediaLinksQueue.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| FIFO | [`@comunica/actor-rdf-resolve-hypermedia-links-queue-fifo`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-links-queue-fifo) | Provides a link queue following the first in, first out strategy |


## RDF Resolve Hypermedia

_Package: [`@comunica/bus-rdf-resolve-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-hypermedia)_

Handle a source based on the extracted metadata.

Subscribed actors need to implement [`ActorRdfResolveHypermedia`](https://comunica.github.io/comunica/classes/bus_rdf_resolve_hypermedia.ActorRdfResolveHypermedia.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| None | [`@comunica/actor-rdf-resolve-hypermedia-none`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-none) | The source is considered a raw RDF file, for which all data quads matching the quad pattern are returned. |
| QPF | [`@comunica/actor-rdf-resolve-hypermedia-qpf`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-qpf) | The source is considered a [Triple/Quad Pattern Fragments](https://linkeddatafragments.org/) interface. |
| SPARQL | [`@comunica/actor-rdf-resolve-hypermedia-sparql`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-sparql) | The source is considered a SPARQL endpoint if it has a service description, for which we use the SPARQL protocol. |

## RDF Update Quads

_Package: [`@comunica/bus-rdf-update-quads`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-update-quads)_

Handle the insertion and deletion of streams of quads for a given destination type.

Subscribed actors need to implement [`ActorRdfUpdateQuads`](https://comunica.github.io/comunica/classes/bus_rdf_update_quads.ActorRdfUpdateQuads.html)
or [`ActorRdfUpdateQuadsDestination`](https://comunica.github.io/comunica/classes/bus_rdf_update_quads.ActorRdfUpdateQuadsDestination.html)

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| RDF/JS Store | [`@comunica/actor-rdf-update-quads-rdfjs-store`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-update-quads-rdfjs-store) | The destination is considered an [RDF/JS Store](https://comunica.dev/docs/query/advanced/rdfjs_querying/). |
| Hypermedia | [`@comunica/actor-rdf-update-quads-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-update-quads-hypermedia) | The destination that handles updates by interpreting hypermedia links and controls. |


## RDF Update Hypermedia

_Package: [`@comunica/bus-rdf-update-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-update-hypermedia)_

Handle a destination based on the extracted metadata.

Subscribed actors need to implement [`ActorRdfUpdateHypermedia`](https://comunica.github.io/comunica/classes/bus_rdf_update_hypermedia.ActorRdfUpdateHypermedia.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| SPARQL | [`@comunica/actor-rdf-update-hypermedia-patch-sparql-update`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-update-hypermedia-patch-sparql-update) | The destination is considered an HTTP APIs accepting `PATCH` requests containing SPARQL Update queries (`application/sparql-update`), such as [Solid servers](https://github.com/solid/solid-spec/blob/master/api-rest.md#alternative-using-sparql-1). |
