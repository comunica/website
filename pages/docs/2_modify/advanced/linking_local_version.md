---
title: 'Linking local Comunica versions to other projects'
description: 'Guide on how to use a local development version of Comunica with another local project'
---

In cases where a local development version of Comunica is consumed as a dependency of another project, linking the local development version of Comunica to the project is required. For example, various extensions of Comunica exist. These extensions utilize packages from the base Comunica framework and add additional packages or engine configurations. When working on local changes to base Comunica and needing to use these changes in an extension, the local development version of Comunica needs to be somehow installed in the extension project.

There exist several methods for installing non-published packages as dependencies, including the support for installation from local paths or git repositories in [yarn add itself](https://yarnpkg.com/cli/add), so the best solution for a given use case may vary. On this page, we introduce two methods to connect a local development version of Comunica to a project depending on it: lerna-linker and Yarn workspaces.

These methods do not require publishing the development version of Comunica to NPM, thus being useful for testing changes before they are made public.

## Lerna-linker

[lerna-linker](https://www.npmjs.com/package/lerna-linker) is a script designed to facilitate package linking in a Lerna monorepo. It iterates over all packages, executing `yarn unlink` and `yarn link` on each. It then saves all linked packages and runs `yarn link <package>` for each linked package in the Comunica extension.

### Installation

Install the script globally using the following:

```bash
$ npm install -g lerna-linker
```

### Usage

Assume the local version of Comunica is located at `path/to/comunica` and the extension at `path/to/my-project`.

1. Link Source Packages by navigating to the base Comunica directory and running:

 ```bash 
    $ cd path/to/comunica
    $ lerna-linker linkSource 
 ```

 This command links all packages in the base repository.
2. Link source packages to target by moving to the Comunica extension directory and running:

 ```bash
    $ cd path/to/comunica-extension
    $ lerna-linker linkTarget
 ```

 This command links the base Comunica packages to the extension.

3. Undo Linking of the base Comunica packages by navigating to the Comunica extension directory and running:
 ```bash
    $ cd path/to/comunica-extension
    $ lerna-linker unlinkTarget
    $ yarn install

 ```

 This command will unlink the base Comunica packages from the extension.

By following these steps, you can effectively manage local changes to the base Comunica framework and ensure they are utilized within the extensions. 

<div class="note">
Linking multiple different development versions simultaneously will not work, as running <code>$lerna-linker linkSource</code> will overwrite all previously made links.
</div>

## Yarn Workspaces

The [workspaces functionality of Yarn](https://yarnpkg.com/features/workspaces) can be used to automatically handle the interlinking process of multiple packages. This approach is already used within the various Comunica monorepositories to manage package interdependencies, and can be extended to link local Comunica packages from a monorepository into another local project without the use of `yarn link`.

<div class="note">
This approach involves the editing of <code>package.json</code> using local relative paths, as well as probable automated modifications to <code>yarn.lock</code> upon install. Such changes will need to be reverted prior to publishing the target project anywhere.
</div>

For example, given:

1. a local version of the Comunica base monorepository at `/path/to/comunica`, and
2. a local project depending on Comunica base packages at `/path/to/project`,

it is possible to add the relative paths to local Comunica packages into `/path/to/project/package.json`:

```json
{
   "name": "project",
   "private": true,
   "workspaces": [
      ".",
      "../comunica/engines/*",
      "../comunica/packages/*"
   ],
   ...
}
```

Afterwards, running `yarn install` in `/path/to/project` should result in Yarn simply linking the local Comunica packages into `project`.

<div class="note">
Because Yarn will use symbolic links for the workspaces packages, they will be linked as they are on disk, rather than through an emulated package install process. This might necessitate changes in the target project's TypeScript configuration to avoid build errors.
</div>
