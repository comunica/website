---
title: 'Setting up a SPARQL endpoint'
description: 'Allow querying over HTTP via the SPARQL protocol'
---

The [SPARQL protocol](https://www.w3.org/TR/sparql11-protocol/) allows clients to send SPARQL queries to Web servers over HTTP,
and query results to be sent back to the client. 
Comunica SPARQL can be used to set up a **SPARQL endpoint** on top of any number of sources you want.

## 1. Installation

Since Comunica runs on Node.js, make sure you have [Node.js installed](https://nodejs.org/en/) on your machine.

Next, we can install Comunica SPARQL on our machine:
```bash
$ npm install -g @comunica/query-sparql
```

## 2. SPARQL endpoint over one source

After installing Comunica SPARQL, you will be given access to several commands including `comunica-sparql-http`,
which allows you to start a SPARQL endpoint from the command line.

This command requires one or more URLs to be provided as **sources** to query over.

For example, the following command starts a SPARQL endpoint over [DBpedia](https://fragments.dbpedia.org/2016-04/en):
```bash
$ comunica-sparql-http https://fragments.dbpedia.org/2016-04/en
```

<div class="note">
Given a URL, Comunica will automatically detect the <a href="/docs/query/advanced/source_types/">type of source</a> and handle it accordingly.
</div>

By default, the endpoint will be exposed on port 3000.
Your endpoint will now be live on `http://localhost:3000/sparql`.
Any client that understands the SPARQL protocol will now be able to send queries to this URL,
such as [`fetch-sparql-endpoint`](https://github.com/rubensworks/fetch-sparql-endpoint.js/), or even Comunica itself.

<div class="note">
The URL <code>http://localhost:3000/</code> will automatically redirect to <code>http://localhost:3000/sparql</code>.
</div>

You can easily test query execution over your endpoint using a tool such as `curl`.
The SPARQL protocol allows sending queries via HTTP GET by passing a URL-encoded SPARQL query via the `?query=` parameter:
```bash
$ curl -v "http://localhost:3000/sparql?query=CONSTRUCT%20WHERE%20%7B%3Fs%20%3Fp%20%3Fo.%7DLIMIT%20100"
```

## 3. SPARQL endpoint over multiple sources

One key feature of Comunica is its ability to query over **multiple sources**.
For this, you can just supply any number of URLs as arguments.

```bash
$ comunica-sparql-http https://fragments.dbpedia.org/2016-04/en \
    https://www.rubensworks.net/ \
    https://ruben.verborgh.org/profile/
```

## 4. SPARQL endpoint over local files

First install Comunica SPARQL for files:

```bash
$ npm install -g @comunica/query-sparql-file
```

Then start the SPARQL server:

```bash
$ comunica-sparql-file-http path/to/my/file.ttl
```

## 5. Changing the port

Using the `-p` option, the port can be changed:
```bash
$ comunica-sparql-http https://fragments.dbpedia.org/2016-04/en \
  -p 3001
```

## 6. Increasing the number of worker threads

Using the `-w` option, the number of parallel worker threads can be set:
```bash
$ comunica-sparql-http https://fragments.dbpedia.org/2016-04/en \
  -w 4
```

Setting this to the number of available CPU cores tends to give the best performance.

## 7. Adding a context

Using the `-c` option, you can add a context (JSON string or file):
```bash
$ comunica-sparql-http -c config.json
```
`config.json` could look like this:
```json
{
  "sources": [
    "https://fragments.dbpedia.org/2016-04/en"
  ],
  "lenient": true
}
```

<div class="note">
When using a context, the sources need to be provided within said context.
</div>

## 8. Emitting VoID metadata

<div class="note">
Experimental feature: can be very slow to generate the descriptions for big datasets. But only the first time and after update queries, since caching is implemented and invalidated after updating.
</div>

Using `--emitVoid` you can make your endpoint include a [VoID](https://www.w3.org/TR/void/) description in its service description:

```bash
$ comunica-sparql-http -c config.json --emitVoid
```

The metadata can be found in the service description at http://localhost:3000/sparql.

You can also add [Dublin Core Metadata Terms](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) (general metadata) using a `dcterms` field in the context:
```json
{
  "sources": [
    "https://www.rubensworks.net/",
    "https://ruben.verborgh.org/profile/"
  ],
  "dcterms": {
    "title": "\"comunica SPARQL endpoint\"",
    "creator": "https://example.com/johndoe"
  }
}
```

The service description with VoID included for the above context will look like this:
```ttl
<http://localhost:3000/sparql> a <http://www.w3.org/ns/sparql-service-description#Service>;
    <http://www.w3.org/ns/sparql-service-description#endpoint> <http://localhost:3000/sparql>;
    <http://www.w3.org/ns/sparql-service-description#url> <http://localhost:3000/sparql>;
    <http://www.w3.org/ns/sparql-service-description#feature> <http://www.w3.org/ns/sparql-service-description#BasicFederatedQuery>;
    <http://www.w3.org/ns/sparql-service-description#supportedLanguage> <http://www.w3.org/ns/sparql-service-description#SPARQL10Query>, <http://www.w3.org/ns/sparql-service-description#SPARQL11Query>;
    <http://www.w3.org/ns/sparql-service-description#resultFormat> <https://comunica.linkeddatafragments.org/#results_stats>, <http://www.w3.org/ns/formats/SPARQL_Results_JSON>, <http://www.w3.org/ns/formats/Shaclc>, <http://www.w3.org/ns/formats/ShaclcExtended>, <http://www.w3.org/ns/formats/JSON-LD>, <http://www.w3.org/ns/formats/N-Quads>, <http://www.w3.org/ns/formats/N-Triples>, <http://www.w3.org/ns/formats/TriG>, <http://www.w3.org/ns/formats/N3>, <http://www.w3.org/ns/formats/Turtle>, <https://comunica.linkeddatafragments.org/#results_tree>, <https://comunica.linkeddatafragments.org/#results_table>, <http://www.w3.org/ns/formats/SPARQL_Results_XML>, <http://www.w3.org/ns/formats/SPARQL_Results_TSV>, <http://www.w3.org/ns/formats/SPARQL_Results_CSV>, <https://comunica.linkeddatafragments.org/#results_simple>, <https://comunica.linkeddatafragments.org/#results_JSON>;
    <http://www.w3.org/ns/sparql-service-description#defaultDataset> _:defaultDataset.
_:defaultDataset a <http://www.w3.org/ns/sparql-service-description#Dataset>, <http://rdfs.org/ns/void#Dataset>;
    <http://rdfs.org/ns/void#sparqlEndpoint> <http://localhost:3000/sparql>;
    <http://rdfs.org/ns/void#vocabulary> <http://purl.org/dc/terms/>;
    <http://purl.org/dc/terms/title> "comunica SPARQL endpoint";
    <http://purl.org/dc/terms/creator> <https://example.com/johndoe>;
    <http://www.w3.org/ns/sparql-service-description#defaultGraph> _:defaultGraph.
_:defaultGraph a <http://www.w3.org/ns/sparql-service-description#Graph>;
    <http://rdfs.org/ns/void#classes> 19.
_:defaultDataset <http://rdfs.org/ns/void#classPartition> _:classPartition0.
_:classPartition0 a <http://rdfs.org/ns/void#ClassPartition>;
    <http://rdfs.org/ns/void#class> <http://xmlns.com/foaf/0.1/Person>;
    <http://rdfs.org/ns/void#entities> 438.
_:defaultDataset <http://rdfs.org/ns/void#classPartition> _:classPartition1.
_:classPartition1 a <http://rdfs.org/ns/void#ClassPartition>;
    <http://rdfs.org/ns/void#class> <http://xmlns.com/foaf/0.1/Document>;
    <http://rdfs.org/ns/void#entities> 1.

...

_:defaultDataset <http://rdfs.org/ns/void#classPartition> _:classPartition18.
_:classPartition18 a <http://rdfs.org/ns/void#ClassPartition>;
    <http://rdfs.org/ns/void#class> <http://www.w3.org/2002/07/owl#AllDifferent>;
    <http://rdfs.org/ns/void#entities> 1.
_:defaultDataset <http://rdfs.org/ns/void#propertyPartition> _:propertyPartition0.
_:propertyPartition0 a <http://rdfs.org/ns/void#PropertyPartition>;
    <http://rdfs.org/ns/void#property> <http://xmlns.com/foaf/0.1/primaryTopic>;
    <http://rdfs.org/ns/void#triples> 8.
_:defaultDataset <http://rdfs.org/ns/void#propertyPartition> _:propertyPartition1.
_:propertyPartition1 a <http://rdfs.org/ns/void#PropertyPartition>;
    <http://rdfs.org/ns/void#property> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>;
    <http://rdfs.org/ns/void#triples> 901.

...

_:defaultDataset <http://rdfs.org/ns/void#propertyPartition> _:propertyPartition9.
_:propertyPartition9 a <http://rdfs.org/ns/void#PropertyPartition>;
    <http://rdfs.org/ns/void#property> <http://xmlns.com/foaf/0.1/name>;
    <http://rdfs.org/ns/void#triples> 80.
_:defaultGraph <http://rdfs.org/ns/void#triples> 11542;
    <http://rdfs.org/ns/void#entities> 5701;
    <http://rdfs.org/ns/void#distinctSubjects> 3714;
    <http://rdfs.org/ns/void#properties> 79;
    <http://rdfs.org/ns/void#distinctObjects> 5646.
_:defaultDataset <http://rdfs.org/ns/void#propertyPartition> _:propertyPartition10.
_:propertyPartition10 a <http://rdfs.org/ns/void#PropertyPartition>;
    <http://rdfs.org/ns/void#property> <http://ogp.me/ns#site_name>;
    <http://rdfs.org/ns/void#triples> 1.

...

_:defaultDataset <http://rdfs.org/ns/void#propertyPartition> _:propertyPartition78.
_:propertyPartition78 a <http://rdfs.org/ns/void#PropertyPartition>;
    <http://rdfs.org/ns/void#property> <http://www.w3.org/2002/07/owl#distinctMembers>;
    <http://rdfs.org/ns/void#triples> 1.
```

## 9. Learn more

This guide only discussed the basic functionality of `comunica-sparql-http`.
You can learn more options by invoking the _help_ command:
```text
$ comunica-sparql-http --help
comunica-sparql-http exposes a SPARQL endpoint

Recommended options:
  -p, --port     HTTP port to run on                                                                                                    [number] [default: 3000]
  -w, --workers  Number of worker threads                                                                                                  [number] [default: 1]
  -t, --timeout  Query execution timeout in seconds                                                                                       [number] [default: 60]
  -u, --update   Enable update queries (otherwise, only read queries are enabled)                                                                      [boolean]

Options:
  -c, --context                 Use the given JSON context string or file (e.g., config.json)                                                           [string]
      --to                      Destination for update queries                                                                                          [string]
  -b, --baseIRI                 base IRI for the query (e.g., http://example.org/)                                                                      [string]
  -d, --dateTime                Sets a datetime for querying Memento-enabled archives                                                                   [string]
  -l, --logLevel                Sets the log level (e.g., debug, info, warn, ...)                                                     [string] [default: "warn"]
      --lenient                 If failing requests and parsing errors should be logged instead of causing a hard crash                                [boolean]
  -v, --version                 Prints version information                                                                                             [boolean]
      --showStackTrace          Prints the full stacktrace when errors are thrown                                                                      [boolean]
      --httpTimeout             HTTP requests timeout in milliseconds                                                                                   [number]
      --httpBodyTimeout         Makes the HTTP timeout take into account the response body stream read                                                 [boolean]
      --httpRetryCount          The number of retries to perform on failed fetch requests                                                               [number]
      --httpRetryDelayFallback  The fallback delay in milliseconds between fetch retries                                                                [number]
      --httpRetryDelayLimit     The upper limit in milliseconds for the delay between fetch retries                                                     [number]
      --unionDefaultGraph       If the default graph should also contain the union of all named graphs                                                 [boolean]
  -i, --invalidateCache         Enable cache invalidation before each query execution                                                                  [boolean]
      --distinctConstruct       If the query engine should deduplicate resulting triples                                                               [boolean]
      --freshWorker             Kills the worker after each query execution                                                                            [boolean]
      --contextOverride         If the query context can be overridden through POST requests                                                           [boolean]
      --includeVoID             Include a VoID description, which can be accessed at /void                                                             [boolean]

Examples:
  comunica-sparql-http https://fragments.dbpedia.org/2016-04/en
  comunica-sparql-http https://fragments.dbpedia.org/2016-04/en https://query.wikidata.org/sparql
  comunica-sparql-http hypermedia@https://fragments.dbpedia.org/2016-04/en sparql@https://query.wikidata.org/sparql
```
