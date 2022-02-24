---
title: 'RDF Parsing and Serializing'
description: 'Basic concepts behind parsing and serializing RDF.'
---

Parsing from and serializing to RDF is of great importance within Comunica,
as Comunica needs to be able to query over RDF files in different formats,
and produce RDF query results in different formats.

For this, Comunica provides the
[RDF Parse](/docs/modify/advanced/buses/#rdf-parse) ([`@comunica/bus-rdf-parse`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-parse))
and
[RDF Serialize](/docs/modify/advanced/buses/#rdf-serialize) ([`@comunica/bus-rdf-serialize`](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-serialize)) bus.
These buses respectively contain spec-compliant **streaming** [parsers](/docs/query/advanced/specifications/#parsing-rdf)
and [serializers](/docs/query/advanced/specifications/#serializing-rdf) for the most important RDF formats.

## Calling a parser

RDF parsing actors implement the [`ActorRdfParse`](https://comunica.github.io/comunica/classes/bus_rdf_parse.actorrdfparse.html) abstract class,
which can handle two types of actions:

* Retrieval of supported media types (`mediaTypes`), such as `'text/turtle'`, `application/ld+json`, ...
* Parsing for a given media type (`handle`).

While the first action can be used to determine all available media types that can be parsed across all actors in a bus,
the second action is typically used afterwards to parse RDF for a specific media type.

Since there are two types of actions, calling an RDF parser involves two respective mediators.
An example of such two mediators can be found in [`dereference-rdf/actors.json`](https://github.com/comunica/comunica/blob/master/engines/config-query-sparql/config/dereference-rdf/actors.json).
In TypeScript, these mediators will correspond to the following fields:
```typescript
public readonly mediatorRdfParseMediatypes: MediateMediaTypes;
public readonly mediatorRdfParseHandle: MediateMediaTyped<
  IActionParse<IActionRdfParseMetadata>,
  IActorTest,
  IActorParseOutput<RDF.Stream, IActorRdfParseOutputMetadata>
>;
```

All available media types can be retrieved as follows:
```typescript
const { mediaTypes } = await this.mediatorRdfParseMediatypes.mediate(
  { context, mediaTypes: true },
);
```

Parsing for a specific media type can be done as follows:
```typescript
const { quads } = (await this.mediatorRdfParseHandle.mediate(
  {
    context,
    handle: {
      context,
      headers: undefined, // Optional HTTP fetch headers
      input: textStream,
      metadata: { baseIRI: 'http://example.org/' },
    },
    handleMediaType: 'text/turtle',
  },
)).handle;
```
Input `quadStream` must always be a text stream,
output `quads` is am [RDF/JS stream](/docs/query/advanced/rdfjs/).

More examples on how these parses are used can be found
in actors on the [Dereference RDF bus](/docs/modify/advanced/buses/#dereference-rdf)
or in the [rdf-parse.js package](https://github.com/rubensworks/rdf-parse.js).

## Calling a serializer

RDF serialzation actors implement the [`ActorRdfSerialize`](https://comunica.github.io/comunica/classes/bus_rdf_serialize.actorrdfserialize.html),
which can handle two types of actions:

* Retrieval of supported media types (`mediaTypes`), such as `'text/turtle'`, `application/ld+json`, ...
* Retrieval of supported media types as URLs (`mediaTypeFormats`), such as `http://www.w3.org/ns/formats/N3`, `http://www.w3.org/ns/formats/JSON-LD`, ...
* Parsing for a given media type (`handle`).

The first action can be used to determine all available media types that can be parsed across all actors in a bus,
the second action is used to identify media types by URL in things like SPARQL service descriptions,
and the third action is typically used afterwards to parse RDF for a specific media type.

Since there are three types of actions, calling an RDF serializer involves three respective mediators.
An example of such two mediators can be found in [`sparql-serializers.json`](https://github.com/comunica/comunica/blob/master/engines/query-sparql/config/sets/sparql-serializers.json).
In TypeScript, these mediators will correspond to the following fields:
```typescript
public readonly mediatorRdfSerialize: MediatorRdfSerializeHandle;
public readonly mediatorMediaTypeCombiner: MediatorRdfSerializeMediaTypes;
public readonly mediatorMediaTypeFormatCombiner: MediatorRdfSerializeMediaTypeFormats;
```

All available media types can be retrieved as follows:
```typescript
const { mediaTypes } = await this.mediatorMediaTypeCombiner.mediate(
  { context, mediaTypes: true },
);
```

All available media type URLs can be retrieved as follows:
```typescript
const { mediaTypeFormats } = await this.mediatorMediaTypeFormatCombiner.mediate(
  { context, mediaTypeFormats: true },
);
```

Serializing for a specific media type can be done as follows:
```typescript
const { data } = (await this.mediatorRdfSerialize.mediate({
  context,
  handle: {
    type: 'quads',
    quadStream, // An RDF/JS Stream of RDF/JS quads.
  },
  handleMediaType: 'text/turtle',
})).handle
```
Input `quadStream` must always be an [RDF/JS stream](/docs/query/advanced/rdfjs/),
output `data` is a text stream.

More examples on how these parses are used can be found
in the [SPARQL RDF Serialize actor](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf).
