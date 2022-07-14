# Experience Platform Tags Extension Scaffold Tool

[![npm (scoped)](https://img.shields.io/npm/v/@adobe/reactor-scaffold.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-scaffold)

Adobe Experience Platform Tags is a next-generation tag management solution enabling simplified deployment of marketing technologies. For more information regarding Tags, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

The scaffold tool allows extension developers to quickly and easily build out the initial file structure of a Tags extension. The scaffolding tool will ask questions and build out appropriate files according to the responses given.

For more information about developing an extension for Tags, please visit our [extension development guide](https://experienceleague.adobe.com/docs/experience-platform/tags/extension-dev/overview.html?lang=en).

## Usage

Before running the scaffolding tool, you must first have [Node.js](https://nodejs.org/en/) installed on your computer.

Once Node.js is installed, run the scaffold tool by executing the following command from the command line within your project's directory:

```
npx @adobe/reactor-scaffold
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](.github/CONTRIBUTING.md) for more information.

To get started:

1. Install [node.js](https://nodejs.org/).
3. Clone the repository.
4. After navigating into the project directory, install project dependencies by running `npm install`.

To manually test your changes, first run the following command from the scaffold tool directory:

```
npm link
```

Then, in a directory where you would like to use the scaffold tool, run the following command:

```
npx @adobe/reactor-scaffold
```

Npx will execute the scaffold tool using your locally linked code rather than the code published on the public npm repository.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
