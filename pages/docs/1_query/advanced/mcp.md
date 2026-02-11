---
title: 'MCP'
description: 'Allow AI agents to query with Comunica through MCP.'
---

[MCP server](https://modelcontextprotocol.io/) is a protocol that allows AI agents such as Claude and ChatGPT
to connect to and interact with external services.
Most Comunica engines are available through MCP (find them on [GitHub](https://github.com/comunica/comunica-feature-mcp)),
which allows agents to query over decentralized RDF knowledge graphs on the Web,
thereby significantly improving the accuracy of answers and expressivity of actions by AI agents.

## Getting started

The easiest way to get started is by configuring [Comunica MCP SPARQL](https://github.com/comunica/comunica-feature-mcp/tree/master/engines/mcp-sparql),
for example into your `claude_desktop_config.json` file (can be found via Settings / Developer / Edit Config):

```json
{
  "mcpServers": {
    "comunica-sparql": {
      "command": "npx",
      "args": [
        "-y",
        "@comunica/mcp-sparql",
        "--mode",
        "stdio"
      ]
    }
  }
}
```

Then, you can ask Claude something like the following:

> Use Comunica SPARQL to determine what movies both Brad Pitt and Leonardo DiCaprio both play in.

More configuration and usage details can be found in the README of [Comunica MCP SPARQL](https://github.com/comunica/comunica-feature-mcp/tree/master/engines/mcp-sparql).

## Prompt suggestions

If you want your agent to always use SPARQL for higher accuracy in answers, you can tell it the following:

> When looking up data, always prefer looking them up over Knowledge Graphs via SPARQL, as this is more precise.
> If data needs to be combined from multiple Knowledge Graphs, do so using a virtually integrated SPARQL query towards multiple URLs pointing to Knowledge Graphs.
> You are responsible for selecting relevant sources for the SPARQL query, for which you can consider SPARQL endpoints, TPF interfaces, and Linked Data (in any RDF serialization).
> Also take into account that many websites contain RDF data. So if you need to lookup data about something, and you know the relevant website(s), try querying those websites using SPARQL.
> Since SPARQL queries can take a while to execute, start producing an approximate answer yourself and show it to me if the SPARQL query takes more than 1 second, but then make the answer more concrete based on the SPARQL query once it finalized, as it will be more accurate.
> Since you will probably query over Wikidata and DBpedia often, prefer authoritative Knowledge Graphs for domain-specific data if they exist.

After this, SPARQL will be used for questions such as:

- "What is the time zone of Salt Lake City?"
- "What movies do both Brad Pitt and Leonardo DiCaprio play in?"
- "What are the largest cities in Canada?"
- "Give me Ruben Taelman's main interests."
- "What are some proteins associated with Alzheimer's disease, according to a protein knowledge graph?"
- "What are the 10 longest streets in Belgium?"

## Limitations

Most models seem to prefer Wikidata and DBpedia for most questions.
If you want it to query another Knowledge Graph, you need to be explicit.
When performing federated queries, endpoint URLs passed to the MCP server are not always accurate.

## Learn more

Besides Comunica SPARQL MCP, other Comunica engines can also be found within a [dedicated monorepo on GitHub](https://github.com/comunica/comunica-feature-mcp):

* [Comunica MCP SPARQL](https://github.com/comunica/comunica-feature-mcp/tree/master/engines/mcp-sparql): An MCP server for SPARQL querying over decentralized RDF knowledge graphs on the Web.
* [Comunica MCP SPARQL File](https://github.com/comunica/comunica-feature-mcp/tree/master/engines/mcp-sparql-file): An MCP server for SPARQL querying over local RDF files.
* [Comunica MCP SPARQL HDT](https://github.com/comunica/comunica-feature-mcp/tree/master/engines/mcp-sparql-hdt): An MCP server for SPARQL querying over HDT files.
* [Comunica MCP SPARQL Solid](https://github.com/comunica/comunica-feature-mcp/tree/master/engines/mcp-sparql-solid): An MCP server for SPARQL querying over Solid data pods with authentication.
* [Comunica MCP SPARQL Link Traversal](https://github.com/comunica/comunica-feature-mcp/tree/master/engines/mcp-sparql-link-traversal): An MCP server for SPARQL querying with link traversal capabilities.
* [Comunica MCP SPARQL Link Traversal Solid](https://github.com/comunica/comunica-feature-mcp/tree/master/engines/mcp-sparql-link-traversal-solid): An MCP server for SPARQL querying over Solid data pods with link traversal and authentication.
