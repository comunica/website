---
title: 'SPARQL Architecture'
description: 'The high-level software architecture of Comunica for implementing SPARQL.'
wip: true
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

Hereafter, all buses are listed with their registered actors.

TODO: buses with description and ALL actors

## Init

_Package: [`@comunica/bus-init`](https://github.com/comunica/comunica/tree/master/packages/bus-init)_

TODO: description

### Actors

| Name | Package | Description |
| ---- | ------- | ----------- |
| Comunica SPARQL | [`@comunica/actor-init-sparql`](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql) | Initializes SPARQL query execution by parsing the given query, optimizing, executing, and serializing results. |
