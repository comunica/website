---
title: 'SPARQL Architecture'
description: 'The high-level software architecture of Comunica for implementing SPARQL.'
---

This document gives an overview of the architecture that implements SPARQL query execution in Comunica.
This builds upon the [core architecture](/docs/modify/advanced/architecture_core/) of _actors_, _mediators_, and _buses_.

## Overview

The figure below shows an overview of the most relevant _buses_ and _actors_ that are used in Comunica SPARQL.
Some buses such as _Query Operation_ contain a large number of subscribed actors,
which is why the figure below only shows a few as illustration. 

[Click on the figure](/img/architecture_sparql.svg) to view it in full screen, or view the [PDF version](/img/architecture_sparql.pdf).

<div class="docs-intro-img">
  <a href="/img/architecture_sparql.svg"><img src="/img/architecture_sparql.svg" alt="SPARQL Architecture" style="width:100%" \></a>
  <strong>
  </strong>
</div>

## Data flow for a query execution

For a given SPARQL query, the following logic flow occurs: (_some parts are omitted for simplicity_)

* **Init:** All Comunica engines start here. This is where they accept generic input parameters, such as CLI arguments.
    * **Comunica SPARQL:** Extracts things like query and output format from input arguments.
        * **Context Preprocess:** A bus in which actors can optionally modify the [query context](/docs/query/advanced/context/).
        * **SPARQL Parse:** Parsing the SPARQL query into SPARQL algebra.
        * **Optimize Query Operation:** Applies optional optimizations to the SPARQL algebra before actual execution.
        * **Query Operation:** Executes the query operation.
            * **Join:** Handles joins between multiple query operations via its own separate bus.
            * **Quad Pattern:** Evaluates triple/quad pattern operations via the *RDF Resolve Quad Pattern* bus, which translates a quad pattern into a stream of quad.
                * **Federated:** Translates the array of sources in the [query context](/docs/query/advanced/context/) into the union of quad streams by resolving each source separately in the *RDF Resolve Quad Pattern* bus.
                * **Hypermedia:** Resolves the quad stream of a resource by interpreting hypermedia links and controls.
                    * **Dereference RDF:** Dereferences a path or URL into a stream of quads, which internally makes use of several parsers in the *RDF Parse* bus, and it uses data lookup actors from the *Dereference* bus.
                    * **RDF Metadata:** Extracts the quads relevant for metadata from the stream of data quads.
                    * **RDF Metadata Extract:** Create an object with metadata for a given metadata quad stream.
                    * **RDF Metadata Accumulate:** Merge the metadata object with any previous metadata (only applies if multiple links are being followed).
                    * **RDF Resolve Hypermedia Links:** Determines which links should be followed from the metadata of the current source.
                    * **RDF Resolve Hypermedia Links Queue:** Creates a link queue that enables different strategies for queueing links.
                    * **RDF Resolve Hypermedia:** Handle a source based on the extracted metadata.
                        * **None:** The source is considered a raw RDF file, for which all data quads matching the quad pattern are returned.
                        * **SPARQL:** The source is considered a SPARQL endpoint if it has a service description, for which we use the SPARQL protocol.
                        * **QPF:** The source is considered a [Triple/Quad Pattern Fragments](https://linkeddatafragments.org/) interface.
        * **SPARQL Serialize:** Serializes the query result into a text-based serialization.

[Click here for a full list of buses and actors](/docs/modify/advanced/buses/).
