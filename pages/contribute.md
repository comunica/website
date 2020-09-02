---
title: 'Contribute'
description: 'Contribute to the development of Comunica.'
---

## Report bugs or request features

The easiest way to contribute to Comunica is by **reporting the bugs** your encounter,
and **requesting new features** or enchancements.

Both of these should be done via [**GitHub issues**](https://github.com/comunica/comunica/issues).
Make sure to be as descriptive as possible, and completely fill in the requested template.

## Fix bugs or implement new features

If there is a certain bug that annoys you,
or if you see the opportunity for a new feature that would make your life easier,
you are welcome to contribute by submitting a **pull request**.
Before you open a pull request, it is considered a good practise to first
[open an issue](https://github.com/comunica/comunica/issues) or [discuss it with the community](/ask/).

Don't know on what to get started? Have a look at issues tagged with the [`good-first-issue`](https://github.com/comunica/comunica/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue) label
or the [`dev-ready`](https://github.com/comunica/comunica/issues?q=is%3Aissue+is%3Aopen+label%3Adev-ready) label.

When contributing, make sure to keep in mind the following:
* Read how to [set up a development environment](https://github.com/comunica/comunica#development-setup).
* [Use descriptive, imperative commit message](https://chris.beams.io/posts/git-commit/)
* Pull requests should pass all checks
    * Unit tests with 100% branching coverage (`yarn test`)
    * Clean code with passing linter (`yarn run lint`)
    * Code documentation
    * [Pass all spec and integration tests](/docs/modify/advanced/testing/)
    * Signing the [Contributor License Agreement](https://cla-assistant.io/comunica/comunica)
* Only add the files that are needed, so don't blindly do a `git -a`. (avoid adding editor-specific files)
* A good editor can make your life a lot easier. For example, [WebStorm](https://www.jetbrains.com/community/education/#students) can be used for free with an academic license.
* All JSdoc can be found on https://comunica.github.io/comunica/

Tips and tricks:
* Only do `yarn install` in the repo root, and *never* in one of the sub-packages, as this can break your repo.
* `yarn run build` will (re)build all TypeScript to JavaScript. This can also be executed on package-level.
* `yarn run build-watch` will continuously build the TypeScript to JavaScript. This is useful during development.
* `yarn test` and `yarn run lint` execute the tests and linter checks locally. Before a PR is opened, these must always pass, and testing coverage must be 100%.
* When editing configuration files in packages like `actor-init-sparql`, `yarn run prepare` can be executed to compile the JSON files to JavaScript before they can be executed. (not needed when executing dynamically)
* When modifying a dependency package such as [sparqlee](https://github.com/comunica/sparqlee), [Yarn's link functionality](https://classic.yarnpkg.com/en/docs/cli/link/) can be used to force your local version of that dependency to be used in Comunica.

## Write documentation

This website aims to provide detailed documentation on how to use and modify Comunica.
If you see an opportunity for improving this documentation, fixing mistakes, or adding new guides,
you are welcome to contribute via [GitHub](https://github.com/comunica/website).

## Create example code

The [Comunica examples repository](https://github.com/comunica/examples) contains several example packages that modify Comunica,
with details on how they are created and how they work.
Anyone is more than welcome to contribute new example packages to this repository.
For inspiration, you can have a look at the [example requests](https://github.com/comunica/examples/issues?q=is%3Aissue+is%3Aopen+label%3Aexample-request).

## Guidelines for core developers

The following guidelines only apply to people with push access to the Comunica repositories.

### Branching Strategy

The `master` branch is the main development branch.

Releases are `tags` on the `master` branch.

All changes (features and bugfixes) must be done in a separate branch, and PR'd to `master`.

Recursive features must be PR'd to their parent feature branches, as a feature can consist of multiple smaller features.

The naming strategy of branches is as follows:
* Features: `feature/short-name-of-feature`
* Bugfixes: `fix/short-name-of-fix`

### Issue Strategy

Issues should be assigned to people when possible, and must be progressed using the applicable GitHub project boards:
* [Maintenance](https://github.com/orgs/comunica/projects/2)
* [Development](https://github.com/orgs/comunica/projects/3)
* [Documentation](https://github.com/orgs/comunica/projects/4)

General issues progress:
1. To Do: When the issue is accepted and assigned, but not in progress yet.
2. In Progress: When the issue is being worked on by the assignee.
3. To Review: When the issue is resolved, but must be reviewed. This can be attached to a PR.
4. Done: When the issue is resolved and reviewed. If attached to a PR, this can be merged, or closed otherwise.

### Making a new release

Making a new release only requires invoking `yarn run publish` from the repository root, which does the following using [lerna](https://github.com/lerna/lerna):

* Prompts your for providing the new version (major, minor, patch).
* Bump the versions from all changed packages.
* [Generate a changelog](https://github.com/rubensworks/manual-git-changelog.js) from all commits since the last release. The process will halt until you modify (and save) the changelog where needed (remove unneeded commits, and categorize them), and confirm by pressing any key in the console. 
* Release all changed packages to npm.
* Push the tag to GitHub.
* Push to master.
