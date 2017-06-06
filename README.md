# @adobe/reactor-scaffold

[![npm (scoped)](https://img.shields.io/npm/v/@adobe/reactor-scaffold.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-scaffold)

A command line scaffolding tool for building Launch extensions.

For more information regarding Launch, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

## Installing

To use this project you will need to have [Node.js](https://nodejs.org/en/) installed on your computer. After you [download and install Node.js](https://nodejs.org/en/download/) you will also have access to the [npm](https://www.npmjs.com/) package manager for JavaScript. Your npm version will need to be at least 3.0.0. You can check the installed version by running the following command from a command line:

```
npm -v
```

After you have installed Node.js on your machine, you will need to initialize your project. Create a folder for your project if you don't already have one. Inside the folder, run

```
npm init
```

You will need to provide the information requested on the screen. After this process is complete, you should have a file called `package.json` inside your folder.

You will then need to install `@adobe/reactor-scaffold` and save it in your project's [`devDependencies`](https://docs.npmjs.com/files/package.json#devdependencies) by running
```
npm install @adobe/reactor-scaffold --save-dev
```

## Usage

Run `node_modules/.bin/reactor-scaffold` from the command line within your project's directory. From there, just follow the prompts. You may run the scaffold tool multiple times to add additional functionality to your extension.

Rather than type the path to the `reactor-scaffold` script each time you would like the run the tool, you may wish to set up a [script alias](https://docs.npmjs.com/misc/scripts) by adding a `scripts` node to your `package.json` as follows:

```javascript
{
  ...
  "scripts": {
    "scaffold": "reactor-scaffold"
  }
  ...
}
```

Once this is in place, you may then run the tool by executing the command `npm run scaffold` from the command line.
