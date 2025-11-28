---
title: 'Supported specifications'
description: 'Comunica supports several RDF-related specifications'
---

This page summarizes the specifications Comunica implements.

## Query standards

The following standard query specifications are supported:

| **Description**                                                                                                          |
|--------------------------------------------------------------------------------------------------------------------------|
| [SPARQL 1.2 Query Language](https://www.w3.org/TR/sparql12-query/)                                                       |
| [SPARQL 1.2 Update](https://www.w3.org/TR/sparql12-update/)                                                              |
| [SPARQL 1.2 Service Description](https://www.w3.org/TR/sparql12-service-description/)                                    |
| [SPARQL 1.2 Federated Query](https://www.w3.org/TR/sparql12-federated-query/)                                            |
| [SPARQL 1.2 Query Results JSON Format](https://www.w3.org/TR/sparql12-results-json/)                                     |
| [SPARQL 1.2 Query Results XML Format](https://www.w3.org/TR/sparql12-results-xml/)                                       |
| [SPARQL 1.2 Query Results CSV and TSV Formats](https://www.w3.org/TR/sparql12-results-csv-tsv/)                          |
| [SPARQL 1.2 Protocol](https://www.w3.org/TR/sparql12-protocol/)                                                          |
| [SPARQL next SEP 0002 - Excluding ADJUST function](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md) |

The following notable specifications are not supported _yet_:

| **Description**                                                                         |
|-----------------------------------------------------------------------------------------|
| [SPARQL 1.2 Entailment Regimes](https://www.w3.org/TR/sparql12-entailment/)             |
| [SPARQL 1.2 Graph Store HTTP Protocol](https://www.w3.org/TR/sparql12-http-rdf-update/) |

## Serializing SPARQL results

SPARQL query results can be serialized in [different formats](/docs/query/advanced/result_formats/).
For all of these supported formats, the following are standards:

| **Media type** | **Description**                                                                   |
| ------- |-----------------------------------------------------------------------------------|
| [`application/sparql-results+json`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-sparql-json) | The [SPARQL/JSON](https://www.w3.org/TR/sparql12-results-json/) results format.   |
| [`application/sparql-results+xml`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-sparql-xml) | The [SPARQL/XML](https://www.w3.org/TR/sparql12-results-xml/) results format.     |
| [`text/csv`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-sparql-csv) | The [SPARQL/CSV](https://www.w3.org/TR/sparql12-results-csv-tsv/) results format. |
| [`text/tab-separated-values`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-sparql-tsv) | The [SPARQL/TSV](https://www.w3.org/TR/sparql12-results-csv-tsv/) results format. |

<div class="note">
All serializers work in a <i>streaming</i> manner.
</div>

Next to these, RDF serializations are supported, as shown below.

## Serializing RDF

RDF triples/quads can be serialized via the following RDF serializations:

| **Media type** | **Description** |
| ------- | --------------- |
| [`application/trig`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [TriG](https://www.w3.org/TR/trig/) RDF serialization. |
| [`application/n-quads`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [N-Quads](https://www.w3.org/TR/n-quads/) RDF serialization. |
| [`text/turtle`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [Turtle](https://www.w3.org/TR/turtle/) RDF serialization. |
| [`application/n-triples`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [N-Triples](https://www.w3.org/TR/n-triples/) RDF serialization. |
| [`text/n3`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [Notation3](https://www.w3.org/TeamSubmission/n3/) serialization. |
| [`application/ld+json`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [JSON-LD](https://json-ld.org/) RDF serialization. |

<div class="note">
All serializers work in a <i>streaming</i> manner.
</div>

## Parsing RDF

RDF triples/quads can be provided as input via the following RDF serializations:

| **Name** | **Media type** | **Extensions** |
| -------- | ---------------- | ------------- |
| [TriG](https://www.w3.org/TR/trig/) | `application/trig` | `.trig` |
| [N-Quads](https://www.w3.org/TR/n-quads/) | `application/n-quads` | `.nq`, `.nquads` |
| [Turtle](https://www.w3.org/TR/turtle/) | `text/turtle` | `.ttl`, `.turtle` |
| [N-Triples](https://www.w3.org/TR/n-triples/) | `application/n-triples` | `.nt`, `.ntriples` |
| [Notation3](https://www.w3.org/TeamSubmission/n3/) | `text/n3` | `.n3` |
| [JSON-LD](https://json-ld.org/) | `application/ld+json`, `application/json` | `.json`, `.jsonld` |
| [RDF/XML](https://www.w3.org/TR/rdf-syntax-grammar/) | `application/rdf+xml` | `.rdf`, `.rdfxml`, `.owl` |
| [RDFa](https://www.w3.org/TR/rdfa-in-html/) and script RDF data tags [HTML](https://html.spec.whatwg.org/multipage/)/[XHTML](https://www.w3.org/TR/xhtml-rdfa/) | `text/html`, `application/xhtml+xml` | `.html`, `.htm`, `.xhtml`, `.xht` |
| [RDFa](https://www.w3.org/TR/2008/REC-SVGTiny12-20081222/metadata.html#MetadataAttributes) in [SVG](https://www.w3.org/TR/SVGTiny12/)/[XML](https://html.spec.whatwg.org/multipage/) | `image/svg+xml`,`application/xml` | `.xml`, `.svg`, `.svgz` |
| [Microdata](https://w3c.github.io/microdata-rdf/) | `text/html`, `application/xhtml+xml` | `.html`, `.htm`, `.xhtml`, `.xht` |

<div class="note">
All parsers work in a <i>streaming</i> manner.
</div>

## RDF/JS

Alignment with other JavaScript libraries is achieved via the following RDF/JS specifications:

| **Description**                                                           |
|---------------------------------------------------------------------------|
| [RDF/JS Query specification](https://rdf.js.org/query-spec/)              |
| [RDF/JS Stream interfaces specification](https://rdf.js.org/stream-spec/) |
| [RDF/JS Dataset specification](https://rdf.js.org/dataset-spec/)          |
| [RDF/JS Data model specification](https://rdf.js.org/data-model-spec/)    |
