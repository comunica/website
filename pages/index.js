import Head from '../components/Head';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Rotate SPARQL queries
    const queries = document.querySelectorAll('.sparql-query');
    let currentQuery = 0;
    
    const rotateQueries = () => {
      queries[currentQuery].classList.remove('active');
      currentQuery = (currentQuery + 1) % queries.length;
      queries[currentQuery].classList.add('active');
    };
    
    const intervalId = setInterval(rotateQueries, 4000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <Head
          title={'A knowledge graph querying framework'}
          description={'Query-driven integration of heterogeneous Knowledge Graphs. Execute SPARQL queries over decentralized data sources.'}
      />

      <main id="software">
        <div className="hero">
          <img src="/img/comunica_red_no_fill.svg" alt="Comunica" className="hero-logo" />
          <h1 className="hero-title">A knowledge graph querying framework</h1>
          <p className="hero-subtitle">
            Query-driven integration of heterogeneous Knowledge Graphs
          </p>
          <div className="hero-buttons">
            <a href="docs/query/" className="button-primary">Get Started</a>
            <a href="https://query.comunica.dev/" className="button-secondary">Try Live</a>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-item">
            <div className="feature-icon-large">🔗</div>
            <h2>Query Decentralized Knowledge Graphs</h2>
            <p className="feature-description">
              Query decentralized Knowledge Graphs as if they were centralized.<br/>
              Stop worrying about how and where your data is published.
            </p>
            <div className="source-types-scroll">
              <div className="source-types-track">
                <span>SPARQL endpoints</span>
                <span>Linked Data documents</span>
                <span>HDT files</span>
                <span>Triple Pattern Fragments</span>
                <span>Quad Pattern Fragments</span>
                <span>JSON-LD</span>
                <span>RDF/XML</span>
                <span>Turtle</span>
                <span>SPARQL endpoints</span>
                <span>Linked Data documents</span>
                <span>HDT files</span>
              </div>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-large">🌐</div>
            <h2>Built for the Web</h2>
            <p className="feature-description">
              Execute queries client-side or server-side, via TypeScript/JavaScript
            </p>
            <div className="platform-icons">
              <div className="platform-icon" title="Chrome">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <circle cx="12" cy="12" r="10" fill="#4285F4"/>
                  <circle cx="12" cy="12" r="6" fill="white"/>
                  <circle cx="12" cy="12" r="4" fill="#4285F4"/>
                </svg>
                <span>Chrome</span>
              </div>
              <div className="platform-icon" title="Firefox">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <circle cx="12" cy="12" r="10" fill="#FF7139"/>
                  <circle cx="12" cy="12" r="6" fill="#FFCB00"/>
                </svg>
                <span>Firefox</span>
              </div>
              <div className="platform-icon" title="Node.js">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path d="M12 2L2 7v10l10 5 10-5V7z" fill="#339933"/>
                </svg>
                <span>Node.js</span>
              </div>
              <div className="platform-icon" title="Deno">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <circle cx="12" cy="12" r="10" fill="#000"/>
                  <circle cx="12" cy="12" r="6" fill="white"/>
                </svg>
                <span>Deno</span>
              </div>
              <div className="platform-icon" title="Bun">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <circle cx="12" cy="12" r="10" fill="#FBF0DF"/>
                  <circle cx="12" cy="12" r="6" fill="#F9DBBB"/>
                </svg>
                <span>Bun</span>
              </div>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-large">⚙️</div>
            <h2>Modular and Flexible</h2>
            <p className="feature-description">
              Build custom query engines for specific querying needs, or use a pre-built engine
            </p>
            <div className="config-example">
              <pre><code>{`{
  "@context": [...],
  "@id": "urn:comunica:my",
  "actors": [
    {
      "@id": "ex:rdfParse",
      "@type": "ActorRdfParseJsonLd"
    },
    {
      "@id": "ex:rdfResolve",
      "@type": "ActorRdfResolveQuadPattern"
    },
    {
      "@id": "ex:optimize",
      "@type": "ActorOptimizeQueryOperation"
    }
  ]
}`}</code></pre>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-large">✨</div>
            <h2>Fully SPARQL 1.2 Compliant</h2>
            <p className="feature-description">
              Make use of the most modern SPARQL features
            </p>
            <div className="sparql-carousel">
              <div className="sparql-query active">
                <pre><code>{`SELECT ?person ?name WHERE {
  ?person foaf:name ?name .
  FILTER(lang(?name) = "en")
}`}</code></pre>
              </div>
              <div className="sparql-query">
                <pre><code>{`CONSTRUCT {
  ?s ?p ?o
} WHERE {
  SERVICE <https://dbpedia.org/sparql> {
    ?s ?p ?o
  }
}`}</code></pre>
              </div>
              <div className="sparql-query">
                <pre><code>{`SELECT * WHERE {
  ?s ?p ?o .
  OPTIONAL { ?s rdfs:label ?label }
} LIMIT 100`}</code></pre>
              </div>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-large">📖</div>
            <h2>Free and Open Source</h2>
            <p className="feature-description">
              Use in any project, open or commercial
            </p>
            <div className="github-badge">
              <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <div>
                <strong>MIT Licensed</strong>
                <p>Available on <a href="https://github.com/comunica/comunica">GitHub</a></p>
              </div>
            </div>
          </div>

          <div className="feature-item ai-ready">
            <div className="feature-icon-large">🤖</div>
            <h2>AI and MCP-Ready</h2>
            <p className="feature-description">
              Integrate with AI systems and Model Context Protocol for intelligent knowledge graph querying
            </p>
          </div>
        </div>

        <div className="getting-started">
          <h2>Getting Started</h2>
          <div className="getting-started-grid">
            <a href="docs/query/" className="card-getting-started">
              <h3>Query with Comunica</h3>
              <p>Learn how to execute SPARQL queries over knowledge graphs</p>
              <span className="card-arrow">→</span>
            </a>
            <a href="docs/modify/" className="card-getting-started">
              <h3>Modify Comunica</h3>
              <p>Configure and extend Comunica for your needs</p>
              <span className="card-arrow">→</span>
            </a>
            <a href="contribute/" className="card-getting-started">
              <h3>Contribute</h3>
              <p>Join the community and contribute to development</p>
              <span className="card-arrow">→</span>
            </a>
            <a href="https://opencollective.com/comunica-association" className="card-getting-started">
              <h3>Donate</h3>
              <p>Support the project via Open Collective</p>
              <span className="card-arrow">→</span>
            </a>
          </div>
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
