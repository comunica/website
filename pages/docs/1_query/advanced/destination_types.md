---
title: 'Destination types'
description: 'Comunica detects and handles different types of destinations.'
---

Comunica SPARQL supports _update_ queries to add, delete, or change data
on both the [command line](/docs/query/getting_started/update_cli/)
and when [calling Comunica from a JavaScript application](/docs/query/getting_started/update_app/).

Update queries typically consists of two parts:

1. Query pattern to select data from a [_source_](/docs/query/advanced/source_types/);
2. Quads to add or delete based on the query pattern into a _destination_.

In most cases, the _source_ and _destination_ are equal,
such as when modifying data in [an in-memory RDF/JS Store](/docs/query/advanced/rdfjs_updating/).

Since Comunica decouples _source_ and _destination_,
it is possible to _read_ data from one place, and _apply changes_ in another place.

Usually, destinations are passed as URLs that point to Web resources.
Based on what is returned when _dereferencing_ this URL,
Comunica can apply different update algorithms.

Instead of relying on Comunica's detection algorithms,
you can **enforce** the use of a certain type.

<div class="note">
Some SPARQL endpoints may be recognised as a file instead of a SPARQL endpoint due to them not supporting <a href="https://www.w3.org/TR/sparql11-service-description/">SPARQL Service Description</a>,
which may produce incorrect results. For these cases, the <code>sparql</code> type MUST be set.
</div>

<div class="note">
When enabling the <a href="/docs/modify/advanced/logging/"><code>info</code> logger</a>,
you can derive what type Comunica has determined for each destination.
</div>

## Setting destination type on the command line

Destination types can optionally be enforced by prefixing the URL with `<typeName>@`, such as

```bash
$ comunica-sparql https://example.org/file-in.ttl \
    --to patchSparqlUpdate@https://example.org/file-out.ttl \
    "INSERT DATA { <ex:s> <ex:p> <ex:o> }"
```

## Setting destination type in an application

Via a [JavaScript application](/docs/query/getting_started/query_app/),
the destination type can be set by using a hash containing `type` and `value`:
```javascript
const result = await myEngine.query(`...`, {
  sources: [
    { type: 'file', value: 'https://example.org/file-in.ttl' },
  ],
  destination: { type: 'patchSparqlUpdate', value: 'https://example.org/file-out.ttl' },
});
```

## Supported destination types

The table below summarizes the different destination types that Comunica supports by default:

| **Type name** | **Description** |
| ------- | --------------- |
| `rdfjsStore` | JavaScript objects implementing the [RDF/JS `store` interface](/docs/query/advanced/rdfjs_updating/) |
| `sparql` | [SPARQL endpoint](https://www.w3.org/TR/sparql11-protocol/) |
| `putLdp` | [Linked Data Platform](https://www.w3.org/TR/ldp/) HTTP APIs accepting `PUT` requests containing an RDF document, such as [Solid servers](https://github.com/solid/solid-spec/blob/master/api-rest.md#alternative-using-sparql-1). |
| `patchSparqlUpdate` | [Linked Data Platform](https://www.w3.org/TR/ldp/) HTTP APIs accepting `PATCH` requests containing SPARQL Update queries (`application/sparql-update`), such as [Solid servers](https://github.com/solid/solid-spec/blob/master/api-rest.md#alternative-using-sparql-1). |

The default source type is `auto`,
which will automatically detect the proper source type.
For example, if an `Accept-Patch: application/sparql-update` header
is detected, the `patchSparqlUpdate` type is used.
