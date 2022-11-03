---
title: 'Versioning'
description: 'An overview of research that has been done on Query Processing for RDF archives.'
---

Versioned querying enables query execution over RDF archives _at_ specific versions, _between_ certain versions, and _across_ all versions.

Research is being done on versioning through various implementations in Comunica,
in particular on [OSTRICH](https://github.com/rdfostrich/ostrich)-based RDF archives.
This page summarizes ongoing work. 

## Experimental Implementations

A [dedicated (mono)repository](https://github.com/comunica/comunica-feature-versioning) has been created
that contains actors for enabling versioned querying inside Comunica.

The default configuration ([`config-default.json`](https://github.com/comunica/comunica-feature-versioning/blob/master/engines/config-query-sparql-versioning/config/config-default.json))
contains actor configurations for querying [OSTRICH](https://github.com/rdfostrich/ostrich) archives.
