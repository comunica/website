---
title: 'Updating RDF/JS stores'
description: 'If the built-in destination types are not sufficient, you can pass a custom JavaScript object implementing a specific interface.'
---

One of the [different types of destinations](/docs/query/advanced/destination_types/) that is supported by Comunica
is the [RDF/JS `Store` interface](http://rdf.js.org/stream-spec/#store-interface).
This allows you to pass objects as destination to Comunica as long as they implement this interface.

<div class="note">
Learn more about RDF/JS in this <a href="/docs/query/advanced/rdfjs/">RDF/JS guide</a>.
</div>

Several implementations of this `Store` interface exist.
In the example below, we make use of the [`Store` from `N3.js`](https://github.com/rdfjs/N3.js#storing)
that offers one possible implementation when you want to [query over it with Comunica within a JavaScript application](/docs/query/getting_started/query_app/):
```javascript
const store = new N3.Store();

const query = `
PREFIX dc: <http://purl.org/dc/elements/1.1/>
INSERT DATA
{ 
  <http://example/book1> dc:title "A new book" ;
                         dc:creator "A.N.Other" .
}
`;

// Initiate the update
const result = await myEngine.query(query, {
  sources: [store],
});

// Wait for the update to complete
await result.updateResult;

// Prints '2' => the store is updated
console.log(store.size);
```
