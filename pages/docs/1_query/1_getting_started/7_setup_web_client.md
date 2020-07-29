---
title: 'Setting up a Web client'
description: 'Set up a user-friendly static Web page where SPARQL queries can be executed client-side'
---

If you want to easily **demonstrate** a couple of SPARQL queries on a **Web page**,
or if you want to show off your custom built Comunica engine,
then you can do this using the [Comunica jQuery widget](https://github.com/comunica/jQuery-Widget.js/).

As an example, a public instance of this widget is available at http://query.linkeddatafragments.org/.

## 1. Installation

Since Comunica runs on Node.js, make sure you have [Node.js installed](https://nodejs.org/en/) on your machine.

Next, we can [clone the Comunica jQuery widget repo](https://github.com/comunica/jQuery-Widget.js/), and install it:
```bash
$ git clone https://github.com/comunica/jQuery-Widget.js.git
$ cd jQuery-Widget.js
$ npm install
```

## 2. Starting the built-in Web server

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

## 3. Building a static Website for production

The built-in Web server should primarily be used for testing.
If you want to deploy this page on a Web server,
something like [NGINX](https://www.nginx.com/) or [GitHub pages](https://pages.github.com/) is recommended.

You can build a production-ready version of this page as follows:
```bash
$ npm run build
```

The contents of the `build` folder can now be deployed on to any Web server.

## 4. Changing the default queries and datasets

You'll notice that the page contains some example queries and datasets by default.
You can change these by modifying the contents of the `queries/` folder and the `settings.json` file.

<div class="note">
When running the built-in dev server, the process will have to be restarted after every change to the queries or settings.
</div>
