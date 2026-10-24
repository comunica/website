---
title: 'Custom SERVICE Executors'
description: 'Providing custom implementations for SPARQL SERVICE clauses.'
---

SPARQL's [`SERVICE` keyword](https://www.w3.org/TR/sparql11-federated-query/) is used to evaluate part of a query over a given source,
such as a remote SPARQL endpoint.
Comunica allows developers to plug in custom executors for such `SERVICE` clauses via the context,
so that clauses targeting certain IRIs are evaluated by your own application code instead of by querying that IRI as a source.
This allows other kinds of data or functionality, such as a REST API or a full-text search index,
to be used within SPARQL queries as if they were SPARQL endpoints.

<div class="note">
Take into account that SPARQL queries with custom <code>SERVICE</code> targets
will not be portable to other types of query engines anymore,
as these targets are only known to your application.
</div>

## Dictionary-based SERVICE executors

The easiest way to plug in `SERVICE` executors to Comunica is by using
the `serviceExecutors` [context entry](/docs/query/advanced/context/)
in a [JavaScript application](/docs/query/getting_started/query_app/).
This is a dictionary that maps `SERVICE` target IRIs to executors,
where an executor is an object with an `execute` function that produces the solutions of a `SERVICE` clause as [bindings](/docs/query/advanced/bindings/).

To create these bindings, a bindings factory can be constructed from the data factory within the query context that is passed to `execute`:

```typescript
import { KeysInitQuery } from '@comunica/context-entries';
import type { IServiceExecutor } from '@comunica/types';
import { BindingsFactory } from '@comunica/utils-bindings-factory';

const greetExecutor: IServiceExecutor = {
  async execute(serviceOperation, bindings, context) {
    const dataFactory = context.getSafe(KeysInitQuery.dataFactory);
    const bindingsFactory = new BindingsFactory(dataFactory);
    return [
      bindingsFactory.bindings([
        [ dataFactory.variable('greeting'), dataFactory.literal('Hello world!') ],
      ]),
    ];
  },
};

const bindingsStream = await myEngine.queryBindings(`
SELECT ?greeting WHERE {
  SERVICE <urn:my-app:greet> {
    <urn:my-app:me> <urn:my-app:greeting> ?greeting.
  }
}
`, {
  sources: [],
  serviceExecutors: {
    'urn:my-app:greet': greetExecutor,
  },
});
```

This query produces a single result, in which `?greeting` is bound to `"Hello world!"`.

Within this `serviceExecutors` dictionary, you can provide any number of executors.
`SERVICE` clauses with other targets are still evaluated by querying their target as a source.

Besides the query context, `execute` receives the `SERVICE` clause in [SPARQL algebra](/docs/modify/advanced/algebra/),
and the bindings it is joined with when it is evaluated as part of a [bind join](/docs/modify/advanced/joins/).
Executors can optionally also implement a `getMetadata` function that tells the query planner how many solutions a clause produces,
as described in the [`IServiceExecutor`](https://github.com/comunica/comunica/blob/master/packages/types/lib/ServiceExecutor.ts) interface.

## Callback-based SERVICE executors

If `SERVICE` target IRIs are not known beforehand,
or the dictionary-based format is not usable for whatever reason,
then the callback-based `serviceExecutorCreator` entry may be used.
For example, the following creator handles all targets starting with `urn:my-app:greet:`,
and greets the name that is contained in the remainder of the IRI:

```typescript
import { KeysInitQuery } from '@comunica/context-entries';
import { BindingsFactory } from '@comunica/utils-bindings-factory';
import type * as RDF from '@rdfjs/types';

const bindingsStream = await myEngine.queryBindings(`
SELECT ?greeting WHERE {
  SERVICE <urn:my-app:greet:Alice> {
    <urn:my-app:me> <urn:my-app:greeting> ?greeting.
  }
}
`, {
  sources: [],
  serviceExecutorCreator: (serviceNamedNode: RDF.NamedNode) => {
    if (serviceNamedNode.value.startsWith('urn:my-app:greet:')) {
      const name = serviceNamedNode.value.slice('urn:my-app:greet:'.length);
      return {
        async execute(serviceOperation, bindings, context) {
          const dataFactory = context.getSafe(KeysInitQuery.dataFactory);
          const bindingsFactory = new BindingsFactory(dataFactory);
          return [
            bindingsFactory.bindings([
              [ dataFactory.variable('greeting'), dataFactory.literal(`Hello ${name}!`) ],
            ]),
          ];
        },
      };
    }
  },
});
```

The `serviceExecutorCreator` is invoked with the IRI of a `SERVICE` target, wrapped within an [RDF/JS named node](/docs/query/advanced/rdfjs/),
and may be invoked multiple times for the same IRI.
It must synchronously return an executor, or `undefined` if that target must be queried as a regular source instead.

<div class="note">
The <code>serviceExecutors</code> and <code>serviceExecutorCreator</code> entries can not be used at the same time.
</div>
