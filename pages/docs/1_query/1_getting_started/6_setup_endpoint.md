---
title: 'Setting up a SPARQL endpoint'
description: 'Allow querying over HTTP via the SPARQL protocol'
---

The [SPARQL protocol](https://www.w3.org/TR/sparql11-protocol/) allows clients to send SPARQL queries to Web servers over HTTP,
and query results to be sent back to the client. 
Comunica SPARQL can be used to set up a SPARQL endpoint on top of any number of sources you want.

## 1. Installation

Since Comunica runs on Node.js, make sure you have [Node.js installed](https://nodejs.org/en/) on your machine.

Next, we can install Comunica SPARQL on our machine:
```bash
$ npm install -g @comunica/actor-init-sparql
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

## 4. Changing the port

Using the `-p` option, the port can be changed:
```bash
$ comunica-sparql-http https://fragments.dbpedia.org/2016-04/en \
  -p 3001
```

## 5. Learn more

This guide only discussed the basic functionality of `comunica-sparql-http`.
You can learn more options by invoking the _help_ command:
```text
$ comunica-sparql-http --help

Usage:
  comunica-sparql-http http://fragments.dbpedia.org/2015/en
  comunica-sparql-http http://fragments.dbpedia.org/2015/en hypermedia@http://fragments.dbpedia.org/2016-04/en
  comunica-sparql-http -c context.json
  comunica-sparql-http -c "{ \"sources\": [{ \"type\": \"hypermedia\", \"value\" : \"http://fragments.dbpedia.org/2015/en\" }]}"

Options:
  -c            Context should be a JSON object or the path to such a JSON file.
  -p            The HTTP port to run on (default: 3000)
  -t            The query execution timeout in seconds (default: 60)
  -b            base IRI for the query (e.g., http://example.org/)
  -l            Sets the log level (e.g., debug, info, warn, ... defaults to warn)
  -i            A flag that enables cache invalidation before each query execution.
  --lenient     if failing requests and parsing errors should be logged instead of causing a hard crash
  --help        print this help message
  --version     prints version information
```
