---
title: 'Updating in a JavaScript app'
description: 'Execute SPARQL Update queries from within your application using the JavaScript API.'
---

Comunica SPARQL (`@comunica/query-sparql`) allow you to initiate queries to _update_ data in a certain store.
In this guide, we will build upon [the guide on querying in a JavaScript app](/docs/query/getting_started/query_app/),
and show how you can not only read, but also update data.

## 1. Creating a new query engine and store

The easiest way to create an engine and store is as follows:

```javascript
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const N3 = require('n3');

const myEngine = new QueryEngine();

const store = new N3.Store();
```

We make use of the [`Store` from `N3.js`](https://github.com/rdfjs/N3.js#storing) for these examples.

## 2. Executing INSERT DATA queries

Once you engine has been created, you can use it to execute any SPARQL Update query, such as a `INSERT DATA` query:
```javascript
// Initiate the update
await myEngine.queryVoid(`
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  INSERT DATA
  { 
    <http://example/book1> dc:title "A new book" ;
                           dc:creator "A.N.Other" .
  }`, {
  sources: [ store ],
});

// Prints '2' => the store is updated
console.log(store.size);
```

## 3. Executing DELETE/INSERT WHERE queries

`DELETE/INSERT WHERE` queries allow you to delete and insert new quads,
based on quads that are already available:

```javascript
// Insert initial data
await myEngine.queryVoid(`
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  INSERT DATA
  { 
    <http://example/president25> foaf:givenName "Bill" .
    <http://example/president25> foaf:familyName "McKinley" .
    <http://example/president27> foaf:givenName "Bill" .
    <http://example/president27> foaf:familyName "Taft" .
    <http://example/president42> foaf:givenName "Bill" .
    <http://example/president42> foaf:familyName "Clinton" .
  }`, {
  sources: [ store ],
});

// Rename all occurrences of "Bill" to "William"
await myEngine.queryVoid(`
  PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
  DELETE { ?person foaf:givenName 'Bill' }
  INSERT { ?person foaf:givenName 'William' }
  WHERE
  {
    ?person foaf:givenName 'Bill' 
  }`, {
  sources: [ store ],
});
```

<div class="note">
For more information on the types of update queries that are possible, 
please refer to the <a href="https://www.w3.org/TR/sparql11-update/">SPARQL Update specification</a>.
</div>

## 4. Configure a custom destination

By default, update queries will modify data within the given source.
In some cases, you may want to direct changes to another place.
For example, if you have multiple sources, but you want to direct all changes to a single source.

This can be done by passing a `destination` into the query context:
```javascript
// Insert friends based on common friends from Ruben's
await myEngine.queryVoid(`
  PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
  INSERT
  {
    <http://example/person> foaf:knows ?friend
  }
  WHERE
  {
    <https://www.rubensworks.net/#me> foaf:knows ?friend .
    <https://ruben.verborgh.org/profile/#me> foaf:knows ?friend . 
  }`, {
  sources: [
    'https://www.rubensworks.net/',
    'https://ruben.verborgh.org/profile/',
  ],
  destination: store,
});
```

<div class="note">
Instead of passing an RDF/JS store as destination,
you may also pass <a href="/docs/query/advanced/destination_types/">other types of destinations</a>.  
</div>
