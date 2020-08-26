---
title: 'Buses'
description: 'An overview of all buses in Comunica.'
---

This page gives an **overview of all _buses_ and _actors_**
that are used in the default Comunica engines,
such as [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql)
and [Comunica SPARQL File](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql-file)
Other configurations such as [Comunica SPARQL HDT](https://github.com/comunica/comunica-actor-init-sparql-hdt) contain additional actors and buses.

This builds upon the [core architecture](/docs/modify/advanced/architecture_core/) of _actors_, _mediators_, and _buses_.
An overview of how these buses and actors are connected can be found in the [SPARQL architecture](/docs/modify/advanced/architecture_sparql/).

## Init

_Package: [`@comunica/bus-init`](https://github.com/comunica/comunica/tree/master/packages/bus-init)_

All Comunica engines start here. This is where they accept generic input parameters, such as CLI arguments.

Subscribed actors need to implement [`ActorInit`](https://comunica.github.io/comunica/classes/bus_init.actorinit-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Comunica SPARQL | [`@comunica/actor-init-sparql`](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql) | Initializes SPARQL query execution by parsing the given query, optimizing, executing, and serializing results. |


## Context Preprocess

_Package: [`@comunica/bus-context-preprocess`](https://github.com/comunica/comunica/tree/master/packages/bus-context-preprocess)_

A bus in which actors can optionally modify the [query context](/docs/query/advanced/context/).

Subscribed actors need to implement [`ActorContextPreprocess`](https://comunica.github.io/comunica/classes/bus_context_preprocess.actorcontextpreprocess-1.html).

_Contains no actors yet._


## SPARQL Parse

_Package: [`@comunica/bus-sparql-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-sparql-parse)_

Parsing an input query into SPARQL algebra.

Subscribed actors need to implement [`ActorSparqlParse`](https://comunica.github.io/comunica/classes/bus_sparql_parse.actorsparqlparse-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| SPARQL Algebra | [`@comunica/actor-sparql-parse-algebra`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-parse-algebra) | Uses [SPARQLAlgebra.js](https://github.com/joachimvh/SPARQLAlgebra.js) for parsing SPARQL query strings into SPARQL algebra. |
| GraphQL | [`@comunica/actor-sparql-parse-graphql`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-parse-graphql) | Parses GraphQL strings into SPARQL algebra following the [GraphQL-LD](/docs/query/advanced/graphql_ld/) approach. |


## Optimize Query Operation

_Package: [`@comunica/bus-optimize-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-optimize-query-operation)_

Apply optional optimizations to the SPARQL algebra before actual execution.

Subscribed actors need to implement [`ActorOptimizeQueryOperation`](https://comunica.github.io/comunica/classes/bus_optimize_query_operation.actoroptimizequeryoperation-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Join BGP | [`@comunica/actor-optimize-query-operation-join-bgp`](https://github.com/comunica/comunica/tree/master/packages/actor-optimize-query-operation-join-bgp) | Merges joins of multiple BGPs into a single BGP. |


## Query Operation

_Package: [`@comunica/bus-query-operation`](https://github.com/comunica/comunica/tree/master/packages/bus-query-operation)_

Evaluates SPARQL algebra operations.

Subscribed actors need to implement [`ActorQueryOperation`](https://comunica.github.io/comunica/classes/bus_query_operation.actorqueryoperation-1.html)
or [`ActorQueryOperationTyped`](https://comunica.github.io/comunica/classes/bus_query_operation.actorqueryoperationtyped-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Ask | [`@comunica/actor-query-operation-ask`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-ask) | Handles `ASK` operations. |
| BGP empty | [`@comunica/actor-query-operation-bgp-empty`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-bgp-empty) | Handles empty BGPs. |
| BGP left deep smallest | [`@comunica/actor-query-operation-bgp-left-deep-smallest`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-bgp-left-deep-smallest) | Handles BGPs in a left-deep manner based on the pattern with the smallest item count. |
| BGP left deep smallest sort | [`@comunica/actor-query-operation-bgp-left-deep-smallest-sort`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-bgp-left-deep-smallest-sort) | Handles BGPs in a left-deep manner based on the pattern with the smallest item count and sorting by variable count in triple patterns. |
| BGP single | [`@comunica/actor-query-operation-bgp-single`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-bgp-single) | Handles a BGP with one triple pattern. |
| Construct | [`@comunica/actor-query-operation-construct`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-construct) | Handles `CONSTRUCT` operations. |
| Describe subject | [`@comunica/actor-query-operation-describe-subject`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-describe-subject) | Handles `DESCRIBE` operations. |
| Distinct hash | [`@comunica/actor-query-operation-distinct-hash`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-distinct-hash) | Handles `DISTINCT` operations through hashing. |
| Extend | [`@comunica/actor-query-operation-extend`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend) | Handles `EXTEND` operations. |
| Filter direct | [`@comunica/actor-query-operation-filter-direct`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-filter-direct) | Handles `FILTER` operations in a direct, but non-spec-compliant manner. |
| Filter Sparqlee | [`@comunica/actor-query-operation-filter-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-filter-sparqlee) | Handles `FILTER` operations using [Sparqlee](/docs/modify/advanced/sparqlee/) |
| From quad | [`@comunica/actor-query-operation-from-quad`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-from-quad) | handles `FROM` operations by considering FROM and FROM NAMED as target graph elements in quads. |
| Group | [`@comunica/actor-query-operation-group`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-group) | Handles `GROUP BY` operations. |
| Join | [`@comunica/actor-query-operation-join`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-join) | Handles join operations by delegating to [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join). |
| Left join left deep | [`@comunica/actor-query-operation-leftjoin-left-deep`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-leftjoin-left-deep) | Handles `OPTIONAL` operations in a left-deep manner. |
| Left join nested loop | [`@comunica/actor-query-operation-leftjoin-nested-loop`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-leftjoin-nested-loop) | Handles `OPTIONAL` operations in a nested loop manner. |
| Minus | [`@comunica/actor-query-operation-minus`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-minus) | Handles `MINUS` operations. |
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


## SPARQL Serialize

_Package: [`@comunica/bus-sparql-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-sparql-serialize)_

Serializes the query result into a text-based serialization.

Subscribed actors need to implement [`ActorSparqlSerialize`](https://comunica.github.io/comunica/classes/bus_sparql_serialize.actorsparqlserialize-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| JSON | [`@comunica/actor-sparql-serialize-json`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-json) | Serializes to a simple JSON format. |
| RDF | [`@comunica/actor-sparql-serialize-rdf`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | Serializes to an RDF format by delegating to [`@comunica/bus-rdf-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-serialize). |
| Simple | [`@comunica/actor-sparql-serialize-simple`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-) | Serializes to a simple format. |
| SPARQL CSV | [`@comunica/actor-sparql-serialize-sparql-csv`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-csv) | Serializes to SPARQL/CSV. |
| SPARQL JSON | [`@comunica/actor-sparql-serialize-sparql-json`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-json) | Serializes to SPARQL/JSON. |
| SPARQL TSV | [`@comunica/actor-sparql-serialize-sparql-tsv`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-tsv) | Serializes to SPARQL/TSV. |
| SPARQL XML | [`@comunica/actor-sparql-serialize-sparql-xml`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-xml) | Serializes to SPARQL/XML. |
| Stats | [`@comunica/actor-sparql-serialize-stats`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-stats) | Serializes basic statistics. |
| Table | [`@comunica/actor-sparql-serialize-table`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-table) | Serializes in a simple table format. |
| Tree | [`@comunica/actor-sparql-serialize-tree`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-tree) | Serializes to a JSON tree. |


## RDF Serialize

_Package: [`@comunica/bus-rdf-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-serialize)_

Serializes quads to an RDF serialization format.

Subscribed actors need to implement [`ActorRdfSerialize`](https://comunica.github.io/comunica/classes/bus_rdf_serialize.actorrdfserialize-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| JSON-LD | [`@comunica/actor-rdf-serialize-jsonld`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-serialize-jsonld) | Serializes to JSON-LD. |
| N3 | [`@comunica/actor-rdf-serialize-n3`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-serialize-n3) | Serializes to Turtle, Trig, N-triples, or N-Quads. |


## RDF Join

_Package: [`@comunica/bus-rdf-join`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-join)_

Handles joining of bindings streams.

Subscribed actors need to implement [`ActorRdfJoin`](https://comunica.github.io/comunica/classes/bus_rdf_join.actorrdfjoin-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Hash | [`@comunica/actor-rdf-join-jsonld`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-hash) | Hash join. |
| Multi sequential | [`@comunica/actor-rdf-join-multi-sequential`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-multi-sequential) | Multi-join by just picking the two of them hierarchically. |
| Multi smallest | [`@comunica/actor-rdf-join-multi-smallest`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-multi-smallest) | Multi-join by always picking the first two streams with smallest estimate cardinality. |
| Nested loop | [`@comunica/actor-rdf-join-nestedloop`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-nestedloop) | Nested loop join. |
| Symmetric hash | [`@comunica/actor-rdf-join-symmetrichash`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-join-symmetrichash) | Symmetric hash join. |


## RDF Resolve Quad Pattern

_Package: [`@comunica/bus-rdf-resolve-quad-pattern`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-quad-pattern)_

Translates a quad pattern into a stream of quad.

Subscribed actors need to implement [`ActorRdfResolveQuadPattern`](https://comunica.github.io/comunica/classes/bus_rdf_resolve_quad_pattern.actorrdfresolvequadpattern-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Federated | [`@comunica/actor-rdf-resolve-quad-pattern-federated`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-federated) | Translates the array of sources in the [query context](/docs/query/advanced/context/) into the union of quad streams by resolving each source separately in the *RDF Resolve Quad Pattern* bus. |
| Hypermedia | [`@comunica/actor-rdf-resolve-quad-pattern-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-hypermedia) | Resolves the quad stream of a resource by interpreting hypermedia links and controls. |
| RDF/JS Source | [`@comunica/actor-rdf-resolve-quad-pattern-rdfjs-source`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-rdfjs-source) | Resolves the quad stream from an [RDF/JS Source](/docs/query/advanced/rdfjs_querying/) |


## RDF Dereference

_Package: [`@comunica/bus-rdf-dereference`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-dereference)_

Dereferences a path or URL into a stream of quads.

Subscribed actors need to implement [`ActorRdfDereference`](https://comunica.github.io/comunica/classes/bus_rdf_dereference.actorrdfdereference-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| File | [`@comunica/actor-rdf-dereference-file`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-dereference-file) | Dereferences RDF from a local file. Invokes parsing with [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse). |
| HTTP | [`@comunica/actor-rdf-dereference-http-parse`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-dereference-http-parse) | Dereferences RDF from a remote file. Invokes parsing with [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse), and HTTP lookups with [`@comunica/bus-http`](https://github.com/comunica/comunica/tree/master/packages/bus-http). |


## RDF Parse

_Package: [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse)_

Parses quads from a serialization format.

Subscribed actors need to implement [`ActorRdfParse`](https://comunica.github.io/comunica/classes/bus_rdf_parse.actorrdfparse-1.html).

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

Subscribed actors need to implement [`ActorRdfParseHtml`](https://comunica.github.io/comunica/classes/bus_rdf_parse_html.actorrdfparsehtml-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| RDFa | [`@comunica/actor-rdf-parse-html-rdfa`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html-rdfa) | Parses RDFa. |
| Script | [`@comunica/actor-rdf-parse-html-script`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-parse-html-script) | Parses script tags and attempts to parse them by delegating to [`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse). |


## HTTP

_Package: [`@comunica/bus-http`](https://github.com/comunica/comunica/tree/master/packages/bus-http)_

Performs HTTP(S) requests.

Subscribed actors need to implement [`ActorHttp`](https://comunica.github.io/comunica/classes/bus_http.actorhttp-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Memento | [`@comunica/actor-http-memento`](https://github.com/comunica/comunica/tree/master/packages/actor-http-memento) | Implements the [Memento protocol](/docs/query/advanced/memento/). |
| Native | [`@comunica/actor-http-native`](https://github.com/comunica/comunica/tree/master/packages/actor-http-native) | Performs requests using Node's request library. |
| Fetch | [`@comunica/actor-http-fetch`](https://github.com/comunica/comunica/tree/master/packages/actor-http-fetch) | Performs requests using the fetch API. |
| Proxy | [`@comunica/actor-http-proxy`](https://github.com/comunica/comunica/tree/master/packages/actor-http-proxy) | Run requests through a proxy. |


## RDF Metadata

_Package: [`@comunica/bus-rdf-metadata`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata)_

Extracts the quads relevant for metadata from the stream of data quads.

Subscribed actors need to implement [`ActorRdfMetadata`](https://comunica.github.io/comunica/classes/bus_rdf_metadata.actorrdfmetadata-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| All | [`@comunica/actor-rdf-metadata-all`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-all) | Considers all incoming quads as both data and metadata quads. |
| Primary topic | [`@comunica/actor-rdf-metadata-primary-topic`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-primary-topic) | Splits off the metadata based on the existence of a `foaf:primaryTopic` link. |
| Triple predicate | [`@comunica/actor-rdf-metadata-triple-predicate`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-triple-predicate) | Splits off the metadata based on the existence of a preconfigured set of predicates with the page url as subject. |


## RDF Metadata Extract

_Package: [`@comunica/bus-rdf-metadata-extract`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-metadata-extract)_

Create an object with metadata for a given metadata quad stream.

Subscribed actors need to implement [`ActorRdfMetadataExtract`](https://comunica.github.io/comunica/classes/bus_rdf_metadata_extract.actorrdfmetadataextract-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Hydra Controls | [`@comunica/actor-rdf-metadata-extract-hydra-controls`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-hydra-controls) | Extract controls using the Hydra vocabulary. |
| Hydra Count | [`@comunica/actor-rdf-metadata-extract-hydra-count`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-hydra-count) | Extract count estimates using the Hydra vocabulary. |
| SPARQL Service | [`@comunica/actor-rdf-metadata-extract-sparql-service`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-metadata-extract-sparql-service) | Extract SPARQL service description metadata. |


## RDF Resolve Hypermedia Links

_Package: [`@comunica/bus-rdf-resolve-hypermedia-links`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-hypermedia-links)_

Determines which links should be followed from the metadata of the current source.

Subscribed actors need to implement [`ActorRdfResolveHypermediaLinks`](https://comunica.github.io/comunica/classes/bus_rdf_resolve_hypermedia_links.actorrdfresolvehypermedialinks-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Next | [`@comunica/actor-rdf-resolve-hypermedia-links-next`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-links-next) | Follow next page links. |


## RDF Resolve Hypermedia

_Package: [`@comunica/bus-rdf-resolve-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-hypermedia)_

Handle a source based on the extracted metadata.

Subscribed actors need to implement [`ActorRdfResolveHypermedia`](https://comunica.github.io/comunica/classes/bus_rdf_resolve_hypermedia.actorrdfresolvehypermedia-1.html).

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| None | [`@comunica/actor-rdf-resolve-hypermedia-none`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-none) | The source is considered a raw RDF file, for which all data quads matching the quad pattern are returned. |
| QPF | [`@comunica/actor-rdf-resolve-hypermedia-qpf`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-qpf) | The source is considered a [Triple/Quad Pattern Fragments](https://linkeddatafragments.org/) interface. |
| SPARQL | [`@comunica/actor-rdf-resolve-hypermedia-sparql`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-hypermedia-sparql) | The source is considered a SPARQL endpoint if it has a service description, for which we use the SPARQL protocol. |
