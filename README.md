# Comunica website
[![Build Status](https://github.com/comunica/website//workflows/Build%20and%20Deploy/badge.svg)](https://github.com/comunica/website/actions?query=workflow%3A%22Build+and+Deploy%22)

Source code for the [Comunica](https://comunica.dev/) website.

## Contributing

Requirements: [Node.JS](https://nodejs.org/en/) 8.0 or higher. 

After forking and cloning this git repository, install using npm:
```bash
$ npm install
```

All documentation pages are written in markdown, and are present in `pages/`.
New pages should always have the `.md` extension.

Run `npm run dev` to start a live development server.

**Warning:** For compiling the bounties page, you will need to set a [`GITHUB_TOKEN`](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) in your environment variables to access the GitHub API.

## License
This website is written by [Ruben Taelman](https://www.rubensworks.net/).

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/)
and released under the [MIT license](http://opensource.org/licenses/MIT).
