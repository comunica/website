---
title: 'Link Traversal'
description: 'An overview of research that has been done on Link-Traversal-based Query Processing.'
---

[Link-Traversal-based Query Processing (LTQP)](https://link.springer.com/content/pdf/10.1007/s13222-013-0122-1.pdf) is a querying paradigm
that enables querying over an interlinked set of Linked Data documents
by following links between them.

Research is being done on LTQP through various implementations in Comunica.
This page summarizes ongoing work, and provides links to demos.

## Experimental Implementations

A [dedicated (mono)repository](https://github.com/comunica/comunica-feature-link-traversal) has been created
that contains actors for enabling LTQP inside Comunica.

Since there are multiple approaches for handling LTQP,
multiple [configurations](https://github.com/comunica/comunica-feature-link-traversal/tree/master/engines/config-query-sparql-link-traversal/config).
We have configurations for the following use cases:
- Linked Open Data: [`config-default.json`](https://github.com/comunica/comunica-feature-link-traversal/blob/master/engines/config-query-sparql-link-traversal/config/config-default.json)
  - Available as an npm package: [`@comunica/query-sparql-link-traversal`](https://www.npmjs.com/package/@comunica/query-sparql-link-traversal)
- Solid pods: [`config-solid-default.json`](https://github.com/comunica/comunica-feature-link-traversal/blob/master/engines/config-query-sparql-link-traversal/config/config-solid-default.json)
  - Available as an npm package: [`@comunica/query-sparql-link-traversal-solid`](https://www.npmjs.com/package/@comunica/query-sparql-link-traversal-solid)
- TREE sources: [`config-tree.json`](https://github.com/comunica/comunica-feature-link-traversal/blob/master/engines/config-query-sparql-link-traversal/config/config-tree.json)

## Main findings

Below, you can read the high-level findings of our link traversal experiments.

### Link traversal over Solid pods

We have implemented link discovery actors dedicated to the structural properties of Solid data pods,
such as their reliance on [LDP containers](https://www.w3.org/TR/ldp/), and the [Solid type index](https://solid.github.io/type-indexes/).
We have evaluated their performance using the [SolidBench](https://github.com/SolidBench/SolidBench.js) benchmark.

[_Learn more in our academic article._](https://comunica.github.io/Article-EDBT2023-SolidQuery/)

#### Structural assumptions about Solid pods significantly boost performance

The table below shows a subset of the aggregated query results when using the dedicated LDP and Solid type index actors.

We can observe that the traditional reachability semantics for link traversal (`cNone`, `cMatch`, `cAll`)
are either unable to find all necessary documents in Solid pod to answer queries (low result accuracy <span style="text-decoration:overline">acc</span>) (`cNone` and `cMatch`),
or they follow too many links that they result in a timeout (&sum;to) (`cAll`).

However, when the add the Solid-specific actors (`cNone-solid`, `cMatch-solid`, `cAll-solid`),
we gain higher levels of accuracy.
The most optimal combination is `cMatch` with the Solid actors,
which achieves an accuracy of more than 99% in this case.

|  | <span style="text-decoration:overline">t</span> | &#126;t | <span style="text-decoration:overline">t1</span> | &#126;t1 | <span style="text-decoration:overline">req</span> | &sum;ans | <span style="text-decoration:overline">acc</span> | &sum;to |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| cNone | 40 | 0 | N/A | N/A | 8 | 0.00 | 0.00% | 0 |
| cMatch | 1,791 | 0 | 22,946 | 24,439 | 1,275 | 0.00 | 0.00% | 1 |
| cAll | 128,320 | 127,021 | 28,448 | 10,554 | 0 | 0.63 | 3.13% | 8 |
| cNone-solid | 1,552 | 1,006 | 425 | 331 | 357 | 20.50 | 74.14% | 0 |
| **cMatch-solid** | **12,483** | **2,372** | **2,309** | **925** | **2,708** | **39.13** | **99.14%** | **0** |
| cAll-solid | 123,979 | 125,235 | 48,382 | 10,368 | 16,623 | 3.13 | 17.40% | 7 |

#### Even if queries are slow, first results can arrive quickly

Some queries might take multiple seconds to finish.
Since all query algorithms have been designed to process results in a streaming manner,
results can arrive iteratively.
This means that results can arrive after a few milliseconds, even if the final result only arrives after multiple seconds,
as can be seen in the figure below.

<center>
  <img src="https://comunica.github.io/Article-EDBT2023-SolidQuery/img/experiments/querytimes_d2-3.svg" alt="Query times for discovery query 2.3" style="width:75%" \>
</center>

#### Type index discovery is slightly better than LDP discovery

As shown in the figure below, using the Solid type index for discovering data in pods results in
a significantly lower number of HTTP requests compared to LDP-based discovery.

<center>
  <img src="https://comunica.github.io/Article-EDBT2023-SolidQuery/img/experiments/queries_indexvsstorage_http_relative.svg" alt="Relative number of HTTP requests for discover queries" style="width:75%" \>
</center>

Even though this difference in number of HTTP requests is significant,
this results in only a minor difference in execution time, as shown below.

<center>
  <img src="https://comunica.github.io/Article-EDBT2023-SolidQuery/img/experiments/queries_indexvsstorage_time_relative.svg" alt="Relative execution time for discover queries" style="width:75%" \>
</center>

#### Pod size and fragmentation impact performance

When we fragment data inside our pods in different ways (`composite`, `separate`, `single`, `location`, `time`),
or we increase the amount of data inside pods by a given factor (`1`, `5`),
we see a signficant impact on performance, as shown in the query result arrival times of a query below.

<center>
  <img src="https://comunica.github.io/Article-EDBT2023-SolidQuery/img/experiments/querytimes_frag_d1-3.svg" alt="Query times for discovery query 1.3" style="width:75%" \>
</center>

#### Limitations and future work

The current main limitation of this approach is that it only works well for non-complex queries.
As soon as query complex increases, query execution times become too high to be practical.
The root cause of this problem is the lack of proper query planning,
which would need to happen adaptively as soon as pod-specific information is discovered.

## Try it out

Below, we list links to several example configurations for LTQP
that have been built as a Web client.

<iframe src="https://comunica.github.io/comunica-feature-link-traversal-web-clients/builds/" width="100%" height="1500px" frameborder="0" marginheight="0" marginwidth="0" scrolling="auto">Loading...</iframe>
