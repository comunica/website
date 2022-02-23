---
title: 'Exposing your custom config in a Web client'
description: 'Demonstrate your query engine as a static Web page.'
---

In this guide, we use the [Comunica Web Client](https://github.com/comunica/jQuery-Widget.js)
to run our engine client-side as a static Web page,
just like http://query.linkeddatafragments.org/.

This guide assumes you already [expose your custom config as an npm package](/docs/modify/getting_started/custom_init/).

## 1. Cloning the repo

1. Go to https://github.com/comunica/jQuery-Widget.js/
2. Make sure you are logged into your GitHub account.
3. Click on the "Fork" button.

After this, a copy of the jQuery-Widget.js repo will be available for your account
in which you can make all the changes you want.

Next, we will **clone** your fork to the local file system as follows: 
```bash
$ git clone https://github.com/<my-username>/jQuery-Widget.js.git
```
_Make sure your replace `<my-username>` with your GitHub username._

As a final setup step, we can install all dependencies as follows:
```bash
$ cd jQuery-Widget.js
$ yarn install
```

## 2. Plugging in your custom config

By default, the Web client is configured with Comunica SPARQL (`@comunica/query-sparql`).
In this step, we will modify it so that our custom engine is configured instead.

First, install our package as a dependency:
```bash
$ npm install my-package
```
Make sure to replace `my-package` the name of [the package you created before](/docs/modify/getting_started/custom_init/).

Next, replace the `import` in `config/config-default.json` as follows:
```text
{
  ...
  "import": "npmd:my-package/^1.0.0/config/config-default.json"
}
```
Again, make sure to replace `my-package` the name of your package.

## 3. Build and run

These were the only changes required to plug your package into the Web client.

To start a local Web server to test your engine, run the following:
```bash
$ yarn run dev
```

To create an actual build in the `build/` folder that can be deployed to any Web server, run the following:
```bash
$ yarn run build
```

Optionally, you can now [tweak the default datasources and queries](https://github.com/comunica/jQuery-Widget.js#readme). 
