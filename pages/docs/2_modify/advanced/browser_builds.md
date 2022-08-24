---
title: 'Browser builds'
description: 'All modules in Comunica can be built for the browser.'
---

Using bundlers such as [Webpack](https://www.npmjs.com/package/webpack)
and [browserify](http://browserify.org/),
you can bundle your custom Comunica engine for the browser.

For this, you have to go the following. 

<div class="note">
If you just want to make use of default Comunica engines such as Comunica SPARQL,
refer to the guide on <a href="/docs/query/getting_started/query_browser_app/">querying in a JavaScript browser app</a>.
</div>

<div class="note">
A full example of a custom Comunica engine that is browser-ready can be found
<a href="https://github.com/comunica/examples/tree/master/packages/configure-sparql-http-solid">here</a>.
</div>

## 1. Compile the config to JavaScript

Not all parts of Comunica can be executed in the browser.
Namely, the dynamic version of Comunica that can read from a config on the local file system.

As such, if we want to expose our engine in the browser,
we have to **compile our config to a JavaScript file**.
This can be done using the `comunica-compile-config` from [`@comunica/runner`](https://github.com/comunica/comunica/tree/master/packages/runner).

For this, add `@comunica/runner` as a dev dependency to your `package.json`,
and add the following script (assuming your config exists at `config/config-default.json`):

```text
{
  ...
  "scripts": {
      ...
      "prepublishOnly": "npm run build:engine",
      "build:engine": "comunica-compile-config config/config-default.json > engine-default.js"
  }
}
```

## 2. Create a browser-specific entrypoint

Next, create a file called **`lib/index-browser.ts`**, which will become the browser variant of `lib/index.ts`.
`lib/index-browser.ts` should at least contain the following:
```typescript
export * from './QueryEngine';
```

## 3. Expose the browser-specific entrypoint

After that, we have to **tell the browser bundling tools that they need to look at `index-browser.js`**
instead of `index.js` for browser apps.
For this, add the following to your `package.json`:
```text
{
  ...
  "browser": {
    "./lib/index.js": "./lib/index-browser.js"
  }
}
```

## 4. Building for the browser

Now you're ready to compile your application for the browser using tools such as [Webpack](https://www.npmjs.com/package/webpack).

<div class="note">
While Comunica required polyfilling using tools such as <a href="https://www.npmjs.com/package/node-polyfill-webpack-plugin"><code>node-polyfill-webpack-plugin</code></a>,
this is not required anymore as of Comunica 2.4.0.
</div>

Please refer to the documentation of [Webpack](https://www.npmjs.com/package/webpack) on how to configure this build process.

Below you can find an example configuration file for Webpack, which may require some fine-tuning depending on your use case:

```javascript
const path = require('path');
const ProgressPlugin = require('webpack').ProgressPlugin;

module.exports = {
  entry: [ '@babel/polyfill', path.resolve(__dirname, 'my-app.js') ],
  output: {
    filename: 'my-app-browser.js',
    path: __dirname, 
    libraryTarget: 'window',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new ProgressPlugin(),
  ]
};

```
