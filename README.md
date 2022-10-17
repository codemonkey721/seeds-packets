# seeds-packets

This repository is the home of the design tokens that power Sprout Social's design system, [Seeds](https://sproutsocial.com/seeds). Each package in this repository contains a set of values related to core design needs like color, space, typography, etc. This codebase takes those values and transforms them into tokens that are consumable across several platforms (CSS variables, JaveScript constants, Sketch palettes, etc.).

You can view [the documentation for our design tokens](https://sproutsocial.com/seeds/resources/tokens/) on Seeds.

## Development

We use [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to manage inter-package dependencies and [Turborepo](https://turborepo.org/) to manage the build process.

### Building packages

To build Seeds packages, simply install dependencies by running `yarn` and build packets with `yarn build`.

- `yarn build` - Build packages

### Top Level Scripts

- `yarn build` - Build all packages
- `yarn clean` - Remove all build artifacts (node_modules, dist, etc.)
- `yarn format` - Format all code with Prettier
- `yarn changeset` - Generate a changeset(s) for a new release
- `yarn version-packages` - Bump package versions and generate a changelog
- `yarn ci:release` - Run build and then publish packages to npm

*note: `yarn version-packages & yarn ci:release` is only run by our CI system and should not be run manually*

### Contributing

- Create a pull request against the `develop` branch
- Get approval and merge the pull request
- A version PR labled `Version Packages` will be created automatically by the github-actions bot. This PR will bump the version of all packages that have changed since the last release and generate a changelog.
- Get approval and merge the version PR

All done! The new version of the package(s) will be published to npm automatically.

### Adding a new color and/or network color

In order to add a new color to our color palette or network-branded color palette, you will need to make an edit to the tokens.json file within [seeds-color](https://github.com/sproutsocial/seeds-packets/blob/develop/packets/seeds-color/tokens.json) or [seeds-networkcolor](https://github.com/sproutsocial/seeds-packets/blob/develop/packets/seeds-networkcolor/tokens.json). After doing this, you can run `yarn build` and the build system will generate appropriate tokens for CSS, SCSS, JS, and several other platforms. If you've just cloned the repo, you may need to run `yarn install && yarn build` in order to make sure the appropriate dependencies have been pulled in.

### Turborepo

Turborepo is a smart build system for JavaScript/TypeScript monorepos: codebases containing multiple projects, often using multiple frameworks, in a single, unified code repository. Turborepo is a tool that helps you manage your monorepo, and it's built on top of Yarn Workspaces.

Turbo's configuration file is located at [turborepo.json](turbo.json) and is required in order to use turbo for root level scripts.
Think of Turborepo as a task runner that can run tasks in parallel across all packages in your monorepo. It's a great way to run tests, build, lint, etc. across all packages in your monorepo. Learn how to configure your pipelines at <https://turborepo.org/docs/core-concepts/running-tasks>
