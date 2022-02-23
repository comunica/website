---
title: 'Query using the latest development version'
description: 'If you want to make use of the latest changes that are not released yet' 
---

While the [Comunica GitHub repository](https://github.com/comunica/comunica) receives regular commits,
with fixes for bugs or new features,
these changes are not always immediately published as a new release on the npm package manager.

While we always recommend using a released version of Comunica,
there are situations where you may want to make use of the **latest development version** from GitHub instead.
For example, if your application depends on a new _feature_ or _fix_ in Comunica,
and you already want to develop or test your application before the new Comunica release is available.

In this guide, we will do this by setting up the **Comunica development environment**.

## 1. Setup the Comunica development environment

If you want to make use of the latest development version,
you will have to **clone** the GitHub repository,
and **install** it via the [Yarn package manager](https://yarnpkg.com/):
```bash
$ git clone https://github.com/comunica/comunica.git
$ cd comunica
$ yarn install
```

<div class="note">
Setting up the development via the npm package manager will not work due to the Comunica repository making use
of the <a href="https://classic.yarnpkg.com/en/docs/workspaces/">Yarn workspaces functionality</a>.
</div>

## 2. Querying from the command line

If installation is successful, you can navigate to any package and make use of it
similar to how you would when it has been installed via npm.

For example, executing a SPARQL query from the command line with Comunica SPARQL
can be done by navigating to `engines/query-sparql`, and invoking `bin/query.js`:
```bash
# cd engines/query-sparql
$ node bin/query.js https://fragments.dbpedia.org/2016-04/en \
    "SELECT * WHERE { ?s ?p ?o } LIMIT 100"
``` 

You can execute any of the commands explained in the [CLI guide](/docs/query/getting_started/query_cli/)
by simply replacing `comunica-sparql` with `node bin/query.js`.

If you want to [set up a SPARQL endpoint](/docs/query/getting_started/setup_endpoint/),
you can use `node/http.js` instead of `comunica-sparql-http`.

## 3. Linking Comunica SPARQL to your package

If you have a [JavaScript application that makes use of Comunica SPARQL](/docs/query/getting_started/query_app/),
then you can **link** it to your local Comunica development environment.

This can be done by first indicating that Comunica SPARQL can be linked (starting from the Comunica development environment folder):
```bash
$ cd engines/query-sparql
$ yarn link
```

Next, in the folder of your JavaScript package,
we can link Comunica SPARQL as follows:
```bash
$ yarn link "@comunica/query-sparql"
```

Now, your application will use the development version of Comunica instead.

<div class="note">
If you want to go back to the npm version of Comunica SPARQL,
then you first have to unlink it from your application by running <code>yarn unlink "@comunica/query-sparql"</code>.
</div>
