# SRPG Engine

An engine for creating strategy/tactical RPGs. Built with [three.js](https://threejs.org/) and [TypeScript](https://www.typescriptlang.org/).

## Requirements

The following is either required or highly recommended to contibute to this project.

### Engine

This is a [node](https://nodejs.org/en) project and built on the [npm](https://www.npmjs.com/) ecosystem. You will need to have `node` and `npm` installed to contribute to this project.

If you are using linux or macOS, consider using [n](https://www.npmjs.com/package/n) to install and manage `node`/`npm` versions. If you are using Windows, consider using [nvm-windows](https://github.com/coreybutler/nvm-windows).

### Package Manaagement / Script Running

This project uses [pnpm](https://pnpm.io/) for package management and script running. To install `pnpm` follow the [installation instructions from their site](https://pnpm.io/installation).

### IDE

This project is built assuming you are using [VSCode](https://code.visualstudio.com/), but any text editor will work. Games built with the `srpg-engine` run in the browser, and you can use the browser of your choice.

If you use VSCode, the recommended plugins are included in the workspace config in `.vscode/extensions.json`.

## Available Commands

This project uses `pnpm` as a script runner for various development tasks. Below is a breakdown of the various commands available to you.

### Setup

Before you can run anything, install all of the necessary dependencies with:

```bash
pnpm i
```

### Running the Level Editor

To run the level editor, first start the development server with:

```bash
pnpm run level-editor
```

This will start the `vite` development server and open the level editor in your browser window. From here, any of your changes should be automatically picked up and refreshed.

### Building

To build into production assets, run:

```bash
pnpm run build
```

This will generate the build artifacts for each package and place them in their respective `dist` directory. _These `dist` directories should never be committed to the git repository_.

## Architecture

This project is a monorepo built on `pnpm` [workspaces](https://pnpm.io/workspaces). The following is a breakdown of the application architecture:

- `.vscode`: VSCode IDE configuration
- `core`: Core engine logic: 
  - `api`: APIs for  `game <-> server` communication
  - `colors`: Color palettes
  - `settings`: Game settings
  - `three-utils`: Common utilities for `three`
  - `ui`: UI elements
- `game`: Common game logic
  - `board`: Game board logic
  - `state-machine`: State machine for logic flow control
- `level-editor`: A tool for creating boards for levels
- `models`: Shared 3d models
- `scripts`: Internal workflow scripts
- `server`: The application logic
- `tools`: Common utitility functions:
  - `delay`: Delay helpers
  - `logger`: Labeled logging
  - `messenger`: Message observing/emitting
  - `queue`: A generic FIFO collection
