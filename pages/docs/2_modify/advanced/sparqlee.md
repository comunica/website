---
title: 'Sparqlee'
description: 'The SPARQL expression evaluation engine of Comunica. (DEPRECATED)'
---

Sparqlee has been deprecated for the expression evaluator package.
This package has its own [docs page](/docs/modify/advanced/expression-evaluator).

Sparqlee was an [open-source](https://github.com/comunica/sparqlee) SPARQL 1.1 expression engine
used by different Comunica actors for evaluating expressions.

Concretely, the following actors made use of it:
* [`@comunica/actor-query-operation-extend`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend): Implements the extent operator.
* [`@comunica/actor-query-operation-filter-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-filter-sparqlee): Implements the filter operator.
* [`@comunica/actor-query-operation-group`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-group): Implements the group operator.
* [`@comunica/actor-query-operation-leftjoin`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-leftjoin): Implements the left join operator.
* [`@comunica/actor-query-operation-orderby-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend): Implements the order by operator.
