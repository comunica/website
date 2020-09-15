---
title: 'SPARQL property paths'
description: 'Property paths allow for more concise expressions for some SPARQL basic graph patterns.'
---

TODO: add introduction

## 1. Before we start the tutorial

### 1.1. Learning objective

At the end of the tutorial
you will be able to use property paths in SPARQL queries 
using Walder Comunica.

### 1.2. Prerequisites

TODO: update

We assume that you are familiar with 

- knowledge graphs and more specific the Resource Description Framework (RDF)
- bash
- Node.js (v12 or higher) and npm

### 1.3. How to use the tutorial

There are two ways to complete this tutorial:
you read the explanations and either

- read the examples, 
- try out the examples yourself using your browser, or
- try out the examples yourself using your computer.

In case you choose the latter option,
you first need to follow [this guide](/docs/query/getting_started/query_cli/).

## 2. Example

For this tutorial 
we want to answer the following questions:

1. Who are the in-laws of Samuel L. Jackson?
2. Which movies are from directors who have directed movies with Brad Pitt?
3. Who are the spouses and children of Whitney Houston?

```
PREFIX dbpedia: <http://dbpedia.org/resource/>
PREFIX dbo: <http://dbpedia.org/ontology/>
SELECT ?person
WHERE {
  dbpedia:Samuel_L._Jackson dbo:spouse* ?person.
}
```

```
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?movie
WHERE {
  [ rdfs:label "Brad Pitt"@en ]
    ^dbo:starring/dbo:director/^dbo:director ?movie.
}
```

```
PREFIX dbpedia: <http://dbpedia.org/resource/>
PREFIX dbo: <http://dbpedia.org/ontology/>
SELECT ?person
WHERE {
  dbpedia:Whitney_Houston
    (dbo:spouse|dbo:child) ?person.
}
```
