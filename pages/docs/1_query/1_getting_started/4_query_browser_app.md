---
title: 'Querying in a JavaScript browser app'
description: 'Execute SPARQL queries from within your client-side browser application using the JavaScript API.'
---

Comunica can run in both [Node.js JavaScript applications](/docs/query/getting_started/query_app/),
and as **client-side applications in Web browsers**.

## 1. Using a pre-built version

The easiest way to use Comunica in your Web app,
is by using a pre-built Comunica SPARQL version that is served via a GitHub CDN:
```html
<script src="https://rdf.js.org/comunica-browser/versions/v4/engines/query-sparql/comunica-browser.js"></script>
<script language="JavaScript">
  new Comunica.QueryEngine().queryBindings(`
  SELECT * {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100
`, {
  sources: ['https://fragments.dbpedia.org/2015/en'],
}).then(function (bindingsStream) {
  bindingsStream.on('data', function (data) {
    // Each variable binding is an RDFJS term
    console.log(data.get('s').value + ' ' + data.get('p').value + ' ' + data.get('o').value);
  });
});
</script>
```

<div class="note">
The code example above will always make use of the the latest Comunica version in the 4.x.x range.
Instead, you can <a href="https://github.com/rdfjs/comunica-browser#readme">use a specific version</a>.
</div>

The full API of Comunica is available under the `Comunica` namespace.
More information on its usage can be found in the guide on
[using Comunica in a JavaScript app](/docs/query/getting_started/query_app/).

## 2. Bundling for the browser

Comunica is compatible with browser bundler tools such as [Webpack](https://www.npmjs.com/package/webpack)
and [browserify](http://browserify.org/).
If you are not familiar with these tools,
you can read the following guides:
* [Webpack: Creating a Bundle – getting started](https://webpack.js.org/guides/getting-started/#creating-a-bundle)

You will need to create a "UMD bundle" and supply a name (e.g. with the -s Comunica option in browserify).

<div class="note">
Refer to our specific guide on
<a href="/docs/modify/advanced/browser_builds/">building for the browser</a>
if you want to build specific configurations of Comunica for the browser.
</div>

<div class="note">
If want to use Vite instead of Webpack, you may need to work around an issue related to <code>process.env</code>,
for which a <a href="https://github.com/comunica/comunica/issues/1523">workaround</a> is available.
</div>
