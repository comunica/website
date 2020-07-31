---
title: 'Result formats'
description: 'Query results can be serialized in different formats.'
---

By default, Comunica has support for the following result formats:

| **Media type** | **Description** |
| ------- | --------------- |
| [`application/json`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-json) | A custom, simplified JSON result format. |
| [`simple`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-simple) | A custom, text-based result format. |
| [`application/sparql-results+json`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-sparql-json) | The [SPARQL/JSON](https://www.w3.org/TR/sparql11-results-json/) results format. |
| [`application/sparql-results+xml`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-sparql-xml) | The [SPARQL/XML](https://www.w3.org/TR/rdf-sparql-XMLres/) results format. |
| [`stats`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-stats) | A custom results format for testing and debugging. |
| [`table`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-table) | A text-based visual table result format. |
| [`tree`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-tree) | A tree-based result format for GraphQL-LD result compacting. |
| [`application/trig`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [TriG](https://www.w3.org/TR/trig/) RDF serialization. |
| [`application/n-quads`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [N-Quads](https://www.w3.org/TR/n-quads/) RDF serialization. |
| [`text/turtle`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [Turtle](https://www.w3.org/TR/turtle/) RDF serialization. |
| [`application/n-triples`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [N-Triples](https://www.w3.org/TR/n-triples/) RDF serialization. |
| [`text/n3`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [Notation3](https://www.w3.org/TeamSubmission/n3/) serialization. |
| [`application/ld+json`](https://github.com/comunica/comunica/tree/master/packages/actor-sparql-serialize-rdf) | The [JSON-LD](https://json-ld.org/) RDF serialization. |

## Querying from the command line

When using [Comunica from the command line](/docs/query/getting_started/query_cli/),
the result format can be set using the `-t` option:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100" \
    -t 'application/sparql-results+json'
```
```json
{"head": {"vars":["s","p","o"]},
"results": { "bindings": [
{"s":{"value":"http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2","type":"uri"},"p":{"value":"http://dbpedia.org/property/date","type":"uri"},"o":{"value":"1899-05-06","type":"literal","datatype":"http://www.w3.org/2001/XMLSchema#date"}},
{"s":{"value":"http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2","type":"uri"},"p":{"value":"http://dbpedia.org/property/isCitedBy","type":"uri"},"o":{"value":"http://dbpedia.org/resource/Tierce_(unit)","type":"uri"}},
{"s":{"value":"http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2","type":"uri"},"p":{"value":"http://dbpedia.org/property/newspaper","type":"uri"},"o":{"value":"Biloxi Daily Herald","type":"literal"}},
{"s":{"value":"http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2","type":"uri"},"p":{"value":"http://dbpedia.org/property/page","type":"uri"},"o":{"value":"6","type":"literal"}},
{"s":{"value":"http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2","type":"uri"},"p":{"value":"http://dbpedia.org/property/title","type":"uri"},"o":{"value":"A New System of Weights and Measures","type":"literal"}},
{"s":{"value":"http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2","type":"uri"},"p":{"value":"http://dbpedia.org/property/url","type":"uri"},"o":{"value":"http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2","type":"uri"}},
...
```

<div class="note">
All <a href="/docs/query/advanced/result_formats/">available formats</a> can be printed via <code>comunica-sparql --listformats</code>
</div>

### Querying in a JavaScript app

When using [Comunica in a JavaScript application](/docs/query/getting_started/query_app/),
results can be serialized to a certain format using `resultToString()`:
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});
const { data } = await myEngine.resultToString(result,
  'application/sparql-results+json');
data.pipe(process.stdout); // Print to standard output
```

The `resultToString()` method accepts a query result and a result format media type.
The media type is optional, and will default to `application/json` for bindings, `application/trig` for quads, and `simple` for booleans.

<div class="note">
<a href="/docs/query/advanced/result_formats/">All available result formats</a> can be retrieved programmatically
by invoking the asynchronous <code>getResultMediaTypes()</code> method.
</div>
