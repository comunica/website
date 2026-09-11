---
title: 'Exposing your custom config as an npm package using Comunica Packager'
description: 'Wrap your config in an npm package, and expose a CLI tool and a JavaScript API using the simple Comunica
Packager application.'
---

In this guide, we will yet again wrap our custom config into a new npm package but this time we will be using the
Comunica Packager.

The difference here is that the application will do most of the work for us. This includes the `package.json`,
the CLI tools, the JavaScript API and finally the structure of the engine configuration.

## 1. Open the application and select the Comunica SPARQL preset

Open the application [here](https://comunica.github.io/comunica-packager/) and click on `Import config`. When the
dropdown opens, click on `Comunica SPARQL`.

<img src="/img/select_preset.png" alt="select preset" width="750"/>

## 2. Select the correct set and delete the unnecessary actors

On the left, select the set `sparql-queryoperators` in the `Sets` section. Wait until everything is loaded if necessary
and scroll until you see the actors of type `ActorQueryOperationConstruct` and `ActorQueryOperationDescribeSubject` if
they are not on the screen.

<img src="/img/click_sparql_queryoperators.png" alt="select preset" width="750"/>

Delete each actor respectively by clicking on the close button on the top right of each
actor and subsequently clicking on confirm.

<img src="/img/confirm_delete.png" alt="select preset" width="750"/>

## 3. Export configuration and optionally fill in package information

Now, you are ready to export this configuration. After pressing the `Export config` button in the top bar, a screen will
pop up where you can optionally fill in package information such as the package name and the author. Whenever you're
ready to finish you can press the `Export` button on the pop up screen to download a zip file containing all the
necessary files for this configuration.


<img src="/img/export_config.png" alt="select preset" width="750"/>