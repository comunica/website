---
title: 'Performance'
description: 'Insights into the performance of Comunica.'
---

Besides flexibility, performance is of high importance of Comunica.
That is why we keep a close eye to it through continuous performance tracking and large scale benchmarks.

## Continuous performance tracking

To keep track of the evolution of Comunica's performance,
we enable continuous performance tracking into our continuous integration.
For various benchmarks, we can observe the evolution of execution times across our commit history.
This allows us to easily identify which changes have a positive or negative impact on performance.

For considering the performance for different aspects, we have included the following benchmarks:

- WatDiv (in-memory)
- WatDiv (TPF)
- Berlin SPARQL Benchmark (in-memory)
- Berlin SPARQL Benchmark (TPF)
- Custom web queries: manually crafted queries to test for specific edge cases over the live Web

This allows us to inspect performance as follows:

<div class="docs-intro-img">
  <a href="https://comunica.github.io/comunica-performance-results/comunica/master/benchmarks-total/"><img src="/img/blog/2024-07-05-release_3_2/continuous-perf.png" alt="Continuous performance" style="width:100%" \></a>
</div>

_Fluctuations in the graph are mainly caused by confounding variables in the GitHub Actions environment, such as running on different hardware and runner versions._

These results can be inspected in [more close detail](https://github.com/comunica/comunica-performance-results) together with execution times per query separately.

## Centralized performance

Despite Comunica focusing on query execution over decentralized Knowledge Graphs,
it's still possible to use Comunica to query over a single centralized Knowledge Graph.
While we discourage this usage if you want to query over huge Knowledge Graph where performance is highly critical,
you can still get decent levels of performance compared to state-of-the-art engines,
as can be seen when running
the [Berlin SPARQL benchmark](http://wbsg.informatik.uni-mannheim.de/bizer/berlinsparqlbenchmark/)
and the [WatDiv benchmark](https://dsg.uwaterloo.ca/watdiv/).

The following engines were compared:

- [Comunica Memory](https://github.com/comunica/comunica/tree/master/engines/query-sparql#readme) (`@comunica/query-sparql` v4.2.0) using [in-memory triple store](https://github.com/rubensworks/rdf-stores.js).
- [Comunica HDT](https://github.com/comunica/comunica-feature-hdt/tree/master/engines/query-sparql-hdt#readme) (`@comunica/query-sparql-hdt` v4.0.2) using an [HDT-based triple store](https://www.rdfhdt.org/).
- [Jena Fuseki](https://jena.apache.org/) (v4.8.0): A Java-based engine.
- [Blazegraph](https://blazegraph.com/) (v2.1.5): A Java-based engine.
- [GraphDB](https://graphdb.ontotext.com/) (v10.6.4): A Java-based engine.
- [Virtuoso](https://vos.openlinksw.com/owiki/wiki/VOS/VOSSPARQL) (v7.2.14): An engine that translates SPARQL queries to SQL.
- [Oxigraph](https://github.com/oxigraph/oxigraph) (v0.4.9): A Rust-based engine.
- [QLever](https://github.com/ad-freiburg/qlever/) ([22 February 2025](https://github.com/ad-freiburg/qlever/commit/8fe0642)): A C++-based engine.

All experiments were executed on a 64-bit Ubuntu 14.04 machine with 128 GB of memory and a 24-core 2.40 GHz CPU,
and are [fully reproducible](https://github.com/comunica/Experiments-Centralized).
All experiments were preceded with a warmup of five runs,
and all execution times were averaged over ten runs.
These experiments were last executed in February 2025.

[A more detailed write-up of these experiments can be found here.](https://www.rubensworks.net/blog/2025/04/22/cost-modularity-sparql/) 

### BSBM Results

Below, execution times can be found for the Berlin SPARQL benchmark for an increasing dataset scale.
QLever is not included in this benchmark, since the BSBM benchmark runner requests results as SPARQL/XML,
which was not supported by QLever at the time of writing.
Query 6 is not included, because it was removed from the benchmark.
Query 7 is also not included, as it uses the <code>DESCRIBE</code> keyword, which is not normatively defined in the SPARQL specification, so different engines can have different implementations, leading to performance differences.
For the largest BSBM scale that was run (100K), Comunica-Memory is not included due to memory issues.

<div class="plot">
	<div class="plot-figures">
		<div><img src="/img/performance-centralized/bsbm-1k/plot_small.svg" alt="BSBM 1k small" /></div>
		<div><img src="/img/performance-centralized/bsbm-1k/plot_large.svg" alt="BSBM 1k large" /></div>
	</div>
<strong>Figure 1</strong>: BSBM with 1K resources (0,35M triples).
</div>

<div class="plot">
		<div class="plot-figures">
			<div><img src="/img/performance-centralized/bsbm-10k/plot_small.svg" alt="BSBM 10k small" /></div>
			<div><img src="/img/performance-centralized/bsbm-10k/plot_large.svg" alt="BSBM 10k large" /></div>
		</div>
<strong>Figure 2</strong>: BSBM with 10K resources (3,5M triples).
</div>

<div class="plot">
		<div class="plot-figures">
			<div><img src="/img/performance-centralized/bsbm-100k/plot_small.svg" alt="BSBM 100k small" /></div>
			<div><img src="/img/performance-centralized/bsbm-100k/plot_large.svg" alt="BSBM 100k large" /></div>
		</div>
<strong>Figure 3</strong>: BSBM with 100K resources (35M triples).
</div>

### WatDiv Results

Below, execution times can be found for the WatDiv benchmark for an increasing dataset scale.
For the largest WatDiv scale that was run (100K), Comunica-Memory is not included due to memory issues.

<div class="plot">
		<div class="plot-figures">
			<div><img src="/img/performance-centralized/watdiv-10/plot_small.svg" alt="WatDiv 10 small" /></div>
			<div><img src="/img/performance-centralized/watdiv-10/plot_large.svg" alt="WatDiv 10 large" /></div>
		</div>
<strong>Figure 4</strong>: WatDiv at scale 10 (1M triples).
</div>

<div class="plot">
		<div class="plot-figures">
			<div><img src="/img/performance-centralized/watdiv-100/plot_small.svg" alt="WatDiv 100 small" /></div>
			<div><img src="/img/performance-centralized/watdiv-100/plot_medium.svg" alt="WatDiv 100 medium" /></div>
			<div><img src="/img/performance-centralized/watdiv-100/plot_large.svg" alt="WatDiv 100 large" /></div>
		</div>
<strong>Figure 5</strong>: WatDiv at scale 100 (10M triples).
</div>

