---
title: 'Contributing a new query operation actor to the Comunica repository'
description: 'Setup a development environment, implement a new actor, and create a pull request.'
---

This guide focuses on all the required steps for contributing a new query operation actor to Comunica, restricting itself to the contribution of an operator that can be parsed by Comunica.
Concretely, we will focus on implementing a custom actor for the SPARQL `REDUCED` operator.

<div class="note">
Once you have followed this guide and actually want to contribute,
have a look at our <a href="/contribute/">contribution guide</a>.
</div>

## 1. Requirements

You will need the following to follow this guide:

* [git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/) (version 8.0 or higher)
* [Yarn](https://yarnpkg.com/en/) package manager
* Any kind of editor that be used to edit JavaScript files (We recommend [WebStorm](https://www.jetbrains.com/community/education/#students))
* A [GitHub](https://github.com/) account

## 2. Cloning the repo

Since you do not have access to the Comunica repository by default,
you will have to **fork** the Comunica repo first.

1. Go to https://github.com/comunica/comunica
2. Make sure you are logged into your GitHub account.
3. Click on the "Fork" button.

After this, a copy of the Comunica repo will be available for your account
in which you can make all the changes you want.

Next, we will **clone** your fork to the local file system as follows: 
```bash
$ git clone https://github.com/<my-username>/comunica.git
```
_Make sure you replace `<my-username>` with your GitHub username._

As a final setup step, we can install all dependencies as follows:
```bash
$ cd comunica
$ yarn install
```

This will install the dependencies of all modules.
After that, all [Comunica packages](https://github.com/comunica/comunica/tree/master/packages) are available in the `packages/` folder
and can be used in a development environment.
All pre-built [Comunica engines and configs](https://github.com/comunica/comunica/tree/master/engines) are available in the `engines/` folder
such as querying with [Comunica SPARQL (`engines/query-sparql`)](https://github.com/comunica/comunica/tree/master/engines/query-sparql).

A good git practise is to develop on **feature branches**.
For this, branch from the `master` as follows:
```bash
$ git checkout -b feature/my-feature
```
_Replace `my-feature` with a short name (without spaces) of the feature you want to implement._

<div class="note">
If you fix a bug, you can name your branch something like <code>fix/my-fix</code>.
</div>

If you want to make sure that everything has been installed correctly,
navigate to `engines/query-sparql`, and try out a simple query from the command line:
```bash
$ cd engines/query-sparql
$ node bin/query.js https://fragments.dbpedia.org/2016-04/en \
  'SELECT * WHERE { ?s ?p ?o } LIMIT 100'
```

If this command produces valid output, your development environment has been successfully setup.

Let's navigate back to the repo root, so we're ready for the next step:
```bash
$ cd ../..
```

## 3. Creating a new package

The Comunica monorepo contains a large collection of packages in the [`packages/`](https://github.com/comunica/comunica/tree/master/packages) directory.
This contains different types of packages: _actors, mediators and buses_.

<div class="note">
Learn more about the <a href="/docs/modify/advanced/architecture_core/">core architecture</a> and <a href="/docs/modify/advanced/architecture_sparql/">SPARQL actors and buses</a>.
</div>

For each type of package, we provide a **generator tool** to initialize a template repo.
For this, you can use the [generator-comunica](https://github.com/comunica/generate-comunica) project (a [Yo](https://www.npmjs.com/package/yo) generator).

To install this generator, start a _new terminal session_ outside of the Comunica repo directory,
and execute the following commands:
```bash
$ npm i -g yo
$ git clone git@github.com:comunica/generate-comunica.git
$ cd generate-comunica
$ npm install
$ npm link
```

This will expose the `comunica:bus`, `comunica:mediator`, `comunica:actor`, and `comunica:actor-query-operation` generators for initializing projects of the respective types.
`comunica:actor-query-operation` is a special type of the `comunica:actor` generator that has been preconfigured to the `query-operation` bus,
which we will make use of in this guide.
If you want to create an actor on another bus than `query-operation`, you will have to invoke `comunica:actor` instead.

In this case, we want to create an actor on the `query-operation` bus for the `REDUCED` query operation.
As such, we can **execute the generator** as follows in the repo root:
```bash
$ yo comunica:actor-query-operation
? The SPARQL Algebra type name of the operator (lowercase) reduced
? The SPARQL Algebra interface name Reduced
? Actor name (without actor-bus- prefix, lowercase) reduced-my
? The full readable name of the actor Reduced My
? The component base name of the actor (without Bus part) ReducedMy
? A description of the actor A comunica Reduced My Query Operation Actor.
? The component context prefix caqorm
   create packages/actor-query-operation-reduced-my/components/Actor/QueryOperation/ReducedMy.jsonld
   create packages/actor-query-operation-reduced-my/components/components.jsonld
   create packages/actor-query-operation-reduced-my/components/context.jsonld
   create packages/actor-query-operation-reduced-my/lib/ActorQueryOperationReducedMy.ts
   create packages/actor-query-operation-reduced-my/test/ActorQueryOperationReducedMy-test.ts
   create packages/actor-query-operation-reduced-my/.npmignore
   create packages/actor-query-operation-reduced-my/index.ts
   create packages/actor-query-operation-reduced-my/package.json
   create packages/actor-query-operation-reduced-my/README.md
```

After answering the required question, a new package will be initialized at `packages/actor-query-operation-reduced-my/`.

In order to **link the dependencies of this new package**, make sure to run `yarn install` again in the monorepo root.
You will see some compilation errors, which you can ignore, as your new actor has not been implemented yet.

## 4. Implementing your actor

In this step, we will implement our actor in `packages/actor-query-operation-reduced-my/lib/ActorQueryOperationReducedMy.ts`.

The generated class extends from `ActorQueryOperationTypedMediated`,
which abstracts away many of the commonly required tasks for operators.
This class requires you to override two methods: `testOperation` and `runOperation`.
These two methods correspond to the [test and run phases that will be called by mediators](/docs/modify/advanced/architecture_core/#run-and-test-phases-for-selecting-an-actor).

### 4.1. Test phase

Since the `ActorQueryOperationTypedMediated` class already implements the test phase by checking if the incoming operation is a `REDUCED` operation,
we can just implement `testOperation` as follows:
```typescript
  public async testOperation(pattern: Algebra.Reduced, context: IActionContext): Promise<TestResult<IActorTest>> {
    return passTestVoid();
  }
```

<div class="note">
If you want to make your actor only handle specific types of this operation,
you can add additional checks in here.
If you want to fail the test in certain cases, you will have to return <code>failTest(`a message describing the failure`)</code>.
</div>

### 4.2. Run phase

The `runOperation` method will contain the actual logic for evaluation the `REDUCED` operator.

Before we start, change the return type of this method from `Promise<IQueryOperationResult>` to `Promise<IQueryOperationResultBindings>`,
because this method will always [return bindings as query result](/docs/modify/advanced/query_operation_result_types/).

The first step of implementing the REDUCED actor,
requires evaluating the sub-operation that this REDUCED operation exists over.

For example, `REDUCED` can be applied over the following BGP:
```
SELECT REDUCED * WHERE {
  ?s ?p <http://dbpedia.org/resource/Belgium>.
  ?s ?p ?o.
}
```

As such, we first have to evaluate this BGP first (or whatever other sub-operator is defined).

This sub-operation is stored in the `input` field of our `pattern`.
By using the query operation mediator (`this.mediatorQueryOperation`),
we can evaluate this sub-operation.
The sub-operator can be evaluated by the mediator as follows:
```javascript
// Delegate resolving the input operation to the mediator.
const output = ActorQueryOperation.getSafeBindings(await this
      .mediatorQueryOperation.mediate({ operation: pattern.input, context }));
```

Since the `REDUCED` operator is very loosely defined in the SPARQL specification,
it is valid to filter _nothing_ from the results, and just return the child operator's results as-is.

As such, we can return the following:
```bash
return {
  type: 'bindings',
  bindingsStream: output.bindingsStream,
  metadata: output.metadata,
};
```

<div class="note">
Have a look at the other query operation actors if you want to do something more complex with the <code>output</code>'s <code>bindingsStream</code>.
</div>

## 5. Unit-testing your actor

Since [testing is very important in Comunica](/docs/modify/advanced/testing/),
the generator will automatically generate some unit tests for your class in `packages/actor-query-operation-reduced-my/test/ActorQueryOperationReducedMy-test.ts`.

Since we don't actually do anything in our actor, all default unit test should already pass.
Check this by executing in the repo root:
```bash
yarn run test ActorQueryOperationReducedMy-test.ts
```

Here, it is important that every class in your package reaches a code coverage of 100%.
Therefore, if you have a different actor implementation,
you may have to add additional unit tests to check different cases.

## 6. Configuring your actor

If you want to make it so that your actor is enabled by default in Comunica SPARQL,
then you'll have to make sure it is present in the default config.

For this, first **add your package as a dependency** in `engines/query-sparql/package.json`:
```text
{
  ...
  "dependencies": {
    ...
    "@comunica/actor-query-operation-reduced-my": "^1.0.0"
  }
  ...
}
```

<div class="note">
When creating a new actor, you can leave the version fixed at <code>"^1.0.0"</code>.
This version will be incremented automatically upon each new Comunica release.
</div>

Next, we have to **configure the actor** by replacing the existing `REDUCED` actor in the default config file `engines/config-query-sparql/config/query-operation/actors/query/reduced.json`:
```text
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/runner/^3.0.0/components/context.jsonld",

    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-query-operation-reduced-my/^3.0.0/components/context.jsonld"
  ],
  "@id": "urn:comunica:default:Runner",
  "@type": "Runner",
  "actors": [
    {
      "@id": "urn:comunica:default:query-operation/actors#reduced",
      "@type": "ActorQueryOperationReducedMy",
      "mediatorQueryOperation": { "@id": "urn:comunica:default:query-operation/mediators#main" }
    }
  ]
}
```

<div class="note">
When adding non-query-operator actors, you may have to include your actor in a different config set.
</div>

## 7. Testing with Comunica SPARQL

Before we make our pull request,
we have to make sure that our actor actually works in practise.

For this, we have to make sure our TypeScript is properly compiled to JavaScript,
and that our configuration file has been compiled:
```bash
$ yarn run build # Compile typescript and the components files at the ROOT OF THE REPO
$ cd engines/query-sparql
$ yarn run prepare # Compiles config
```

<div class="note">
You can also just run <code>yarn install</code> again from the root package, which will take care of all of this, and more.
</div>

After that, we should now be able to execute Comunica SPARQL from the command line with a given `REDUCED` query:
```bash
$ node bin/query.js https://fragments.dbpedia.org/2016-04/en \
  'SELECT REDUCED * WHERE { ?s ?p ?o } LIMIT 100'
```

## 8. Creating a pull request

Once everything has been tested, we can commit our **code and create a pull request**.

First, add the changed files, and commit your code.

```bash
$ git add packages/actor-query-operation-reduced-my \
  engines/query-sparql/config \
  engines/query-sparql/package.json
$ git commit -m "Add my custom reduced operator" 
```

<div class="note">
Before making the commit, make sure you are not any unneeded files. You can use <code>git status</code> for this.
</div>

Several [pre-commit checks](/contribute/#report-bugs-or-request-features) will be done, such as linting and unit testing.
Should any of these checks fail, your commit will not be done,
and you have to retry again after fixing the problems.

Also make sure to check in your new package if there are any `TODO`s remaining,
such as in the `README.md` file.

Once your commit is done, you can push your changes to your fork:
```bash
$ git push origin feature/my-feature
```

The only thing that's left to do is making the pull request
from your branch to the Comunica master branch at https://github.com/comunica/comunica/pulls.
Once you've opened the pull request, several [automated checks](/contribute/#report-bugs-or-request-features)
will be run, and someone will have a look at your contribution very soon!
