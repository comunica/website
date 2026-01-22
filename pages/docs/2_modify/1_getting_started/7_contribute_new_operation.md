---
title: 'Contributing ana ctor fo a new query operation'
description: 'Extend the SPARQL parser, register a new algebra operation, and implement an actor to handle that new operation'
---

This guide explains how to extend Comunica with a new SPARQL construct that requires changes to the parser, the algebra, and query execution. Concretely, you will:
1. Extend the SPARQL grammar to parse a new query operation (e.g. union, optional, lateral, etc)
2. Modify the generated [Abstrct Syntax Tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) to represent that pattern 
3. Translate the modified AST into a new [Algebra Operation](https://github.com/comunica/comunica/blob/master/packages/utils-algebra/lib/Algebra.ts#L48-L50).
4. Implement a Comunica actor that executes the new operation

As a running example, this guide implements the proposed SPARQL [Lateral](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0006/sep-0006.md) operator.

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


Next, we extend the AST produced by the SPARQL 1.2 parser by creating a modified parser as part of our newly created actor.
The AST is essentially an abstract representation of the parsed string.
In our case the AST is a tree of AST-nodes, each describing what range of characters the node represents in the original string. 
Looking at the [existing SPARQL 1.2 AST types](https://github.com/comunica/traqula/blob/88ca4f620cc5b0289d99fcdb9aeadac50770d881/packages/rules-sparql-1-2/lib/sparql12Types.ts#L4-L18),
we conclude that we should extend the [Pattern type](https://github.com/comunica/traqula/blob/88ca4f620cc5b0289d99fcdb9aeadac50770d881/packages/rules-sparql-1-2/lib/sparql12Types.ts#L244-L255) to include the Lateral pattern in `lateralParser.ts`:
```ts
import type * as T12 from '@traqula/rules-sparql-1-2';
export type Pattern = T12.Pattern | PatternLateral;
export type PatternLateral = T12.PatternBase & {
  subType: 'lateral';
  patterns: Pattern[];
};
```

We must also update the lexer so it recognizes the 'LATERAL' keyword.
Starting from the [existing SPARQL 1.2 LexerBuilder](https://github.com/comunica/traqula/blob/88ca4f620cc5b0289d99fcdb9aeadac50770d881/packages/rules-sparql-1-2/lib/lexer.ts#L38), we add a case-insensitive token to the same file:
```ts
import { createToken, LexerBuilder } from '@traqula/core';
import { lex as l12 } from '@traqula/rules-sparql-1-2';
const lateral = createToken({ name: 'Lateral', pattern: /lateral/i, label: 'Lateral pattern' });
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
const comunicaParserBuilder = ParserBuilder.create(sparql12ParserBuilder)
  .patchRule(graphPatternNotTriples)
  .addRule(lateralGraphPattern);
```

To create the grammar rules themselves, we require the `groupGraphPattern` and `graphPatternNotTriples`' rules used by the SPARQL 1.2 parser, which we can retrieve using `.getRule`.
Afterward we can implement the rules as part of our parser file:
```ts
const origGraphPatternNotTriplesParserRule = sparql12ParserBuilder.getRule('graphPatternNotTriples');
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

const origGroupGraphPatternParserRule = sparql12ParserBuilder.getRule('groupGraphPattern');
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

At this point, `comunicaParserBuilder.build()` produces a fully functional parser.

<div class="note">
The generated TypeScript types do not yet include PatternLateral.
Type patching is required for full type safety, but this is out of scope for this guide.
</div>

## 3. Creating the algebra

Although Traqula provides algebra transformations, Comunica maintains its own algebra representation.

This is intentional: Comunica treats algebra operations as open-ended interfaces, not a closed union of known operations.
This allows new operations to be handled dynamically through the actor system.

For lateral, we define as part of `lateralAlgebra.ts`:
```ts
import type { Algebra } from '@comunica/utils-algebra';
export type Lateral = {
  type: 'lateral';
  input: [Algebra.Operation, Algebra.Operation];
  metadata?: Record<string, unknown>;
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

const algebraBuilderComunica = IndirBuilder
  .create(toAlgebra12Builder)
  .patchRule(accumulateGroupGraphPattern);
```

Update your custom query-parse actor to use the modified parser and algebra transformer.
Also update your engine configuration to use your new SPARQL parser instead of Comunica's default one,
[section 6 of contributing an actor](./5_contribute_actor.md#6-configuring-your-actor) explains how.

At this point, Comunica can parse and produce algebra for LATERAL.

## 4. Implementing the LATERAL actor

Implementing the execution logic now follows the standard guide:
[implementing your own actor query operation](5_contribute_actor.md#4-implementing-your-actor).
You should just make sure that the generic type passed to `ActorQueryOperationTypedMediated` is your `Lateral` type.

## 5. Reflect

This guide introduces a large amount of new information because it touches Traqula, grammar extension, AST manipulation, algebra translation, and actor-based execution.
It's worth emphasizing what you just accomplished:
- You extended the SPARQL language itself
- You introduced a new algebra operation
- You integrated it into Comunica's modular execution pipeline

Traditionally, these kinds of changes are deeply invasive.
Traqula and Comunica's actor model make them possible in a structured and modular way.
