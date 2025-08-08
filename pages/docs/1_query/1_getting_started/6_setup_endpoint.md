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

You can also pass a string.

<div class="note">
When using a context, the sources need to be provided within said context.
</div>

## 8. Including VoID metadata

Using `--includeVoID` you can make your endpoint expose a [VoID](https://www.w3.org/TR/void/) description:

```bash
$ comunica-sparql-http -c config.json --includeVoID
```

The metadata can be accessed at http://localhost:3000/void.

You can also add [Dublin Core Metadata Terms](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) (general metadata) using a `dcterms` field in the context:
```json
{
  "sources": [
    "https://www.rubensworks.net/",
    "https://ruben.verborgh.org/profile/"
  ],
  "dcterms": {
    "title": "comunica SPARQL endpoint",
    "creator": "me"
  }
}
```

The VoID description for the above context will look like this:
```ttl
</void> a <http://rdfs.org/ns/void#Dataset>;
    <http://rdfs.org/ns/void#sparqlEndpoint> </sparql>;
    <http://rdfs.org/ns/void#vocabulary> <http://www.w3.org/ns/formats/>;
    <http://rdfs.org/ns/void#feature> <http://www.w3.org/ns/formats/N3>, <http://www.w3.org/ns/formats/N-Triples>, <http://www.w3.org/ns/formats/RDF_XML>, <http://www.w3.org/ns/formats/RDFa>, <http://www.w3.org/ns/formats/Turtle>;
    <http://rdfs.org/ns/void#vocabulary> <http://purl.org/dc/terms/>;
    <http://purl.org/dc/terms/title> <comunica SPARQL endpoint>;
    <http://purl.org/dc/terms/creator> <me>;
    <http://rdfs.org/ns/void#triples> 11536;
    <http://rdfs.org/ns/void#properties> 11536;
    <http://rdfs.org/ns/void#distinctSubjects> 3712;
    <http://rdfs.org/ns/void#distinctObjects> 5644.
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
