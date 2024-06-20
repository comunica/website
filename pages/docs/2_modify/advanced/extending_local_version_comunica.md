---
title: 'Using Local Changes to Base Comunica in Comunica Extensions'
description: 'Guide on how to extend a local version of Comunica or use a local version of Comunica with an existing extension'
---

Various  [extensions](https://comunica.dev/docs/modify/extensions/) of Comunica exist. 
These extensions utilize packages from the [base Comunica](https://github.com/comunica/comunica) framework and add additional packages or engine configurations. 
When working on local changes to the base Comunica and needing to use these changes in an extension, you must link your local development version of Comunica with your extension project.
This page introduces some methods to achieve this, though other methods are possible.

## Lerna-linker

Lerna-linker is a script designed to facilitate package linking in a Lerna monorepo. It iterates over all packages, executing `yarn unlink` and `yarn link` on each. It then saves all linked packages and runs `yarn link <package>` for each linked package in the Comunica extension.

### Installation

Install the script globally using the following:

```bash
$ npm install -g lerna-linker
```

### Usage

Assume the local version of Comunica is located at `path/to/comunica` and the extension at `path/to/comunica-extension`.

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
 ```

 This command will unlink the base Comunica packages from the extension.

By following these steps, you can effectively manage local changes to the base Comunica framework and ensure they are utilized within your extensions. Note that linking multiple different development versions simultaneously does not work, as running `$ lerna-linker linkSource` will overwrite all previously made links.