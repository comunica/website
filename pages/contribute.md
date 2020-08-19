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
    * Signing the [Contributor License Agreement](https://cla-assistant.io/comunica/comunica)
* Only add the files that are needed, so don't blindly do a `git -a`. (avoid adding editor-specific files)
* A good editor can make your life a lot easier. For example, [WebStorm](https://www.jetbrains.com/community/education/#students) can be used for free with an academic license.

## Write documentation

This website aims to provide detailed documentation on how to use and modify Comunica.
If you see an opportunity for improving this documentation, fixing mistakes, or adding new guides,
you are welcome to contribute via [GitHub](https://github.com/comunica/website).

## Create example code

The [Comunica examples repository](https://github.com/comunica/examples) contains several example packages that modify Comunica,
with details on how they are created and how they work.
Anyone is more than welcome to contribute new example packages to this repository.
For inspiration, you can have a look at the [example requests](https://github.com/comunica/examples/issues?q=is%3Aissue+is%3Aopen+label%3Aexample-request).
