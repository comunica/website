import Head from '../components/Head';

export default function Home() {
  return (
    <div className="container">
      <Head
          title={'A knowledge graph querying framework'}
          description={'Flexible SPARQL and GraphQL over decentralized RDF on the Web.'}
      />

      <main id="software">
        <div className={"intro"}>
          <img src="/img/comunica_red_no_fill.svg" alt="Comunica" className="comunica-logo" />
          <h1 className="title">A knowledge graph querying framework</h1>
        </div>

        <p className="description">
          Flexible SPARQL and GraphQL over decentralized RDF on the Web.
        </p>

        <div className="live-demo">
          <div className="live-demo-header">
            <label className="live-demo-presets">
              Example
              <select defaultValue="interests">
                <option value="interests">Shared interests of two people (federated)</option>
                <option value="brad-pitt">Directors of movies starring Brad Pitt</option>
              </select>
            </label>
            <span className="live-demo-links">
              <a href="https://query.comunica.dev/">Open in the Web client &rarr;</a>
              <a href="/docs/query/getting_started/query_browser_app/">How this works &rarr;</a>
            </span>
          </div>
          <textarea className="live-demo-query" rows="8" spellCheck="false" defaultValue={`PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?interest ?name WHERE {
  <https://ruben.verborgh.org/profile/#me> foaf:topic_interest ?interest.
  <https://www.rubensworks.net/#me> foaf:topic_interest ?interest.
  ?interest rdfs:label ?name.
  FILTER LANGMATCHES(LANG(?name), "EN")
}`} />
          <label className="live-demo-sources">
            Sources
            <textarea rows="3" spellCheck="false" defaultValue={`https://ruben.verborgh.org/profile/
https://www.rubensworks.net/
https://fragments.dbpedia.org/2016-04/en`} />
          </label>
          <div className="live-demo-actions">
            <button className="live-demo-run">&#9654; Run query</button>
            <span className="live-demo-status">4 results in 1.8 s</span>
          </div>
          <div className="live-demo-results">
            <table>
              <thead><tr><th>?interest</th><th>?name</th></tr></thead>
              <tbody>
                <tr><td><a href="http://dbpedia.org/resource/Linked_Data">http://dbpedia.org/resource/Linked_Data</a></td><td>Linked Data</td></tr>
                <tr><td><a href="http://dbpedia.org/resource/Semantic_Web">http://dbpedia.org/resource/Semantic_Web</a></td><td>Semantic Web</td></tr>
                <tr><td><a href="http://dbpedia.org/resource/World_Wide_Web">http://dbpedia.org/resource/World_Wide_Web</a></td><td>World Wide Web</td></tr>
                <tr><td><a href="http://dbpedia.org/resource/Decentralization">http://dbpedia.org/resource/Decentralization</a></td><td>Decentralization</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-wide">
          <div className="card-info">
            <img src="/img/web.svg" alt="Web" className="feature-icon" />
            <h3>For the Web</h3>
            <p>
              Powered by Web technologies, execute queries via JavaScript on server or client.
            </p>
          </div>
          <div className="card-info">
            <img src="/img/ldf.svg" alt="Web" className="feature-icon" />
            <h3>Heterogeneous</h3>
            <p>
              Execute queries over multiple federated data sources of different types.
            </p>
          </div>
          <div className="card-info">
            <img src="/img/modular.svg" alt="Web" className="feature-icon" />
            <h3>Modular</h3>
            <p>
              A collection of modules that can be combined to achieve a certain task.
            </p>
          </div>
        </div>

        <div className="grid">
          <a href="docs/query/" className="card">
            <h3>Query with Comunica &rarr;</h3>
            <p>Learn how to execute queries</p>
          </a>

          <a href="docs/modify/" className="card">
            <h3>Modify Comunica &rarr;</h3>
            <p>Learn how to configure or extend</p>
          </a>

          <a href="docs/query/advanced/solid" className="card">
            <h3>Query Solid pods &rarr;</h3>
            <p>Query one or more Solid pods</p>
          </a>

          <a href="docs/query/advanced/mcp/" className="card">
            <h3>Comunica MCP &rarr;</h3>
            <p>Connect Comunica with AI Agents</p>
          </a>

          <a href="https://opencollective.com/comunica-association" className="card">
            <h3>Donate &rarr;</h3>
            <p>Sponsor via Open Collective</p>
          </a>

          <a href="contribute/" className="card">
            <h3>Contribute &rarr;</h3>
            <p>Contribute to the development</p>
          </a>
        </div>

        <div className="container-page sponsors">
          <h2>Used By</h2>
          <p>
            Comunica is production-ready, and is <a href="/docs/query/usage/">widely within commercial, governmental, and academic contexts</a>.<br />
            It has <strong>1.600+ dependent projects</strong> on GitHub (only counting open-source projects),<br />
            and reaches <strong>400.000+ monthly downloads</strong> on npm.
          </p>
        </div>

        <div className="container-page sponsors">
          <h2>Supported By</h2>
          <p>
            Comunica is a community-driven project, sustained by the <a href="/association/">Comunica Association</a>.
            If you are using Comunica, <a href="https://opencollective.com/comunica-association">becoming a sponsor or member</a> is a way to make Comunica sustainable in the long-term.
          </p>
          <div className="sponsors-member">
            <h3>Board Members</h3>
            <p>The members below are directly contributing, or are donating € 2500 EUR / month.</p>
            <a href="https://www.ugent.be/ea/idlab/en">
              <img src="img/members/idlab.png" alt="IDLab - Internet Technology and Data Science Lab" />
            </a>
            <a href="https://www.vlaanderen.be/digitaal-vlaanderen">
              <img src="img/members/digitaal-vlaanderen.png" alt="Digitaal Vlaanderen" />
            </a>
          </div>
          <div className="sponsors-bronze">
            <h3>Bronze Sponsors</h3>
            <p>The sponsors below are donating € 250 EUR / month.</p>
            <a href="https://netwerkdigitaalerfgoed.nl/">
              <img src="https://user-images.githubusercontent.com/440384/134636829-f730230c-bfec-4d40-86d1-67f28479cdcc.png" alt="Netwerk Digitaal Erfgoed" />
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
