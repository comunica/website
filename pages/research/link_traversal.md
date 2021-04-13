---
title: 'Link Traversal'
description: 'An overview of research that has been done on Link-Traversal-based Query Processing.'
---

[Link-Traversal-based Query Processing (LTQP)](https://link.springer.com/content/pdf/10.1007/s13222-013-0122-1.pdf) is a querying paradigm
that enables querying over an interlinked set of Linked Data documents
by following links between them.

Research is being done on LTQP through various implementations in Comunica.
This page summarizes ongoing work. 

## 1. Experimental Implementations

A [dedicated (mono)repository](https://github.com/comunica/comunica-feature-link-traversal) has been created
that contains actors for enabling LTQP inside Comunica.

Since there are multiple approaches for handling LTQP,
multiple [configurations](https://github.com/comunica/comunica-feature-link-traversal/tree/master/packages/actor-init-sparql-link-traversal/config).
The default configuration ([`config-default.json`](https://github.com/comunica/comunica-feature-link-traversal/blob/master/packages/actor-init-sparql-link-traversal/config/config-default.json))
contains actor configurations that work best on average.

## 2. Try it out

Below, we list links to several example configurations for LTQP
that have been built as a Web client.

<iframe src="https://comunica.github.io/comunica-feature-link-traversal-web-clients/builds/" width="100%" height="1000px" frameborder="0" marginheight="0" marginwidth="0" scrolling="auto">Loading...</iframe>
