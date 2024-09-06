---
title: 'Linking local Comunica versions to other projects'
description: 'Guide on how to use a local development version of Comunica with another local project'
---

In cases where a local development version of Comunica is consumed as a dependency of another project, linking the local development version of Comunica to the project is required. For example, various extensions of Comunica exist. These extensions utilize packages from the base Comunica framework and add additional packages or engine configurations. When working on local changes to base Comunica and needing to use these changes in an extension, the local development version of Comunica needs to be somehow installed in the extension project.

There exist several methods for installing non-published packages as dependencies, including the support for installation from local paths or git repositories in [yarn add itself](https://yarnpkg.com/cli/add), so the best solution for a given use case may vary. On this page, we introduce two methods to connect a local development version of Comunica to a project depending on it: Yarn workspaces and lerna-linker.

These methods do not require publishing the development version of Comunica to NPM, thus being useful for testing changes before they are made public.

## Yarn Workspaces

The [workspaces functionality of Yarn](https://yarnpkg.com/features/workspaces) can be used to automatically handle the interlinking process of multiple packages. This approach is already used within the various Comunica monorepositories to manage package interdependencies, and can be extended to link local Comunica packages from a monorepository into another local project without the use of `yarn link`.

<div class="note">
This approach involves the editing of <code>package.json</code> using local relative paths, as well as probable automated modifications to <code>yarn.lock</code> upon install. Such changes will need to be reverted prior to publishing the target project anywhere.
</div>

### Using with a simple local project

For example, given a local project and the Comunica base repository cloned next to each other as follows,

```text
/path/to/comunica
/path/to/project
```

it is possible to include the local versions of Comunica base packages in the project by editing the `package.json` of the local project to include workspace references to the Comunica workspace packages:

```json
{
  "name": "project",
  "private": true,
  "workspaces": [
    "../comunica/engines/*",
    "../comunica/packages/*"
  ],
  ...
}
```

Afterwards, running `yarn install` in the local project directory should result in Yarn simply linking the local Comunica packages in it.


### Using with a local monorepository with Comunica dependencies

The process is identical to that of a simple project structure, except the `package.json` workspaces paths should be added alongside existing ones. For example, to set up the Comunica base and a feature repository for local development, one could clone them next to each other,

```text
/path/to/comunica
/path/to/comunica-feature-repository
```

after which the `package.json` of the feature repository could be modified to include both the existing packages and the local Comunica ones:

```json
{
  "name": "comunica-feature-repository",
  "private": true,
  "workspaces": [
    "../comunica/engines/*",
    "../comunica/packages/*",
    "engines/*",
    "packages/*"
  ],
  ...
}
```

<div class="note">
Because Yarn will use symbolic links for the workspaces packages, they will be linked as they are on disk, rather than through an emulated package install process. This means the packages must have their own dependencies installed and their code built at their source directory.
</div>

## Lerna-linker

The [lerna-linker](https://www.npmjs.com/package/lerna-linker) script is designed to facilitate package linking in a Lerna monorepo. It iterates over all packages, executing `yarn unlink` and `yarn link` on each. It then saves all linked packages and runs `yarn link <package>` for each linked package in the Comunica extension.

### Installation

Install the script globally using the following:

```bash
$ npm install -g lerna-linker
```

### Usage

Assume the local version of Comunica is located at `path/to/comunica` and the extension at `path/to/my-project`.

1\. Link Source Packages by navigating to the base Comunica directory and running:

```bash
$ cd path/to/comunica
$ lerna-linker linkSource 
```

This command links all packages in the base repository.

2\. Link source packages to target by moving to the Comunica extension directory and running:

```bash
$ cd path/to/comunica-extension
$ lerna-linker linkTarget
```

This command links the base Comunica packages to the extension.

3\. Undo Linking of the base Comunica packages by navigating to the Comunica extension directory and running:

```bash
$ cd path/to/comunica-extension
$ lerna-linker unlinkTarget
$ yarn install
```

This command will unlink the base Comunica packages from the extension.

By following these steps, you can effectively manage local changes to the base Comunica framework and ensure they are utilized within the extensions. 

<div class="note">
Linking multiple different development versions simultaneously will not work, as running <code>lerna-linker linkSource</code> will overwrite all previously made links.
</div>
