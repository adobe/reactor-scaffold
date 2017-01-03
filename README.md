# extension-support-scaffold
A command-line scaffolding tool for building Reactor extensions.

## Installing

To use this project you will need to have [Node.js](https://nodejs.org/en/) installed on your computer. Do a Google search for finding the best method to install it on your computer's operating system. Once you install Node.js you will also have access to the [npm](https://www.npmjs.com/) package manager for JavaScript. You will need a version of npm greater than 2.7.0. You can check the installed version by running

```
npm -v
```

After you have installed Node.js on your machine, you will need to initialize your project. Create a folder for your project if you don't already have one. Inside the folder, run

```
npm init
```

You will need to provide the information requested on the screen. After this process is complete, you should have a file called `package.json` inside your folder.

You will then need to install extension-support-scaffold and save it in your project's [`devDependencies`](https://docs.npmjs.com/files/package.json#devdependencies) by running
```
echo "@reactor:registry=https://artifactory.corp.adobe.com/artifactory/api/npm/npm-mcps-release-local/" > .npmrc
npm install @reactor/extension-support-scaffold --save-dev
```

While that will install the latest version, you my find a list of all versions under the [extension-support-scaffold package](https://artifactory.corp.adobe.com/artifactory/webapp/#/artifacts/browse/tree/General/npm-mcps-release-local/@reactor/extension-support-scaffold/-/@reactor) within Artifactory.

## Usage

Run `node_modules/.bin/reactor-scaffold` from the command line within your project's directory. From there, just follow the prompts.

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
