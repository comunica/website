---
title: 'Approximate Membership Functions'
description: 'An overview of research that has been done on AMFs during query execution.'
---

Approximate Membership Functions (AMFs) are probabilistic data structures
that efficiently can determine membership of a set,
at the cost of false positives.
They are typically much smaller than a full dataset,
making them a useful pre-filtering method.

AMFs have been investigated in the context of reducing the number of HTTP requests
when querying over a [Triple Pattern Fragments](https://linkeddatafragments.org/specification/triple-pattern-fragments/) interface.

## 1. Materials

* [Academic article](https://comunica.github.io/Article-SSWS2020-AMF/) ([Initial work that was built upon](https://linkeddatafragments.org/publications/iswc2015-amf.pdf))
* [Reproducible experiments](https://github.com/comunica/Experiments-AMF)
* [AMF-enabled Comunica engine](https://github.com/comunica/comunica-feature-amf/)
* [AMF-enabled LDF Server](https://github.com/LinkedDataFragments/Server.js/tree/feature-handlers-amf-2)

## 2. Main findings

[_Learn more in our academic article._](https://comunica.github.io/Article-SSWS2020-AMF/)

### AMFs lead to faster complete results

Due to the reduction of HTTP requests, complete results come in earlier.
In some cases, the first result can be delayed.

<center>
  <img src="https://comunica.github.io/Article-SSWS2020-AMF/img/experiments/client_algos/query_times_F3.svg" style="width:75%" \>
</center>

### Caching significantly speeds up query execution

An HTTP cache like NGINX achieves the best results, but additionally caching AMF filters server-side is not worth the effort.

<center>
  <img src="https://comunica.github.io/Article-SSWS2020-AMF/img/experiments/caching/plot_no_c.svg" style="width:75%" \>
</center>

### Extreme false-positive probabilities slow down query execution

On average, a false-positive probability of 1/64 leads to the lowest overall query evaluation times for this experiment.

<center>
  <img src="https://comunica.github.io/Article-SSWS2020-AMF/img/experiments/probabilities/plot_no_c.svg" style="width:75%" \>
</center>

## 3. Recommendations for data publishers

Based on the conclusions of our experimental results,
we derived the following guidelines for publishers who aim to use the AMF feature:

* Enable **HTTP caching** with a tool such as [NGINX](https://www.nginx.com/).
* **Pre-compute AMFs** (or at least cache) AMFs of size 10.000 or higher.
* If AMFs can be cached, prefer **Bloom filters** over GCS.
* Use a false-positive **probability of 1/64**.
