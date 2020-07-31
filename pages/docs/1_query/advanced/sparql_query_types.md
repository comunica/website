---
title: 'SPARQL query types'
description: 'Different SPARQL query types are possible, such as SELECT, CONSTRUCT, ASK, ...'
---

The [SPARQL 1.1 query specification](https://www.w3.org/TR/sparql11-query/)
introduces four query types:

* `SELECT`: Return matches as a collection of solution bindings.
* `CONSTRUCT`: Create RDF triples from matches.
* `DESCRIBE`: Create RDF triples about a resource.
* `ASK`: Check if at least one match exists.

This guide shows how to handle these query types from the [command line](/docs/query/getting_started/query_cli/)
and via [a JavaScript application](/docs/query/getting_started/query_app/).

<div class="note">
Query results for each of these query types can be represented in <a href="/docs/query/advanced/result_formats/">different formats</a>.
</div>

## 1. Command line

Below, the different query type usages are summarized.
More information can be found in the [command line guide](/docs/query/getting_started/query_cli/).

### 1.1. `SELECT`

The following query retrieves the first 100 triples from [DBpedia](https://fragments.dbpedia.org/2016-04/en):
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100"
```

As output, a JSON array of bindings for the selected variables will be returned:
```
[
{"?s":"https://fragments.dbpedia.org/2016-04/en#dataset","?p":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","?o":"http://rdfs.org/ns/void#datasource"},
{"?s":"https://fragments.dbpedia.org/2016-04/en#dataset","?p":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","?o":"http://www.w3.org/ns/hydra/core#Collection"},
{"?s":"https://fragments.dbpedia.org/2016-04/en#dataset","?p":"http://www.w3.org/ns/hydra/core#search","?o":"https://fragments.dbpedia.org/2016-04/en#triplePattern"}
...
```

### 1.2. `CONSTRUCT`

Next to SPARQL `SELECT` queries,
it is also possible to execute `CONSTRUCT` queries to produce RDF triples:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```
```text
<http://0-access.newspaperarchive.com.topcat.switchinc.org/Viewer.aspx?img=8716084> <http://dbpedia.org/property/accessdate> "2010-04-21"^^<http://www.w3.org/2001/XMLSchema#date>;
    <http://dbpedia.org/property/date> "1939-01-02"^^<http://www.w3.org/2001/XMLSchema#date>;
    <http://dbpedia.org/property/format> "PDF";
    <http://dbpedia.org/property/isCitedBy> <http://dbpedia.org/resource/List_of_Attorneys_General_of_Wisconsin>;
    <http://dbpedia.org/property/location> "Sheboygan, Wisconsin";
    <http://dbpedia.org/property/page> "1";
...
```

### 1.3. `DESCRIBE`

Similar to `CONSTRUCT`, `DESCRIBE` will output triples that are connected to a given resource by any predicate:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "DESCRIBE <http://dbpedia.org/resource/List_of_Attorneys_General_of_Wisconsin>"
```
```text
<http://dbpedia.org/resource/List_of_Attorneys_General_of_Wisconsin> <http://dbpedia.org/ontology/wikiPageExternalLink> <http://www.legis.state.wi.us/lrb/bb/05bb/695-743.pdf>, <http://www.usgennet.org/usa/wi/state/wihist-2.htm>, <http://caselaw.lp.findlaw.com/scripts/getcase.pl?court=us&navby=title&v1=State+of+Wisconsin>, <http://law.justia.com/codes/wisconsin/>, <http://legalnewsline.com/?s=Wisconsin+attorney+general>, <http://naag.org/naag/attorneys-general/whos-my-ag/wisconsin/brad-schimel.php>, <http://public.findlaw.com/LCsearch.html?restrict=consumer&entry=%22Wisconsin+Attorney+General%22>, <http://www.abajournal.com/search/results/search&keywords=Wisconsin+Attorney+General/>, <http://www.doj.state.wi.us/>, <http://www.doj.state.wi.us/media-center/2015-news-releases>, <http://www.wisbar.org/Pages/default.aspx>;
    <http://dbpedia.org/ontology/wikiPageID> "4945528"^^<http://www.w3.org/2001/XMLSchema#integer>;
    <http://dbpedia.org/ontology/wikiPageLength> "14830"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>;
    <http://dbpedia.org/ontology/wikiPageOutDegree> "71"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>;
    <http://dbpedia.org/ontology/wikiPageRevisionID> "697541030"^^<http://www.w3.org/2001/XMLSchema#integer>;
...
```

### 1.4. `ASK`

`ASK` queries will produce a boolean output:
```bash
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en \
    "ASK { ?s ?p ?o }"
```
```
true
```

## 2. Application

Below, the different query type usages are summarized.
More information can be found in the [application guide](/docs/query/getting_started/query_app/).

### 1.1. `SELECT`

The following query retrieves the first 100 triples from [DBpedia](https://fragments.dbpedia.org/2016-04/en):
```javascript
const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});
result.bindingsStream.on('data', (binding) => {
    console.log(binding.get('?s').value);
    console.log(binding.get('?p').value);
    console.log(binding.get('?o').value);
});
```

### 1.2. `CONSTRUCT`

Next to SPARQL `SELECT` queries,
it is also possible to execute `CONSTRUCT` queries to produce RDF triples:
```javascript
const result = await myEngine.query(`
  CONSTRUCT WHERE {
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});
```
```javascript
result.quadStream.on('data', (quad) => {
    console.log(quad.subject.value);
    console.log(quad.predicate.value);
    console.log(quad.object.value);
    console.log(quad.graph.value);
});
```

### 1.3. `DESCRIBE`

Similar to `CONSTRUCT`, `DESCRIBE` will output triples that are connected to a given resource by any predicate:
```javascript
const result = await myEngine.query(`
  DESCRIBE <http://dbpedia.org/resource/List_of_Attorneys_General_of_Wisconsin>`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});
```
```javascript
result.quadStream.on('data', (quad) => {
    console.log(quad.subject.value);
    console.log(quad.predicate.value);
    console.log(quad.object.value);
    console.log(quad.graph.value);
});
```

### 1.4. `ASK`

`ASK` queries will produce a boolean output:
```javascript
const result = await myEngine.query(`
  ASK {
    ?s ?p <http://dbpedia.org/resource/Belgium>
  }`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
})
const hasMatches = await result.booleanResult;
```
