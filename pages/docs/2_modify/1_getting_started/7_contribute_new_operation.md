---
title: 'Contributing an actor for a new query operation'
description: 'Extend the SPARQL parser, register a new algebra operation, and implement an actor to handle that new operation'
---

This guide explains how to extend Comunica with a new SPARQL operator that requires changes to the parser, the algebra, and query execution. Concretely, you will:
1. Extend the SPARQL grammar to parse a new query operation (e.g. union, optional, lateral, etc)
2. Modify the generated [Abstract Syntax Tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) to represent that pattern 
3. Translate the modified AST into a new [Algebra Operation](https://github.com/comunica/comunica/blob/master/packages/utils-algebra/lib/Algebra.ts#L48-L50).
4. Implement a Comunica actor that executes the new operation

As a running example, this guide implements the [proposed SPARQL Lateral operator](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0006/sep-0006.md).

<div class="note">
Extending the SPARQL parser and algebra is made possible by
<a href="https://github.com/comunica/traqula">Traqula</a>,
a modular parser, generator, and transformer framework maintained by Comunica.
Traqula's architecture and codebase differ from Comunica.
To fully understand this guide, we strongly recommend reading
<a href="https://github.com/comunica/traqula/blob/main/docs/implementingYourOwnParser.md">Traqula's documentation</a> as well.
</div>

## 1. Getting started

First, set up your development environment by following sections 1 and 2 of [_contributing an actor_](5_contribute_actor.md#1-requirements).
Next, [create a new actor package](https://comunica.dev/docs/modify/getting_started/contribute_actor/#3--creating-a-new-package):
```yo comunica:actor```.
Configure the actor with name `lateral` on bus `query-parse`, you can agree with the default options the program suggests.

This actor will be responsible for parsing SPARQL queries that include the `LATERAL` pattern.
The easiest approach is to copy the implementation of
[ActorQueryParseSparql](https://github.com/comunica/comunica/tree/master/packages/actor-query-parse-sparql)
and adapt it to use our custom parser and algebra transformer.

## 2. Creating the parser

To implement Lateral on top of the SPARQL 1.2 parser, we inspect the [SPARQL 1.2 grammar](https://www.w3.org/TR/sparql12-query/#sparqlGrammar) and the [Lateral syntax proposal](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0006/sep-0006.md#syntax-1).
We find that `lateral` must be parsed in a new variant of the [GraphPatternNotTriples](https://www.w3.org/TR/sparql12-query/#rGraphPatternNotTriples) rule.

### 2.1. Modifying the parser

Within the created `actor-query-parse-lateral` actor you just created,
we will implement our SPARQL 1.2 parser that is capable of parsing the `LATERAL` operator.
For this, you may create and edit a file called `lateralParser.ts`.

First, we extend the AST produced by the SPARQL 1.2 parser.
The AST is essentially an abstract representation of the parsed string.
In our case the AST is a tree of AST-nodes, each describing what range of characters the node represents in the original string. 
Looking at the [existing SPARQL 1.2 AST types](https://github.com/comunica/traqula/blob/88ca4f620cc5b0289d99fcdb9aeadac50770d881/packages/rules-sparql-1-2/lib/sparql12Types.ts#L4-L18),
we conclude that we should extend the [Pattern type](https://github.com/comunica/traqula/blob/88ca4f620cc5b0289d99fcdb9aeadac50770d881/packages/rules-sparql-1-2/lib/sparql12Types.ts#L244-L255) to include the Lateral pattern:
```ts
import type * as T12 from '@traqula/rules-sparql-1-2';
export type Pattern = T12.Pattern | PatternLateral;
export type PatternLateral = T12.PatternBase & {
  subType: 'lateral';
  patterns: Pattern[];
};
```

Next, we update the lexer so it recognizes the 'LATERAL' keyword.
Starting from the [existing SPARQL 1.2 LexerBuilder](https://github.com/comunica/traqula/blob/88ca4f620cc5b0289d99fcdb9aeadac50770d881/packages/rules-sparql-1-2/lib/lexer.ts#L38), we add a case-insensitive token 'lateral':
```ts
import { createToken, LexerBuilder } from '@traqula/core';
import { lex as l12 } from '@traqula/rules-sparql-1-2';
const lateral = createToken({
  name: 'Lateral',
  pattern: /lateral/i,
  label: 'Lateral pattern'
});
const lateralLexer = LexerBuilder
  .create(l12.sparql12LexerBuilder)
  .add(lateral);
```

Now to extend the SPARQL 1.2 parser,
we start from [the existing SPARQL 1.2 parser builder](https://github.com/comunica/traqula/blob/88ca4f620cc5b0289d99fcdb9aeadac50770d881/engines/parser-sparql-1-2/lib/Parser.ts#L14),
patching the `graphPatternNotTriples` rule and adding the `lateralGraphPattern` rule, again in `lateralParser.ts`:
```ts
import { ParserBuilder } from '@traqula/core';
import { sparql12ParserBuilder } from '@traqula/parser-sparql-1-2';
const lateralParserBuilder = ParserBuilder.create(sparql12ParserBuilder)
  .patchRule(graphPatternNotTriples)
  .addRule(lateralGraphPattern);
```

To implement the grammar rules themselves, we require the `groupGraphPattern` and `graphPatternNotTriples`' rules used by the SPARQL 1.2 parser, which we can retrieve using `getRule` function on the parserBuilder we extend.
Afterward we can implement the rules as part of our parser file:
```ts
// Retrieve the original implementation of the rules we replace so we can call them later  
const origGraphPatternNotTriplesParserRule = sparql12ParserBuilder
  .getRule('graphPatternNotTriples');
const origGroupGraphPatternParserRule = sparql12ParserBuilder
  .getRule('groupGraphPattern');

const graphPatternNotTriples: T12.SparqlRule<
  typeof origGraphPatternNotTriplesParserRule['name'],
  RuleDefReturn<typeof origGraphPatternNotTriplesParserRule> | PatternLateral
> = {
  name: 'graphPatternNotTriples',
  impl: $ => C => $.OR2<RuleDefReturn<typeof graphPatternNotTriples>>([
    { ALT: () => $.SUBRULE(lateralGraphPattern) },
    { ALT: () => origGraphPatternNotTriplesParserRule.impl($)(C) },
  ]),
};

const lateralGraphPattern: T12.SparqlRule<'lateralGraphPattern', PatternLateral> = {
  name: 'lateralGraphPattern',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const token = CONSUME(lateral);
    const group = SUBRULE(origGroupGraphPatternParserRule);
    return ACTION(() => ({
      type: 'pattern',
      subType: 'lateral',
      patterns: group.patterns,
      loc: C.astFactory.sourceLocation(token, group),
    } satisfies PatternLateral));
  },
};
```

At this point, `lateralParserBuilder.build()` produces a fully functional SPARQL1.2 + lateral parser.
However, to match the API currently used by the Comunica parser we suggest adding a wrapper class.
Using this wrapper class the SparqlParser used by `ActorQueryParseSparql.ts` can simply be replaced by the wrapper:

```ts
import type { ParserBuildArgs } from '@traqula/core';
import { completeParseContext, copyParseContext } from '@traqula/rules-sparql-1-2';

export class ComunicaSparqlParser {
  private readonly parser: ComunicaParser;
  protected readonly defaultContext: T12.SparqlContext;
  public constructor(args: ParserBuildArgs & { defaultContext?: Partial<T12.SparqlContext> } = {}) {
    this.parser = comunicaParserBuilder.build({
      ...args,
      tokenVocabulary: lateralLexer.tokenVocabulary,
    });
    this.defaultContext = completeParseContext(args.defaultContext ?? {});
  }
  public parse(query: string, context: Partial<T12.SparqlContext> = {}): T12.SparqlQuery {
    return this.parser.queryOrUpdate(query, copyParseContext({ ...this.defaultContext, ...context }));
  }
}
```

<div class="note">
The generated TypeScript types do not yet include PatternLateral.
<a href="https://github.com/comunica/traqula/blob/main/engines/parser-sparql-1-2/lib/Parser.ts#L16">Type patching</a> is required for full type safety, but this is out of scope for this guide.
</div>

### 2.2. Modifying the algebra transformer

Now that our parser can parse query string containing the `LATERAL` operator into an AST,
we need to modify the AST to algebra transformer to also accept this parsed `LATERAL` operator.
The algebra is a higher level abstraction of the query language that is distinct from the grammatical
structure of the query language.
Instead, the algebra functions more like mathematical operators that provide an output given some input.
Query engines typically function on the level of algebra because it maps to functionality instead of grammatical structures.
We will define our modified algebra transformer as part of our actor in a new file `lateralTransformer.ts`.

<div class="note">
The algebraic definitions for the SPARQL language can be found in
<a href="https://www.w3.org/TR/sparql11-query/#sparqlAlgebra">section 18.5 of the SPARQL spec</a>.
</div>

Although Traqula provides algebra transformations, Comunica maintains its own algebra representation.
This is intentional: Comunica treats algebra operations as open-ended interfaces, not a closed union of known operations.
This allows new operations to be handled dynamically through the actor system.

We start by defining the structure of our Lateral operator. The operator has a type and receives two input operations:
```ts
import type { Algebra } from '@comunica/utils-algebra';
export type Lateral = {
  type: 'lateral';
  input: [Algebra.Operation, Algebra.Operation];
};
```

To translate the new AST pattern into algebra, we modify Traqula's algebra transformer.
Currently, this requires understanding how transformations are wired internally.
For `LATERAL`, only the `accumulateGroupGraphPattern` rule needs to be patched:
```ts
import { toAlgebra12Builder } from '@traqula/algebra-sparql-1-2';
import type { AlgebraIndir, Algebra } from '@traqula/algebra-transformations-1-2';
import { IndirBuilder } from '@traqula/core';

const origAccumulateGroupGraphPattern = toAlgebra12Builder.getRule('accumulateGroupGraphPattern');

export const accumulateGroupGraphPattern: AlgebraIndir<'accumulateGroupGraphPattern', Algebra.Operation | Lateral, [Algebra.Operation, Pattern]> = {
  name: 'accumulateGroupGraphPattern',
  fun: $ => (C, algebraOp, pattern) => {
    // If the subtype is laeral, handle it, otherwise fall though to the original implementation
    if (pattern.subType === 'lateral') {
      return {
        type: 'lateral',
        input: [
          algebraOp,
          $.SUBRULE(origTranslateGraphPattern, C.astFactory.patternGroup(<any[]> pattern.patterns, pattern.loc)),
        ],
      } satisfies Lateral;
    }
    return origAccumulateGroupGraphPattern.fun($)(C, algebraOp, pattern);
  },
};

const lateralAlgebraBuilder = IndirBuilder
  .create(toAlgebra12Builder)
  .patchRule(accumulateGroupGraphPattern);
```

By calling `lateralAlgebraBuilder.build()`, a new algebra transformer can be constructed capable of
transforming an AST that contains the `LATERAL` operation.
Again to match the API currently used by `ActorQueryParseSparql.ts` we wrap this `.build` in a function:
```ts
import { createAlgebraContext } from '@traqula/algebra-transformations-1-2';
import type { ContextConfigs, Algebra } from '@traqula/algebra-transformations-1-2';

export function toComunicaAlgebra(query: T12.SparqlQuery, options: ContextConfigs = {}): Algebra.Operation {
  const c = createAlgebraContext(options);
  const transformer = algebraBuilderComunica.build();
  return transformer.translateQuery(c, query, options.quads, options.blankToVariable);
}
```

Now simply change the imports within `ActorQueryParseSparql.ts`:
```ts
// Remove these two
// import { toAlgebra } from '@traqula/algebra-sparql-1-2';
// import { Parser as SparqlParser } from '@traqula/parser-sparql-1-2';
// Add:
import { toComunicaAlgebra as toAlgebra, ComunicaSparqlParser as SparqlParser } from '@comunica/utils-algebra-lateral';
```


## 3. Replace the original parse actor with yours

In [section 6 of contributing an actor](./5_contribute_actor.md#6-configuring-your-actor)
you learned about the dependency injection framework used by Comunica.
You may now configure your parsing actor in a similar way:
* Add it as a dependency in `engines/query-sparql/package.json`, and remove the original `@comunica/actor-query-parse-sparql`.
* Change the default config file for the parser (`engines/config-query-sparql/config/query-parse/actors.json` and `actors-sparql.json`) to use your parser instead.

At this point, Comunica can parse and produce algebra for LATERAL,
all that's left is implementing the actor that perform the operation.

## 4. Implementing the LATERAL actor

Implementing the execution logic now follows the standard guide:
[implementing your own actor query operation](5_contribute_actor.md#4-implementing-your-actor).
You should just make sure that the generic type passed to `ActorQueryOperationTypedMediated` is your `Lateral` type.

## 5. Testing with Comunica SPARQL

Just like [section 7 of contributing an actor](./5_contribute_actor.md#7-testing-with-comunica-sparql),
we need to make sure our actor works before we create a pull request.
Simply rebuild your engine as described there, and test that it works on a query using `LATERAL`.
```bash
## Get exactly one label for each subject in a row.
node bin/query.js https://fragments.dbpedia.org/2016-04/en \
  'SELECT * { ?s ?p ?o LATERAL { SELECT * { ?s rdfs:label ?label } LIMIT 1 } }'
```

## 6. Reflect

This guide introduces a large amount of new information because it touches Traqula, grammar extension, AST manipulation, algebra translation, and actor-based execution.
It's worth emphasizing what you just accomplished:
- You extended the SPARQL language itself
- You introduced a new algebra operation
- You integrated it into Comunica's modular execution pipeline

Traditionally, these kinds of changes are deeply invasive.
Traqula and Comunica's actor model make them possible in a structured and modular way.
