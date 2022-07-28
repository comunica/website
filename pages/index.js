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
          <img src="/img/comunica_red.svg" alt="Comunica" className="comunica-logo" />
          <h1 className="title">A knowledge graph querying framework</h1>
        </div>

        <p className="description">
          Flexible SPARQL and GraphQL over decentralized RDF on the Web.
        </p>

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
              Execute queries over multiple data sources of different types.
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
            <a href="https://cecs.anu.edu.au/">
              <img src="https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_anu_logo_small.svg" alt="ANU College of Engineering & Computer Science" />
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
