---
title: 'Querying from a Docker container'
description: 'Execute SPARQL queries within a Docker container.'
---

<div class="docs-intro-img">
  <img src="/img/docker.png" alt="Docker logo" style="width:50%" \>
</div>

If for whatever reason you are unable or unwilling to install Node.js,
then you can make use Comunica via [Docker containers](https://www.docker.com/) instead.

Usage of the Comunica SPARQL via Docker can be done via the [`comunica/actor-init-sparql` Docker image](https://hub.docker.com/r/comunica/actor-init-sparql):
```bash
$ docker run -it --rm comunica/actor-init-sparql \
  http://fragments.dbpedia.org/2015-10/en \
  "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```

The signature of this command is identical to the [`comunica-sparql` command](/docs/query/getting_started/query_cli/).

By default, the latest (stable) released version will be pulled and started.
If you want to make use of the latest development version,
which is updated upon each new commit in the [Comunica GitHub repository](https://github.com/comunica/comunica),
then the `dev` tag can be used:
```bash
$ docker run -it --rm comunica/actor-init-sparql:dev \
  http://fragments.dbpedia.org/2015-10/en \
  "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```

A new Docker tag is also created upon each new release,
so you can select a fixed version of Comunica if needed,
such as version 1.14.0:
```bash
$ docker run -it --rm comunica/actor-init-sparql:1.14.0 \
  http://fragments.dbpedia.org/2015-10/en \
  "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```

A list of all available tags can be found on the [Docker hub](https://hub.docker.com/r/comunica/actor-init-sparql/tags).
