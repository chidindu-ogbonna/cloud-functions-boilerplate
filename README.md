# Cloud Functions For Firebase Boilerplate

[Cloud Functions For Firebase Boilerplate](#cloud-functions-for-firebase-boilerplate)

- [Why is this important?
  ](#why-is-this-important)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Service Accounts and Permissions](#service-accounts-and-permissions)
  - [Example Folder Structure](#example-folder-structure)
- [Documentation](#documentation)
  - [Improved cold start performance](#Improved-cold-start-performance)
  - [Improved readability & developer experience](#improved-readability-&-developer-experience)
  - [TypeScript](#typescript)
  - [Express.js](#express.js)
  - [Eslint setup](#eslint-setup)
- [Resources](#resources)
- [TODO](#todo)

An ever-evolving, opinionated architecture and development environment for writing and structuring google cloud functions for firebase. It takes into account performance of cloud functions, and developer productivity.

> As this project is a template project and not a CLI, you have access to the entire app configuration so you can change it according to your needs.

Questions, feedback, and contributions are welcome!

## Why is this important?

> The simplicity of Cloud Functions lets you quickly develop code and run it in a serverless environment. At moderate scale, the cost of running functions is low, and optimizing your code might not seem like a high priority. As your deployment scales up, however, optimizing your code becomes increasingly important.
>
> -- Cloud Functions For Firebase Documentation

## Features

- **[Improved cold start performance](#improved-cold-start)** - Cold start/boot time is one of the biggest issues many developers and companies come across when using cloud functions. This boilerplate uses the best practices to reduce the cold start time thus improving performance.

- **[Improved readability & developer experience](#improved-readability-&-developer-experience)** - Using only one file, `index.js` for everything doesn't work for a serious app. It becomes hard to scan through, hard to easily follow up with the code. This boilerplate recognizes that and aims to solve that.

- **[TypeScript](#typescript)** - While everything done here can be achieved using plain JavaScript, it would require more code, a lot of experience using JavaScript, and time, which in my opinion is counter-intuitive. You should not have to spend time optimizing the tool to achieve a task!

- **[Express.js](#express.js)** - Every HTTP request makes use of `express.js` underneath, but explicitly using it in structuring your endpoints has proved to more beneficial, both in structure and maximization of resources.

- **[Eslint setup](#eslint-setup)** - An extensible eslint configuration, that gets you up and running

## Getting Started

### Installation

```shellscript
# 1. Clone the repository
git clone https://github.com/chidindu-ogbonna/cloud-functions-boilerplate

# 2. Enter the newly cloned folder
cd cloud-functions-boilerplate

# 3. Init cloud functinos for firebase. Make sure firebase-tools is installed: npm install -g firebase-tools
firebase init

# Go through the prompt selecting this options

# Select functions from the options
# Select the required project
# What language would you like to use to write Cloud Functions? TypeScript
# Do you want to use TSLint to catch probable bugs and enforce style? n
# File functions/package.json already exists. Overwrite? N
# File functions/tsconfig.json already exists. Overwrite? N
# File functions/src/index.ts already exists. Overwrite? N
# File functions/.gitignore already exists. Overwrite? N
# Do you want to install dependencies with npm now? y

```

### Service Accounts and Permissions

You can view all service accounts associated with your project in the [Service account](https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts) tab of your Project Settings in the Firebase console.

Place your service account files in the `service-account` folder, based on environments

> _You can name your service accounts whatever you like, but make sure to change the sections where the service account file is referenced._

- **Production environment:** Rename your service account file to `prod-service-account.json`

- **Staging environment:** Rename your service account to file `staging-service-account.json`

- **Development environment:** Rename your service account to file `dev-service-account.json`

### Testing

After setting up the environment, service accounts and permissions, testing becomes the next thing.

Run `npm run local` in your terminal to run functions locally.

### Example Folder Structure

![Folder Structure](https://res.cloudinary.com/cheapflix/image/upload/v1596049949/projects-images/Screenshot_from_2020-07-29_20-06-46.png)

## Documentation

### Improved cold start performance

Cold start (Cold boot) time has been one of the [biggest issues](https://www.youtube.com/watch?v=IOXrwFqR6kY) many developers and companies come across when using cloud functions. This boilerplate uses the best practices to reduce the cold start time thus improving performance.

By taking advantage of TypeScripts [dynamic 'async' import](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html#dynamic-import-expressions), this ensures unused code and imports and not loaded unncessarily during start time but only when the specific function is invoked.

### Improved readability & developer experience

Using only one file, `index.js`, for everything doesn't work for a serious app. It becomes hard to scan through, hard to easily follow up with the code. This boilerplate recognizes that and aims to solve that.

There have been a lot of ways suggested to split cloud functions properly, Firebase also has [suggestions](https://firebase.google.com/docs/functions/organize-functions), but it doesn't take into account the effect on the **cold start time**.

### TypeScript

While everything done here can be achieved using plain JavaScript, it would require more code, more time, and a lot of experience using JavaScript, which in my opinion is counter-intuitive. You should not have to spend time fighting with the tool and trying to optimize it to achieve a task.

TypeScript removes that overhead, providing a more convenient means of writing JavaScript. It's also [advised](https://www.youtube.com/watch?v=tResEeK6P5I&t=1514s) to write cloud functions using TypeScript.

### Express.js

Every Firebase HTTP function makes use of `express.js` underneath. Explicitly using it in structuring your endpoints has proved to more beneficial, both in structure and maximization of resources.

- All your HTTP requests are now accessed through one Cloud Function. This helps with the "Number of functions" limit (which is 1,000), meaning no matter the number of endpoints you have, they would all count as one function.
- Improves cold start time - Due to the way cloud functions are invoked, having all endpoints accessible through one function enables instances to be reused.

### Eslint setup

An extensible eslint configuration, that gets you up and running

## Resources

- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Optimizing Networking](https://firebase.google.com/docs/functions/networking)
- [Quotas and Limits](https://firebase.google.com/docs/functions/quotas)
- [Building idempotent functions](https://cloud.google.com/blog/products/serverless/cloud-functions-pro-tips-building-idempotent-functions)
- [Using retries to build reliable serverless systems](https://cloud.google.com/blog/products/serverless/cloud-functions-pro-tips-using-retries-to-build-reliable-serverless-systems)
- [Organize Cloud Functions for max cold start performance and readability with TypeScript and Firebase](https://medium.com/firebase-developers/organize-cloud-functions-for-max-cold-start-performance-and-readability-with-typescript-and-9261ee8450f0)

## TODO

- [x] [Improve error reporting](https://firebase.google.com/docs/functions/reporting-errors#manually_reporting_errors)
- [ ] [Add unit tests](https://firebase.google.com/docs/functions/unit-testing)
