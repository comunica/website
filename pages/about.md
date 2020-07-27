---
title: 'About'
---

## Flexible querying of Linked Data

[**Linked Data**](https://www.w3.org/standards/semanticweb/data) on the Web exists in **many shapes and forms**.
Linked Data can be published using plain [RDF](https://www.w3.org/TR/rdf11-concepts/) files
in various **syntaxes**, such as [JSON-LD](https://json-ld.org/), [Turtle](https://www.w3.org/TR/turtle/), [HTML+RDFa](https://www.w3.org/TR/html-rdfa/), and more.
Next to that, different forms of **queryable Web interfaces** exist, such as [SPARQL endpoints](https://www.w3.org/TR/sparql11-protocol/) and [Triple Pattern Fragments (TPF) interfaces](https://linkeddatafragments.org/in-depth/#tpf).
If we want to **query** Linked Data from the Web, we need to be able to cope with this heterogeneity.

**Comunica** is a **quering framework** that has been designed to handle different types of Linked Data interfaces in a **flexible** manner.
Its primary goal is _executing [SPARQL](https://www.w3.org/TR/sparql11-query/) queries over one or more interfaces_.

## Comunica is a meta-query engine

Comunica should not be seen as a query engine.
Instead, Comunica is a _meta_ query engine using which query engines can be created.
It does this by providing a set of **modules** that can be **wired** together in a flexible manner.

While we provide default configurations of Comunica to easily [get started with querying](/docs/query/getting_started/),
anyone can [configure their own query engine](/docs/modify/getting_started/).
This fine-tuning of Comunica to suit your own needs, and avoiding the overhead of modules that are not needed.

## For and on the Web

We strongly believe in the existence of **open Web standards**, such as those provided by [W3C](https://www.w3.org/) and [WhatWG](https://whatwg.org/).
As such, Comunica **implements** several specifications such as [RDF](https://www.w3.org/TR/rdf11-concepts/) and [SPARQL](https://www.w3.org/TR/sparql11-query/).
Furthermore, Comunica is implemented using Web-based technologies in **JavaScript**, which enables usage through browsers,
the command line, the SPARQL protocol, or any Web or JavaScript application.

## Linked Data Fragments

One of the motivations behind Comunica is to be a [**Linked Data Fragments Client**](https://linkeddatafragments.org/concept/).
Linked Data Fragments is a theoretical framework to analyse different Linked Data interfaces.

While software used to exist to query over specific types of Linked Data interfaces,
it used to be impossible to query over **combinations of different interfaces**.
Comunica solves this need by being independent of specific types of interfaces,
as support for new interfaces can be plugged in.

## Who works on Comunica?

First and foremost, Comunica is an **open-source** framework.
The Comunica project has been initiated by [IDLab](https://www.ugent.be/ea/idlab/en) at Ghent University – imec,
and is being actively developed and maintained by a variety of [contributors](https://github.com/comunica/comunica/graphs/contributors).
All development happens publicaly via GitHub [project boards](https://github.com/orgs/comunica/projects), [issues](https://github.com/comunica/comunica/issues), and [pull requests](https://github.com/comunica/comunica/pulls).
Anyone is welcome to [contribute](/contribute/) to this project.
