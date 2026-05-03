---
title: 'Usage showcase'
description: 'Examples of where Comunica is used.'
---

Comunica is being used in a variety of places for its querying and RDF-related capabilities.
Due to the open nature of the project, we do not actively track all uses of Comunica.
Below, a couple of these uses are listed.
Feel free to [contact us](/ask/) if you want your use of Comunica added to this list.

A more complete list of projects that use Comunica can be found by looking at
the [GitHub dependency graph](https://github.com/comunica/comunica/network/dependents) (1.600 at the time of writing)
or by inspecting the number of downloads on [npm](https://www.npmjs.com/package/@comunica/core) (45.000 weekly downloads at the time of writing).

## NDE — Network of Terms

_Governmental_

The [Dutch Digital Heritage Network (NDE)](https://netwerkdigitaalerfgoed.nl/) is a Dutch government-backed programme
that connects cultural heritage institutions such as libraries, archives and museums.
Their [Network of Terms](https://github.com/netwerk-digitaal-erfgoed/network-of-terms) service
is a live federated search engine that lets users look up terms in terminology sources
(thesauri, classification systems, and reference lists) maintained by dozens of heritage institutions across the Netherlands.
The query engine behind this service (`@netwerk-digitaal-erfgoed/network-of-terms-query`) uses
`@comunica/query-sparql` to issue federated SPARQL queries across all participating sources in real time.
Furthermore, [LD Workbench](https://github.com/netwerk-digitaal-erfgoed/ld-workbench) is an open-source pipeline tool for transforming and publishing Linked Data,
developed by the [Dutch Digital Heritage Network (NDE)](https://www.netwerkdigitaalerfgoed.nl/).
Each stage of the pipeline uses SPARQL queries to iterate over, filter, and construct RDF data,
with Comunica powering the query execution against both local RDF files and remote SPARQL endpoints.
NDE is also a founding member of the [Comunica Association](/association/).

## TriplyDB

_Commercial_

[TriplyDB](https://triplydb.com/) is a commercial knowledge graph platform by [Triply B.V.](https://triply.cc/)
that provides storage, querying and publishing services for Linked Data.
Triply integrates Comunica to power SPARQL querying, Linked Data Fragments, and Linked Data Event Streams interfaces
within the platform, enabling users to work with heterogeneous Linked Data sources through a unified service.
Triply has also published [Comunica-GraphQL](https://github.com/TriplyDB/Comunica-GraphQL),
an open-source GraphQL API layer over Linked Data built on top of Comunica.
Triply has sponsored bounties via the [Comunica Association](/association/).

## Inrupt

_Commercial_

[Inrupt](https://inrupt.com/) is the company co-founded by Tim Berners-Lee to bring the [Solid](https://solidproject.org/) protocol to production.
Inrupt integrates Comunica into their products and services to enable authenticated querying
of data stored in [Solid Pods](https://solidproject.org/users/get-a-pod) via their [query service](https://fragments.inrupt.com/),
including their PodSpaces hosting platform.

## FRINK Open Knowledge Network

_Academic_

[RENCI](https://renci.org/) (Renaissance Computing Institute) at the University of North Carolina at Chapel Hill
runs [FRINK](https://frink.renci.org/), a Federated Research Infrastructure for the NSF-funded
[Open Knowledge Network (OKN)](https://www.proto-okn.net/) programme.
FRINK's [interactive query page](https://frink.apps.renci.org/) allows users to select one or more OKN knowledge graphs
and execute SPARQL queries across them.
When multiple sources are selected, Comunica performs a client-side federated query against
the Triple Pattern Fragments endpoints of each chosen graph entirely in the browser,
without any server-side query processing.

## CoGhent — City of Ghent

_Governmental_

[CoGhent](https://coghent.github.io/) (_Collectie van de Gentenaar_, "Collection of the Ghent resident") is a
[City of Ghent (Stad Gent)](https://stad.gent/) initiative that publishes the heritage collections of
multiple Ghent museums — including the Design Museum Gent, Huis van Alijn, STAM, and Industriemuseum —
as [Linked Data Event Streams (LDES)](https://semiceu.github.io/LinkedDataEventStreams/).
Comunica is the recommended and documented tool for [querying these collections](https://coghent.github.io/runqueries.html),
both directly in the browser and locally via the `@comunica/query-sparql` CLI and JavaScript API,
making it the primary query interface for accessing the openly published cultural heritage data of Ghent.

## Sparnatural

_Commercial_

[Sparnatural](https://sparnatural.eu) ([GitHub](https://github.com/sparna-git/Sparnatural)) is an open-source visual SPARQL query builder
that lets end users construct SPARQL queries through a point-and-click interface without any knowledge of SPARQL syntax.
It uses [`@comunica/query-sparql-rdfjs-lite`](https://www.npmjs.com/package/@comunica/query-sparql-rdfjs-lite)
to execute queries directly in the browser against RDF data loaded via the RDF/JS interface,
enabling fully client-side querying with no server required.

## shacl-engine

_Open Source_

[shacl-engine](https://github.com/rdf-ext/shacl-engine) is a fast, streaming [SHACL](https://www.w3.org/TR/shacl/) validation engine for RDF/JS datasets.
For shapes that define SPARQL-based constraints (`sh:sparql`) or target declarations (`sh:target`),
the engine delegates query execution to Comunica via
[`@comunica/query-sparql-rdfjs-lite`](https://www.npmjs.com/package/@comunica/query-sparql-rdfjs-lite).

## Mentor for Visual Studio Code

_Open Source_

[Mentor](https://mentor-vscode.dev/) is a Visual Studio Code extension that essentially turns the editor into a specialized IDE for RDF and knowledge graph development,
with features like SPARQL querying, ontology navigation, reasoning, and workspace-wide indexing of RDF resources.
Mentor uses Comunica to power its SPARQL querying capabilities, allowing users to execute queries against RDF data in their workspace and external sources directly from the editor.

## LDflex

_Academic_

[LDflex](https://github.com/LDflex/LDflex) is a JavaScript library provides a convenient syntax for quickly writing and executing queries in a developer-friendly way.
Using the power of Comunica and JSON-LD contexts, you can write expressions like `person.friends.firstName` to get a list of your friends.

LDflex is used within the [Solid](https://solidproject.org/) community to easily [interact with one or more Solid data pods](https://github.com/solid/query-ldflex/).
Using the compact syntax of LDflex, it is very simple to query from within [React components](https://github.com/solid/react-components).

## GraphQL-LD

_Academic_

[GraphQL-LD](https://github.com/rubensworks/graphql-ld.js) is a JavaScript library
that allows Linked Data to be queried via [GraphQL](https://graphql.org/) queries and a JSON-LD context.
The approach involves converting a GraphQL query and JSON-LD context to a SPARQL query,
which can then be executed by any SPARQL query engine [such as Comunica](https://github.com/rubensworks/graphql-ld-comunica.js).

It can also be used execute [authenticated queries over Solid data pods](https://github.com/rubensworks/GraphQL-LD-Comunica-Solid.js),
for which [reusable React components](https://github.com/rubensworks/solid-react-graphql-ld.js) are available.

## Quadstore

_Open Source_

[Quadstore](https://github.com/belayeng/quadstore) is a [LevelDB](https://github.com/google/leveldb)-based graph database for Node.js and the browser.
[Quadstore Comunica](https://github.com/belayeng/quadstore-comunica) is a SPARQL engine on top of Quadstore that is powered by Comunica.

## LDkit

_Open Source_

[LDkit](https://ldkit.io) is a Linked Data query toolkit for TypeScript developers. It provides ORM-like abstraction over RDF data: you define a data source and a data schema and let LDkit handle SPARQL queries, data fetching and conversion of RDF to to JS/TS native types in background.

LDkit provides built-in support to query SPARQL endpoints, but it is [fully compatible with Comunica](https://ldkit.io/docs/how-to/query-with-comunica) in case you need to access other RDF data sources.

## RDF Parse

_Open Source_

[RDF Parse](https://github.com/rubensworks/rdf-parse.js) is a JavaScript library parses RDF based on content type or file name in a streaming manner.
It supports all of the major RDF serializations.
Internally, this library makes use of the `rdf-parse` bus and actors from Comunica.

## RDF Dereference

_Open Source_

[RDF Dereference](https://github.com/rubensworks/rdf-dereference.js) is a JavaScript library dereferences URLs to get its RDF contents.
This tool is useful in situations where you have a URL, and you just need the parsed triples/quads, without having to concern yourself with determining the correct content type and picking the correct parser.
Internally, this library makes use of the `rdf-dereference` bus and actors from Comunica.

## RDF Play

_Open Source_

[RDF Play](https://rdf-play.rubensworks.net/) is a Web-based tool for performing simple RDF operations, such as parsing, serializing and dereferencing from URLs.
Internally, this library makes use of RDF parsers from the Comunica framework, which enable streaming processing of RDF.

## ESWC Conference 2020

_Academic_

All metadata of the [ESWC Conference (2020)](https://2020.eswc-conferences.org/) is [queryable](https://query.2020.eswc-conferences.org/)
via a jQuery widget instance of Comunica.
It features several example queries over a [Triple Pattern Fragments](https://linkeddatafragments.org/concept/) interface through which the ESWC 2020 metadata is published.

## Walder

_Academic_

[Walder](https://github.com/KNowledgeOnWebScale/walder) offers an easy way 
to set up a website or Web API on top of decentralized knowledge graphs.
It uses Comunica for querying these knowledge graphs.
hosted via Solid PODs, SPARQL endpoints, Triple Pattern Fragments interfaces, RDF files, and so on. 
Using content negotiation, Walder makes the data in these knowledge graphs available to clients via HTML, RDF, and JSON-LD. 
Users define in a configuration file which data Walder uses and how it processes this data.

## Comunica jQuery Widget

_Academic_

The [Comunica jQuery Widget](https://github.com/comunica/jQuery-Widget.js) is a reusable interactive SPARQL query interface for the browser.
It powers the live Comunica demo at [query.comunica.dev](https://query.comunica.dev/) and can be embedded on any webpage,
allowing end users to execute SPARQL queries directly in the browser against any combination of supported source types
without needing a server-side component.

## SolidBench

_Academic_

[SolidBench](https://github.com/SolidBench/SolidBench.js) is a benchmarking suite for evaluating the performance of Solid-compatible query engines.
It generates realistic social-network RDF datasets distributed across simulated Solid pods
and uses Comunica SPARQL Solid as its reference query engine to execute and measure benchmark queries.

## JBR

_Academic_

[JBR](https://github.com/rubensworks/jbr.js) is a JavaScript-based benchmarking framework for creating and running reproducible experiments
with engines such as Comunica and [LDF Server](https://github.com/LinkedDataFragments/Server.js).
It covers the full provenance chain: software setup, input data generation, experiment execution, dependency tracking, result reporting, and archiving.
JBR makes it straightforward to compare different Comunica configurations or measure the impact of custom modifications.

## Community Solid Server

_Academic_

The [Community Solid Server (CSS)](https://github.com/CommunitySolidServer/CommunitySolidServer) is the reference implementation of the
[Solid protocol](https://solidproject.org/TR/protocol), developed at Ghent University.
CSS uses `@comunica/query-sparql` internally to evaluate SPARQL queries and updates against its in-memory RDF data stores,
making it one of the most prominent real-world deployments of Comunica in a server-side context.

## Koreografeye

_Academic_

[Koreografeye](https://github.com/eyereasoner/Koreografeye) is a Solid orchestration and choreography agent
that uses the [EYE reasoner](https://github.com/eyereasoner/eye) to evaluate N3 policies on incoming Solid notifications.
It uses Comunica ([`@comunica/query-sparql-rdfjs`](https://www.npmjs.com/package/@comunica/query-sparql-rdfjs))
to issue SPARQL queries against the RDF data produced by the reasoner,
allowing policies to query and transform Linked Data before dispatching further actions.

