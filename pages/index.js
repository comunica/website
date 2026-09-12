import Head from '../components/Head';
import LiveDemo from '../components/LiveDemo';

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

        <LiveDemo />

        <section className="home-section features">
          <p className="home-overline">Why Comunica</p>
          <div className="features-grid">
            <a href="docs/query/getting_started/query_browser_app/" className="feature">
              <span className="feature-badge"><span className="feature-glyph" style={{ '--icon': 'url(/img/web.svg)' }} /></span>
              <h3>For the Web</h3>
              <p>Powered by Web technologies, execute queries via JavaScript on server or client.</p>
              <span className="feature-link">Learn more &rarr;</span>
            </a>
            <a href="docs/query/advanced/federation/" className="feature">
              <span className="feature-badge"><span className="feature-glyph" style={{ '--icon': 'url(/img/sources.svg)' }} /></span>
              <h3>Decentralized</h3>
              <p>Execute federated queries over multiple heterogeneous data sources across the Web.</p>
              <span className="feature-link">Learn more &rarr;</span>
            </a>
            <a href="docs/modify/" className="feature">
              <span className="feature-badge"><span className="feature-glyph" style={{ '--icon': 'url(/img/modular.svg)' }} /></span>
              <h3>Modular</h3>
              <p>A collection of modules that can be combined to achieve a certain task.</p>
              <span className="feature-link">Learn more &rarr;</span>
            </a>
          </div>
        </section>

        <section className="home-section">
          <p className="home-overline">Get started</p>
          <div className="tiles">
            <a href="docs/query/" className="tile">
              <h3>Query with Comunica &rarr;</h3>
              <p>Learn how to execute queries</p>
            </a>
            <a href="docs/modify/" className="tile">
              <h3>Modify Comunica &rarr;</h3>
              <p>Configure or extend Comunica</p>
            </a>
            <a href="docs/query/advanced/solid" className="tile">
              <h3>Query Solid pods &rarr;</h3>
              <p>Query one or more Solid pods</p>
            </a>
            <a href="docs/query/advanced/mcp/" className="tile">
              <h3>Comunica MCP &rarr;</h3>
              <p>Connect it with AI agents</p>
            </a>
            <a href="https://opencollective.com/comunica-association" className="tile">
              <h3>Donate &rarr;</h3>
              <p>Sponsor via Open Collective</p>
            </a>
            <a href="contribute/" className="tile">
              <h3>Contribute &rarr;</h3>
              <p>Contribute to the development</p>
            </a>
          </div>
        </section>

        <section className="home-section">
          <p className="home-overline">Used by</p>
          <p className="home-lead">
            Production-ready, and <a href="/docs/query/usage/">widely used in commercial, governmental, and academic contexts</a>.
          </p>
          <div className="stats">
            <div className="stat">
              <strong>1.600+</strong>
              <span>dependent projects on GitHub</span>
            </div>
            <div className="stat">
              <strong>400.000+</strong>
              <span>monthly downloads on npm</span>
            </div>
            <div className="stat">
              <strong>300+</strong>
              <span>modules in the core framework</span>
            </div>
          </div>
        </section>

        <section className="home-section">
          <p className="home-overline">Supported by</p>
          <p className="home-lead">
            Comunica is a community-driven project, sustained by the <a href="/association/">Comunica Association</a>.
            If you are using Comunica, <a href="https://opencollective.com/comunica-association">becoming a sponsor or member</a> is a way to make Comunica sustainable in the long-term.
          </p>
          <div className="sponsor-panel">
            <div className="sponsor-tier">
              <h3>Board members</h3>
              <p>Directly contributing, or donating € 2500 / month</p>
              <div className="sponsor-logos sponsor-logos-member">
                <a href="https://www.ugent.be/ea/idlab/en">
                  <img src="img/members/idlab.png" alt="IDLab - Internet Technology and Data Science Lab" />
                </a>
                <a href="https://www.vlaanderen.be/digitaal-vlaanderen">
                  <img src="img/members/digitaal-vlaanderen.png" alt="Digitaal Vlaanderen" />
                </a>
              </div>
            </div>
            <div className="sponsor-tier">
              <h3>Bronze sponsors</h3>
              <p>Donating € 250 / month</p>
              <div className="sponsor-logos sponsor-logos-bronze">
                <a href="https://netwerkdigitaalerfgoed.nl/">
                  <img src="https://user-images.githubusercontent.com/440384/134636829-f730230c-bfec-4d40-86d1-67f28479cdcc.png" alt="Netwerk Digitaal Erfgoed" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
