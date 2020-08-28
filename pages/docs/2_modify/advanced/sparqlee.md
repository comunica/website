---
title: 'Sparqlee'
description: 'The SPARQL expression evaluation engine of Comunica.'
---

Sparqlee is an [open-source](https://github.com/comunica/sparqlee) SPARQL 1.1 expression engine
that is used by different Comunica actors for evaluating expressions.

Concretely, the following actors make us of this:
* [`@comunica/actor-query-operation-extend`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend): Implements the extend operator.
* [`@comunica/actor-query-operation-filter-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-filter-sparqlee): Implements the filter operator.
* [`@comunica/actor-query-operation-group`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-group): Implements the group operator.
* [`@comunica/actor-query-operation-leftjoin-nestedloop`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend): Implements the left join operator.
* [`@comunica/actor-query-operation-orderby-sparqlee`](https://github.com/comunica/comunica/tree/master/packages/actor-query-operation-extend): Implements the order by operator.
