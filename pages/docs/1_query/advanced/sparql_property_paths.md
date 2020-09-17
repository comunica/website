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

1. What information is there about Cam Newton excluding types?
2. Which movies are from directors who have directed movies with Brad Pitt?
3. Who are the spouses and children of Whitney Houston?


## 3. Query for negated properties

What information is there about [Cam Newton](http://dbpedia.org/page/Cam_Newton) excluding types?
To answer this query,
we want to return the object of every triple where Cam Newton is the subject (`dbpedia:Cam_Newton`),
with exception to the triples that have `rdf:type` as predicate.
The SPARQL specification offers NegatedPropertySets to do this.
Their syntax is `!property`,
where `property` is the property and 
it is preceded with `!`.
In our case, the property is `rdf:type`.
This results in the following query:

```
PREFIX dbpedia: <http://dbpedia.org/resource/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT ?o
WHERE {
  dbpedia:Cam_Newton !rdf:type ?o.
}
```

## 4. Query for inverse properties and sequence of properties

```
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?movie
WHERE {
  [ rdfs:label "Brad Pitt"@en ]
    ^dbo:starring/dbo:director/^dbo:director ?movie.
}
```

## 5. Query for alternative properties

The third question is "Who are the spouses and children of Whitney Houston?"
To answer this one, 
we want the query to return every person that is either a spouse or a child of Whitney Houston.
The SPARQL specification offers AlternativePaths to do this.
Their syntax is `property1 | property2`,
where `property1` is the first property and `property2` the second, and
they are separated by a `|`. 
In our case, the properties are `dbo:spouse` and `dbo:child`.
This results in the following query:

```
PREFIX dbpedia: <http://dbpedia.org/resource/>
PREFIX dbo: <http://dbpedia.org/ontology/>
SELECT ?person
WHERE {
  dbpedia:Whitney_Houston
    (dbo:spouse|dbo:child) ?person.
}
```

The results of this query are

```
<http://dbpedia.org/resource/Bobby_Brown>
<http://dbpedia.org/resource/Bobbi_Kristina_Brown>
```

Bobby Brown is her spouse and
Bobbi Kristina Brown is her child.
