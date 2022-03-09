---
title: 'Usage showcase'
description: 'Examples of where Comunica is used.'
---

Comunica is being used in a variety of places for its querying and RDF-related capabilities.
Below, a couple of these uses are listed.
Feel free to [contact us](/ask/) if you want your use of Comunica added to this list.

## LDflex

[LDflex](https://github.com/LDflex/LDflex) is a JavaScript library provides a convenient syntax for quickly writing and executing queries in a developer-friendly way.
Using the power of Comunica and JSON-LD contexts, you can write expressions like `person.friends.firstName` to get a list of your friends.

LDflex is used within the [Solid](https://solidproject.org/) community to easily [interact with one or more Solid data pods](https://github.com/solid/query-ldflex/).
Using the compact syntax of LDflex, it is very simple to query from within [React components](https://github.com/solid/react-components).

## GraphQL-LD

[GraphQL-LD](https://github.com/rubensworks/graphql-ld.js) is a JavaScript library
that allows Linked Data to be queried via [GraphQL](https://graphql.org/) queries and a JSON-LD context.
The approach involves converting a GraphQL query and JSON-LD context to a SPARQL query,
which can then be executed by any SPARQL query engine [such as Comunica](https://github.com/rubensworks/graphql-ld-comunica.js).

It can also be used execute [authenticated queries over Solid data pods](https://github.com/rubensworks/GraphQL-LD-Comunica-Solid.js),
for which [reusable React components](https://github.com/rubensworks/solid-react-graphql-ld.js) are available.

## Node Quadstore

[Node Quadstore](https://github.com/belayeng/quadstore) is a [LevelDB](https://github.com/google/leveldb)-based graph database for Node.js and the browser.
[Node Quadstore Comunica](https://github.com/belayeng/quadstore-comunica) is a SPARQL engine on top of Node Quadstore that is powered by Comunica.

## RDF Parse

[RDF Parse](https://github.com/rubensworks/rdf-parse.js) is a JavaScript library parses RDF based on content type or file name in a streaming manner.
It supports all of the major RDF serializations.
Internally, this library makes use of the `rdf-parse` bus and actors from Comunica.

## RDF Dereference

[RDF Dereference](https://github.com/rubensworks/rdf-dereference.js) is a JavaScript library dereferences URLs to get its RDF contents.
This tool is useful in situations where you have a URL, and you just need the parsed triples/quads, without having to concern yourself with determining the correct content type and picking the correct parser.
Internally, this library makes use of the `rdf-dereference` bus and actors from Comunica.

## RDF Play

[RDF Play](https://rdf-play.rubensworks.net/) is a Web-based tool for performing simple RDF operations, such as parsing, serializing and dereferencing from URLs.
Internally, this library makes use of RDF parsers from the Comunica framework, which enable streaming processing of RDF.

## ESWC Conference 2020

All metadata of the [ESWC Conference (2020)](https://2020.eswc-conferences.org/) is [queryable](https://query.2020.eswc-conferences.org/)
via a jQuery widget instance of Comunica.
It features several example queries over a [Triple Pattern Fragments](https://linkeddatafragments.org/concept/) interface through which the ESWC 2020 metadata is published.

## Walder

[Walder](https://github.com/KNowledgeOnWebScale/walder) offers an easy way 
to set up a website or Web API on top of decentralized knowledge graphs.
It uses Comunica for querying these knowledge graphs.
hosted via Solid PODs, SPARQL endpoints, Triple Pattern Fragments interfaces, RDF files, and so on. 
Using content negotiation, Walder makes the data in these knowledge graphs available to clients via HTML, RDF, and JSON-LD. 
Users define in a configuration file which data Walder uses and how it processes this data.
