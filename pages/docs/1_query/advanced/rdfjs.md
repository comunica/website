---
title: 'RDF/JS'
description: 'To achieve maximum interoperability between different JavaScript libraries, Comunica builds on top of the RDF/JS specifications.'
---

<div class="docs-intro-img">
  <a href="http://rdf.js.org/"><img src="/img/rdfjs.png" alt="RDF/JS logo" style="width:10%" \></a>
</div>

RDF/JS offers a set of RDF specifications for JavaScript libraries
that are defined by the [RDF JavaScript Libraries W3C community group](https://www.w3.org/community/rdfjs/).
Most of the popular JavaScript libraries adhere to these specifications, which makes it possible to use them interchangeably, and in any combination.
This allows you to for example use an RDF parser from one developer, and pipe its output into an RDF store from another developer.

For most of these specifications, corresponding [TypeScript typings exist](https://www.npmjs.com/package/@types/rdf-js),
and many libraries ship with their own typings as well,
which makes RDFJS especially useful if you want to develop more strongly-typed JavaScript applications.

Comunica is conformant to the following RDF/JS specifications. 

## Data model specification

The foundational part of RDFJS is its [low-level **data model** specification](http://rdf.js.org/data-model-spec/),
in which JavaScript interfaces are described for representing **RDF terms** and **RDF quads**.
Five types of terms exist:

* [Named Node](http://rdf.js.org/data-model-spec/#namednode-interface): Represents a thing by IRI, such as `https://www.rubensworks.net/#me`.
* [Blank Node](http://rdf.js.org/data-model-spec/#blanknode-interface): Represents a thing without an explicit name.
* [Literal](http://rdf.js.org/data-model-spec/#literal-interface): Represents a raw value of a certain datatype, such as `"Ruben"` or `1992`.
* [Variable](http://rdf.js.org/data-model-spec/#variable-interface): Represents a variable, which can be used for matching values within queries.
* [Default Graph](http://rdf.js.org/data-model-spec/#defaultgraph-interface): Represents the default graph in RDF. Other graphs can be represented with named or blank nodes.

[RDF quads](http://rdf.js.org/data-model-spec/#quad-interface) are defined as an object with RDF terms for **subject**, **predicate**, **object** and **graph**.
An RDF triple is an alias of a quad,
where the graph is set to the default graph.
For the remainder of this document, I will just refer to RDF quads.

Finally, a [Data Factory](http://rdf.js.org/data-model-spec/#datafactory-interface) interface is defined,
which allows you to easily create terms and quads that conform to this interface.
Different Data Factory implementations exist, such as [`@rdfjs/data-model`](https://github.com/rdfjs-base/data-model)
and the factory from [`N3.js`](https://github.com/rdfjs/N3.js#interface-specifications).
For example, creating a quad for representing someone's name with a data factory can be done like this:

```javascript
const factory = require('@rdfjs/data-model');

const quad = factory.quad(
  factory.namedNode('https://www.rubensworks.net/#me'), // subject
  factory.namedNode('http://schema.org/name'),          // predicate
  factory.literal('Ruben')                              // object
);
```

Reading raw values from the quad can be done as follows:

```javascript
quad.subject.value === 'https://www.rubensworks.net/#me';
quad.predicate.value === 'http://schema.org/name';
quad.object.value === 'Ruben';
```

For checking whether or not quads and terms are equal to each other, the `equals` method can be used:

```javascript
factory.literal('Ruben').equals(factory.literal('Ruben'));  // true
factory.literal('Ruben').equals(factory.literal('Ruben2')); // false
quad.equals(quad); // true
```

## Stream interfaces

Comunica handles most parts of query execution in a **streaming** manner,
which means that some query results may already be returned
even though other results are still being processed.

Next to the RDFJS data model, a dedicated specification exist for handling [RDF streams](http://rdf.js.org/stream-spec/),
which is of high important to Comunica.

One interface of high importance is the [RDF/JS `Source` interface](http://rdf.js.org/stream-spec/#source-interface).
You can [pass a custom `Source` to Comunica to execute queries over it](/docs/query/advanced/rdfjs_querying/).
