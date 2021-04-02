---
title: 'Setting up a Web client'
description: 'Set up a user-friendly static Web page where SPARQL queries can be executed client-side'
---

If you want to easily **demonstrate** a couple of SPARQL queries on a **Web page**,
or if you want to show off your custom built Comunica engine,
then you can do this using the [Comunica jQuery widget](https://github.com/comunica/jQuery-Widget.js/).

As an example, a public instance of this widget is available at http://query.linkeddatafragments.org/.

## 1. Install from npm

### 1.1. Installation

Since Comunica runs on Node.js, make sure you have [Node.js installed](https://nodejs.org/en/) on your machine.

Next, we can install [`@comunica/web-client-generator`](https://github.com/comunica/jQuery-Widget.js/):
```bash
$ npm install -g @comunica/web-client-generator
```

### 1.2. Building a static Website for production

After installing, you can build a production-ready version of [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql):
```bash
$ comunica-web-client-generator
```

The resulting `build` directory can be deployed on a Web server
using something like [NGINX](https://www.nginx.com/) or [GitHub pages](https://pages.github.com/).

### 1.3. Build a custom config

In order to override the [default config](https://github.com/comunica/jQuery-Widget.js/blob/master/config/config-default.json), you can pass one as argument.

```bash
$ comunica-web-client-generator config/config-default.json
```

This assumes that your engine's dependencies are available in your working directory.
If this is not the case, provide a path to your engine's directory via the `-c` option:

```bash
$ comunica-web-client-generator path/to/engine/config/config-default.json -c path/to/engine/
```

### 1.4. Change settings and queries

The default datasources and queries can be changed as follows:

```bash
$ comunica-web-client-generator -s settings.json -q queries
```

Examples for the [`settings.json`](https://github.com/comunica/jQuery-Widget.js/blob/master/settings.json) file
and the [`queries`](https://github.com/comunica/jQuery-Widget.js/tree/master/queries) directory.

### 1.5. Show all available options

All available options for this command are:

```bash
$ comunica-web-client-generator -h
comunica-web-client-generator generates Comunica Web clients
  Usage:
    comunica-web-client-generator config/config-default.json
    comunica-web-client-generator config/config-default.json -d my-build/ -s my-settings.json
    comunica-web-client-generator config/config-default.json -q my-queries/
    comunica-web-client-generator config/config-default.json -w my-webpack.config.js

  Options:
    -d            Destination of the built output (defaults to build)
    -m            The compilation mode (defaults to production, can also be development)
    -c            Path to the main Comunica module (defaults to cwd)
    -q            Path to custom queries directory
    -s            Path to custom settings file
    -w            Path to custom Webpack config
    --help        Print this help message
```

## 2. Install from GitHub

### 2.1. Installation

Since Comunica runs on Node.js, make sure you have [Node.js installed](https://nodejs.org/en/) on your machine.

Next, we can [clone the Comunica jQuery widget repo](https://github.com/comunica/jQuery-Widget.js/), and install it:
```bash
$ git clone https://github.com/comunica/jQuery-Widget.js.git
$ cd jQuery-Widget.js
$ npm install
```

### 2.2. Starting the built-in Web server

The widget comes with its own (optional) Web server,
which can be started as follows:
```bash
$ npm run dev
```

Now, you page will be live at `http://localhost:8080`.

<div class="note">
This port can be changed to something else by adding the <code>--port</code> option
within the <code>dev</code> script in <code>package.json</code>.
</div>

### 2.3. Building a static Website for production

The built-in Web server should primarily be used for testing.
If you want to deploy this page on a Web server,
something like [NGINX](https://www.nginx.com/) or [GitHub pages](https://pages.github.com/) is recommended.

You can build a production-ready version of this page as follows:
```bash
$ npm run build
```

The contents of the `build` folder can now be deployed on to any Web server.

### 2.4. Changing the default queries and datasets

You'll notice that the page contains some example queries and datasets by default.
You can change these by modifying the contents of the `queries/` folder and the `settings.json` file.

<div class="note">
When running the built-in dev server, the process will have to be restarted after every change to the queries or settings.
</div>
