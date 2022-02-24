---
title: 'Hypermedia'
description: 'Discovery of data source capabilities during query execution.'
---

Comunica enables **[hypermedia](https://en.wikipedia.org/wiki/HATEOAS)-driven query execution**.
This allows users to provide data sources by URL,
and Comunica will automatically detect the querying capabilities for this source
to determine an efficient query execution plan. 

This strategy makes it so that when providing a link to a SPARQL endpoint (e.g. https://dbpedia.org/sparql),
communication will be done using SPARQL queries.
While when providing a link to a plain RDF file (e.g. http://ruben.verborgh.org/profile/),
the whole file will be downloaded and queried in-memory.

<div class="note">
This page only describes the handling of hypermedia for read queries.
The handling of hypermedia for update queries happens in a very similar manner,
with the main difference that the [RDF Resolve Hypermedia bus](/docs/modify/advanced/buses/#rdf-resolve-hypermedia)
is replaced by the [RDF Update Hypermedia bus](/docs/modify/advanced/buses/#rdf-update-hypermedia).
</div>

## Hypermedia actor

The actor in Comunica that drives hypermedia handling is
[`@comunica/actor-rdf-resolve-quad-pattern-hypermedia`](https://github.com/comunica/comunica/tree/master/packages/actor-rdf-resolve-quad-pattern-hypermedia).
This actor is registered to the [RDF Resolve Quad Pattern bus](/docs/modify/advanced/buses/#rdf-resolve-quad-pattern).
This means that this actor will be invoked for every triple/quad pattern in the query.

<div class="note">
The <a href="/docs/modify/advanced/architecture_sparql/">SPARQL architecture</a>
shows how this hypermedia actor relates to all other actors and buses.
</div>

## Steps for handling hypermedia

For each URL-based data source,
the hypermedia actor will always go through the following steps:

1. Dereference RDF ([Dereference RDF bus](/docs/modify/advanced/buses/#dereference-rdf))
2. Split data and metadata streams ([RDF Metadata bus](/docs/modify/advanced/buses/#rdf-metadata))
3. Extract metadata as object ([RDF Metadata Extract bus](/docs/modify/advanced/buses/#rdf-metadata-extract))
4. Determine links to other sources ([RDF Resolve Hypermedia Links bus](/docs/modify/advanced/buses/#rdf-resolve-hypermedia-links))
5. Create a queue for managing links ([RDF Resolve Hypermedia Links Queue bus](/docs/modify/advanced/buses/#rdf-resolve-hypermedia-links-queue))
6. Handle source based on metadata ([RDF Resolve Hypermedia bus](/docs/modify/advanced/buses/#rdf-resolve-hypermedia))

Hereafter, we go over these three steps using three example sources:

1. https://dbpedia.org/sparql
2. http://fragments.dbpedia.org/2016-04/en
3. https://ruben.verborgh.org/profile/

## 1. Dereference RDF

An HTTP(S) request is done to retrieve the RDF data at the given location
via [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation).
Different ways of doing this may exist in the [Dereference RDF bus](/docs/modify/advanced/buses/#dereference-rdf).
Concretely, the input is an URL, and the output is a stream of parsed RDF triples/quads.

For example:

1. https://dbpedia.org/sparql
```turtle
ns1:sparql	rdf:type	sd:Service ;
	        sd:endpoint	ns1:sparql ;
	        sd:feature	sd:UnionDefaultGraph ,
		    sd:DereferencesURIs .
@prefix ns3:	<http://www.w3.org/ns/formats/> .
ns1:sparql	sd:resultFormat	ns3:SPARQL_Results_JSON ,
		    ns3:SPARQL_Results_XML ,
		    ns3:Turtle ,
		    ns3:N-Triples ,
		    ns3:N3 ,
		    ns3:RDF_XML ,
		    ns3:SPARQL_Results_CSV ,
		    ns3:RDFa ;
	        sd:supportedLanguage	sd:SPARQL10Query ;
	        sd:url	ns1:sparql .
```
2. http://fragments.dbpedia.org/2016-04/en
```turtle
<https://fragments.dbpedia.org/#dataset> hydra:member <https://fragments.dbpedia.org/2016-04/en#dataset>.
<https://fragments.dbpedia.org/2016-04/en#dataset> a void:Dataset, hydra:Collection;
    void:subset <https://fragments.dbpedia.org/2016-04/en>;
    hydra:search _:triplePattern.
_:triplePattern hydra:template "https://fragments.dbpedia.org/2016-04/en{?subject,predicate,object}";
    hydra:variableRepresentation hydra:ExplicitRepresentation;
    hydra:mapping _:subject, _:predicate, _:object.
_:subject hydra:variable "subject";
    hydra:property rdf:subject.
_:predicate hydra:variable "predicate";
    hydra:property rdf:predicate.
_:object hydra:variable "object";
    hydra:property rdf:object.
<https://fragments.dbpedia.org/2016-04/en> void:subset <https://fragments.dbpedia.org/2016-04/en>;
    a hydra:PartialCollectionView;
    dcterms:title "Linked Data Fragment of DBpedia 2016-04"@en;
    dcterms:description "Triple Pattern Fragment of the 'DBpedia 2016-04' dataset containing triples matching the pattern { ?s ?p ?o }."@en;
    dcterms:source <https://fragments.dbpedia.org/2016-04/en#dataset>;
    hydra:totalItems "1040358853"^^xsd:integer;
    void:triples "1040358853"^^xsd:integer;
    hydra:itemsPerPage "100"^^xsd:integer;
    hydra:first <https://fragments.dbpedia.org/2016-04/en?page=1>;
    hydra:next <https://fragments.dbpedia.org/2016-04/en?page=2>.
<http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2> dbpprop:date "1899-05-06"^^xsd:date;
    dbpprop:isCitedBy <http://dbpedia.org/resource/Tierce_(unit)>;
    dbpprop:newspaper "Biloxi Daily Herald";
    dbpprop:page "6";
    dbpprop:title "A New System of Weights and Measures";
    dbpprop:url <http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2>.
...
```
3. https://ruben.verborgh.org/profile/
```turtle
<https://ruben.verborgh.org/profile/>
    a foaf:Document, foaf:PersonalProfileDocument;
    rdfs:label "Ruben Verborgh’s FOAF profile"@en;
    foaf:maker :me;
    foaf:primaryTopic :me.
:me a foaf:Person;
    foaf:name  "Ruben Verborgh"@en, "Ruben Verborgh"@nl;
    rdfs:label "Ruben Verborgh"@en, "Ruben Verborgh"@nl;
    vcard:fn   "Ruben Verborgh"@en, "Ruben Verborgh"@nl;
    con:preferredURI "https://ruben.verborgh.org/profile/#me";
    foaf:givenName "Ruben"@en, "Ruben"@nl;
    foaf:familyName "Verborgh"@en, "Verborgh"@nl;
...
```

## 2. Split data and metadata streams

Some RDF sources may include metadata inside the document,
such as [Triple Pattern Fragments](https://linkeddatafragments.org/specification/triple-pattern-fragments/).
As such, there needs to be a way to distinguish between data and metadata triples,
for which different strategies exist in the [RDF Metadata bus](/docs/modify/advanced/buses/#rdf-metadata).

For example:

1. https://dbpedia.org/sparql

**Data:** _empty_

**Metadata:**
```turtle
ns1:sparql	rdf:type	sd:Service ;
	        sd:endpoint	ns1:sparql ;
	        sd:feature	sd:UnionDefaultGraph ,
		    sd:DereferencesURIs .
@prefix ns3:	<http://www.w3.org/ns/formats/> .
ns1:sparql	sd:resultFormat	ns3:SPARQL_Results_JSON ,
		    ns3:SPARQL_Results_XML ,
		    ns3:Turtle ,
		    ns3:N-Triples ,
		    ns3:N3 ,
		    ns3:RDF_XML ,
		    ns3:SPARQL_Results_CSV ,
		    ns3:RDFa ;
	        sd:supportedLanguage	sd:SPARQL10Query ;
	        sd:url	ns1:sparql .
```
2. http://fragments.dbpedia.org/2016-04/en

**Data:**
```turtle
<http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2> dbpprop:date "1899-05-06"^^xsd:date;
    dbpprop:isCitedBy <http://dbpedia.org/resource/Tierce_(unit)>;
    dbpprop:newspaper "Biloxi Daily Herald";
    dbpprop:page "6";
    dbpprop:title "A New System of Weights and Measures";
    dbpprop:url <http://0-access.newspaperarchive.com.lib.utep.edu/us/mississippi/biloxi/biloxi-daily-herald/1899/05-06/page-6?tag=tierce+wine&rtserp=tags/tierce-wine?page=2>.
...
```
**Metadata:**
```turtle
<https://fragments.dbpedia.org/#dataset> hydra:member <https://fragments.dbpedia.org/2016-04/en#dataset>.
<https://fragments.dbpedia.org/2016-04/en#dataset> a void:Dataset, hydra:Collection;
    void:subset <https://fragments.dbpedia.org/2016-04/en>;
    hydra:search _:triplePattern.
_:triplePattern hydra:template "https://fragments.dbpedia.org/2016-04/en{?subject,predicate,object}";
    hydra:variableRepresentation hydra:ExplicitRepresentation;
    hydra:mapping _:subject, _:predicate, _:object.
_:subject hydra:variable "subject";
    hydra:property rdf:subject.
_:predicate hydra:variable "predicate";
    hydra:property rdf:predicate.
_:object hydra:variable "object";
    hydra:property rdf:object.
<https://fragments.dbpedia.org/2016-04/en> void:subset <https://fragments.dbpedia.org/2016-04/en>;
    a hydra:PartialCollectionView;
    dcterms:title "Linked Data Fragment of DBpedia 2016-04"@en;
    dcterms:description "Triple Pattern Fragment of the 'DBpedia 2016-04' dataset containing triples matching the pattern { ?s ?p ?o }."@en;
    dcterms:source <https://fragments.dbpedia.org/2016-04/en#dataset>;
    hydra:totalItems "1040358853"^^xsd:integer;
    void:triples "1040358853"^^xsd:integer;
    hydra:itemsPerPage "100"^^xsd:integer;
    hydra:first <https://fragments.dbpedia.org/2016-04/en?page=1>;
    hydra:next <https://fragments.dbpedia.org/2016-04/en?page=2>.
```

3. https://ruben.verborgh.org/profile/

**Data:**
```turtle
<https://ruben.verborgh.org/profile/>
    a foaf:Document, foaf:PersonalProfileDocument;
    rdfs:label "Ruben Verborgh’s FOAF profile"@en;
    foaf:maker :me;
    foaf:primaryTopic :me.
:me a foaf:Person;
    foaf:name  "Ruben Verborgh"@en, "Ruben Verborgh"@nl;
    rdfs:label "Ruben Verborgh"@en, "Ruben Verborgh"@nl;
    vcard:fn   "Ruben Verborgh"@en, "Ruben Verborgh"@nl;
    con:preferredURI "https://ruben.verborgh.org/profile/#me";
    foaf:givenName "Ruben"@en, "Ruben"@nl;
    foaf:familyName "Verborgh"@en, "Verborgh"@nl;
...
```

**Metadata:** _empty_

## 3. Extract metadata as object

Using actors on the [RDF Metadata Extract bus](/docs/modify/advanced/buses/#rdf-metadata-extract),
relevant parts of the metadata stream are identified,
and a convenient metadata object is constructed for later use.

For example:

1. https://dbpedia.org/sparql
```json
{
  "sparqlService": "https://dbpedia.org/sparql"
}
```
2. http://fragments.dbpedia.org/2016-04/en
```json
{
  "first": "https://fragments.dbpedia.org/2016-04/en?page=1",
  "next": "https://fragments.dbpedia.org/2016-04/en?page=2",
  "searchForms": {
    "values": [
      {
        "mappings": {
          "subject": "http://www.w3.org/1999/02/22-rdf-syntax-ns#subject",
          "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate",
          "object": "http://www.w3.org/1999/02/22-rdf-syntax-ns#object"
        },
        "template": "https://fragments.dbpedia.org/2016-04/en{?subject,predicate,object}"
      }
    ]
  },
  "totalItems": 1040358853
}
```
3. https://ruben.verborgh.org/profile/
```json
{}
```

## 4. Determine links to other sources

Based on the detected metadata, links are extracted that can optionally be followed.
These links are determined using actors on the [RDF Resolve Hypermedia Links bus](/docs/modify/advanced/buses/#rdf-resolve-hypermedia-links).

For example:

1. https://dbpedia.org/sparql: _None_
2. http://fragments.dbpedia.org/2016-04/en: https://fragments.dbpedia.org/2016-04/en?page=2
3. https://ruben.verborgh.org/profile/: _None_

## 5. Create a queue for managing links

Using the [RDF Resolve Hypermedia Links Queue bus](/docs/modify/advanced/buses/#rdf-resolve-hypermedia-links-queue),
a [`ILinkQueue`](https://comunica.github.io/comunica/interfaces/bus_rdf_resolve_hypermedia_links_queue.ilinkqueue.html) instance is created
using which the order is determined to process links.

By default, this will be a queue that processes links in FIFO order.

## 6. Handle source based on metadata

Finally, the [RDF Resolve Hypermedia bus](/docs/modify/advanced/buses/#rdf-resolve-hypermedia)
contains actors that can handle sources based on the extracted metadata.

Concretely, the detected metadata will be given to each actor on the bus,
and the actor that can handle it with the best _filtering capabilities_
will be allowed to handle it.

For example:

1. https://dbpedia.org/sparql: SPARQL query to https://dbpedia.org/sparql
2. http://fragments.dbpedia.org/2016-04/en: Fill in `https://fragments.dbpedia.org/2016-04/en{?subject,predicate,object}`, and follow all subsequent next-page links.
3. https://ruben.verborgh.org/profile/: No hypermedia, so fallback to querying over all triples in the returned data stream.
