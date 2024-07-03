---
title: 'Linking local Comunica versions to other projects'
description: 'Guide on how to use a local development version of Comunica with another local project'
---


In cases where a local development version of Comunica is consumed as a dependency of another project, linking the local development version of Comunica to the project is required.

For example, various extensions of Comunica exist. These extensions utilize packages from the base Comunica framework and add additional packages or engine configurations. When working on local changes to base Comunica and needing to use these changes in an extension, you must link the local development version of  Comunica with the extension project. This page introduces a method to achieve this, though other methods are possible.

This method does not require publishing the development version of Comunica to NPM, thus it is useful for testing changes before they are made public.

## Lerna-linker

Lerna-linker is a script designed to facilitate package linking in a Lerna monorepo. It iterates over all packages, executing `yarn unlink` and `yarn link` on each. It then saves all linked packages and runs `yarn link <package>` for each linked package in the Comunica extension.

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
