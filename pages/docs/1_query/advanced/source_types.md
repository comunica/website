---
title: 'Source types'
description: 'Comunica detects and handles different types of sources.'
---

Comunica SPARQL enables query execution over one or more sources
on both the [command line](/docs/query/getting_started/query_cli/)
and when [calling Comunica from a JavaScript application](/docs/query/getting_started/query_app/).

Usually, sources are passed as URLs that point to Web resources.
Based on what is returned when _dereferencing_ this URL,
Comunica can apply different query algorithms.

Instead of relying on Comunica's detection algorithms,
you can **enforce** the use of a certain type.

<div class="note">
Some SPARQL endpoints may be recognised as a file instead of a SPARQL endpoint due to them not supporting <a href="https://www.w3.org/TR/sparql11-service-description/">SPARQL Service Description</a>,
which may produce incorrect results. For these cases, the <code>sparql</code> type MUST be set.
</div>

<div class="note">
When enabling the <a href="/docs/modify/advanced/logging/"><code>info</code> logger</a>,
you can derive what type Comunica has determined for each source.
</div>

## Setting source type on the command line

On the [command line](/docs/query/getting_started/query_cli/), source types can optionally be enforced by prefixing the URL with `<typeName>@`, such as:
```bash
$ comunica-sparql sparql@https://dbpedia.org/sparql \
    "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```

## Setting source type in an application

Via a [JavaScript application](/docs/query/getting_started/query_app/),
the source type can be set by using a hash containing `type` and `value`:
```javascript
const bindingsStream = await myEngine.queryBindings(`...`, {
  sources: [
    { type: 'sparql', value: 'https://dbpedia.org/sparql' },
  ],
});
```

## Supported source types

The table below summarizes the different source types that Comunica supports by default:

| **Type name** | **Description**                                                                                                                                                                                                                                                                |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`        | plain RDF file in any RDF serialization, such as [Turtle](https://www.w3.org/TR/turtle/), [TriG](https://www.w3.org/TR/trig/), [JSON-LD](https://json-ld.org/), [RDFa](https://www.w3.org/TR/rdfa-primer/), ...                                                                |
| `sparql`      | [SPARQL endpoint](https://www.w3.org/TR/sparql11-protocol/)                                                                                                                                                                                                                    |
| `hypermedia`  | Sources that expose query capabilities via hypermedia metadata, such as [Triple Pattern Fragments](https://linkeddatafragments.org/specification/triple-pattern-fragments/) and [Quad Pattern Fragments](https://linkeddatafragments.org/specification/quad-pattern-fragments/) |
| `qpf`         | A hypermedia source that is enforced as [Triple Pattern Fragments](https://linkeddatafragments.org/specification/triple-pattern-fragments/) or [Quad Pattern Fragments](https://linkeddatafragments.org/specification/quad-pattern-fragments/)                                 |
| `brtpf`       | A hypermedia source that is enforced as [bindings-restricted Triple Pattern Fragments](https://arxiv.org/abs/1608.08148)                                                                                                                                                       |
| `rdfjs`       | JavaScript objects implementing the [RDF/JS `source` interface](/docs/query/advanced/rdfjs_querying/)                                                                                                                                                                          |
| `serialized`  | An RDF dataset serialized as a string in a certain format.                                                                                                                                                                                                                     |
| `hdtFile`     | [HDT files](/docs/query/advanced/hdt/)                                                                                                                                                                                                                                         |
| `ostrichFile` | Versioned [OSTRICH archives](https://github.com/rdfostrich/comunica-query-sparql-ostrich)                                                                                                                                                                                      |

The default source type is `auto`,
which will automatically detect the proper source type.
For example, if a [SPARQL Service Description](https://www.w3.org/TR/sparql11-service-description/)
is detected, the `sparql` type is used.

## RDF serializations

Comunica will interpret the `Content-Type` header of HTTP responses to determine used RDF serialization.
If the server did not provide such a header, Comunica will attempt to derive the serialization based on the extension.

The following RDF serializations are supported:

| **Name** | **Content type** | **Extensions** |
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

## String source

String-based sources allow you to query over sources that are represented as a string in a certain RDF serialization.

For example, querying over a Turtle-based datasource:
```javascript
const bindingsStream = await myEngine.queryBindings(`...`, {
  sources: [
    {
      type: 'serialized',
      value: '<ex:s> <ex:p> <ex:o>. <ex:s> <ex:p2> <ex:o2>.',
      mediaType: 'text/turtle',
      baseIRI: 'http://example.org/',
    },
  ],
});
```
