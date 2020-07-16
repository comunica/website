import Head from '../components/Head';

export default function Home() {
  return (
    <div className="container">
      <Head title={'Index'}/>

      <main>
        <div className={"intro"}>
          <img src="/img/comunica_red.svg" alt="Comunica" className="comunica-logo" />
          <h1 className="title">A Linked Data querying framework</h1>
        </div>

        <p className="description">
          Flexible, Web-friendly SPARQL querying over RDF in JavaScript.
        </p>

        <div className="grid-wide">
          <div className="card-info">
            <img src="/img/web.svg" alt="Web" className="feature-icon" />
            <h3>For the Web</h3>
            <p>
              Powered by native Web technologies, execute queries server or client-side.
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
            <p>Lean how to execute queries</p>
          </a>

          <a href="docs/modify/" className="card">
            <h3>Modify Comunica &rarr;</h3>
            <p>Learn how to configure or extend</p>
          </a>
        </div>
      </main>
    </div>
  )
}
