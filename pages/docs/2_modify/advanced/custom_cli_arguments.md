---
title: 'Custom CLI arguments'
description: 'Adding custom arguments to CLI tools'
---

As explained within the guide to [expose your custom config as an npm package](/docs/modify/getting_started/custom_init/),
custom command line tools can be created as follows:

`bin/query.js`:
```typescript
#!/usr/bin/env node
import { runArgsInProcessStatic } from '@comunica/runner-cli';
runArgsInProcessStatic(require('../engine-default.js'));
```

`bin/http.js`:
```typescript
#!/usr/bin/env node
import { HttpServiceSparqlEndpoint } from '@comunica/actor-init-query';
const defaultConfigPath = `${__dirname}/../config/config-default.json`;
HttpServiceSparqlEndpoint.runArgsInProcess(process.argv.slice(2), process.stdout, process.stderr, `${__dirname}/../`, process.env, defaultConfigPath, code => process.exit(code))
  .catch(error => process.stderr.write(`${error.message}/n`));
```

`bin/query-dynamic.js`:
```typescript
#!/usr/bin/env node
import { runArgsInProcess } from '@comunica/runner-cli';
runArgsInProcess(`${__dirname}/../`, `${__dirname}/../config/config-default.json`);
```

This will cause the built-in CLI arguments from `comunica-sparql` to be inherited.
It is however also possible to _extend_ these arguments so that you can add additional ones,
which can be processed in any way.

## Creating CLI Arguments Handlers

This argument handling can be done using one or more instances of [`ICliArgsHandler`](https://comunica.github.io/comunica/interfaces/actor_init_query.ICliArgsHandler.html),
which may be implemented as follows:
```typescript
export class MyCliArgsHandler implements ICliArgsHandler {
  public populateYargs(argumentsBuilder: Argv<any>): Argv<any> {
    return argumentsBuilder
      .options({
        myOption: {
          alias: 'm',
          type: 'string',
          describe: 'Just some option',
          default: 'A default value',
        },
      });
  }

  public async handleArgs(args: Record<string, any>, context: Record<string, any>): Promise<void> {
    context['this-is-a-context-key'] = args.myOption;
  }
}
```

The `populateYargs` method allows you to declare options within the `argumentsBuilder` using the [yargs API](https://www.npmjs.com/package/yargs).
Then, the `handleArgs` is invoked after the CLI tool has been invoked with some options,
so that you can extract the defined option, and modify the [query context](/docs/query/advanced/context/) if needed (which is still mutable at this stage).

## Passing CLI Arguments Handlers

Then, in order to pass your instances of `ICliArgsHandler` to the CLI tools,
you can do this as follows:

`bin/query.js`:
```typescript
#!/usr/bin/env node
import { runArgsInProcessStatic } from "@comunica/runner-cli";
import { KeysInitSparql } from '@comunica/context-entries';
import { ActionContext } from '@comunica/core';
runArgsInProcessStatic(require('../engine-default.js'), {
  context: ActionContext({
    [KeysInitSparql.cliArgsHandlers]: [ new MyCliArgsHandler() ],
  }),
});
```

`bin/http.js`:
```typescript
#!/usr/bin/env node
import {HttpServiceSparqlEndpoint} from "@comunica/query-sparql";
HttpServiceSparqlEndpoint.runArgsInProcess(process.argv.slice(2), process.stdout, process.stderr,
  __dirname + '/../', process.env, __dirname + '/../config/config-default.json', () => process.exit(1), [ new MyCliArgsHandler() ]);
```

`bin/query-dynamic.js`:
```typescript
#!/usr/bin/env node
import { runArgsInProcess } from "@comunica/runner-cli";
import { KeysInitSparql } from '@comunica/context-entries';
import { ActionContext } from '@comunica/core';
runArgsInProcess(__dirname + '/../', __dirname + '/../config/config-default.json', {
  context: ActionContext({
    [KeysInitSparql.cliArgsHandlers]: [ new MyCliArgsHandler() ],
  }),
});
```
