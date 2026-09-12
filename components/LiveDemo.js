import React, { useState } from 'react';

// Static mockup data; to be replaced by a worker-backed implementation.
const PRESETS = {
  acquaintances: {
    label: 'Mutual acquaintances of three people',
    query: `PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX schema: <https://schema.org/>
SELECT DISTINCT ?person ?name WHERE {
  <https://www.rubensworks.net/#me> foaf:knows ?person.
  <https://pietercolpaert.be/#me> (foaf:knows|schema:colleague) ?person.
  <https://ruben.verborgh.org/profile/#me> foaf:knows ?person.
  ?person foaf:name ?name.
  FILTER(LANG(?name) = "")
}`,
    sources: [
      { url: 'https://www.rubensworks.net/', type: 'RDFa' },
      { url: 'https://pietercolpaert.be/', type: 'JSON-LD' },
      { url: 'https://data.verborgh.org/ruben', type: 'TPF' },
    ],
    status: '4 results in 4.1 s · 29 HTTP requests',
    variables: ['?person', '?name'],
    rows: [
      [{ iri: 'https://csarven.ca/#i' }, 'Sarven Capadisli'],
      [{ iri: 'https://pieterheyvaert.com/#me' }, 'Pieter Heyvaert'],
      [{ iri: 'https://julianrojas.org/#me' }, 'Julián Andrés Rojas Meléndez'],
      [{ iri: 'https://www.rubensworks.net/#me' }, 'Ruben Taelman'],
    ],
  },
  bradpitt: {
    label: 'Directors of movies starring Brad Pitt',
    query: `PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?title ?name WHERE {
  ?movie dbo:starring [ rdfs:label "Brad Pitt"@en ];
         rdfs:label ?title;
         dbo:director [ rdfs:label ?name ].
  FILTER LANGMATCHES(LANG(?title), "EN")
  FILTER LANGMATCHES(LANG(?name), "EN")
} LIMIT 10`,
    sources: [
      { url: 'https://fragments.dbpedia.org/2016-04/en', type: 'TPF' },
    ],
    status: '10 results in 2.2 s · 52 HTTP requests',
    variables: ['?title', '?name'],
    rows: [
      ['12 Monkeys', 'Terry Gilliam'],
      ['A River Runs Through It (film)', 'Robert Redford'],
      ['Across the Tracks', 'Sandy Tung'],
      ['Babel (film)', 'Alejandro González Iñárritu'],
      ['Burn After Reading', 'Ethan Coen'],
      ['Burn After Reading', 'Joel Coen'],
      ['By the Sea (2015 film)', 'Angelina Jolie'],
      ['Contact (1997 American film)', 'Robert Zemeckis'],
      ['Cool World', 'Ralph Bakshi'],
      ['Cutting Class', 'Rospo Pallenberg'],
    ],
  },
};

export default function LiveDemo() {
  const [presetId, setPresetId] = useState('acquaintances');
  const preset = PRESETS[presetId];
  const lines = preset.query.split('\n').length;

  return (
    <div className="live-demo">
      <div className="live-demo-header">
        <label className="live-demo-presets">
          Example
          <select value={presetId} onChange={e => setPresetId(e.target.value)}>
            {Object.entries(PRESETS).map(([id, p]) => <option key={id} value={id}>{p.label}</option>)}
          </select>
        </label>
        <span className="live-demo-links">
          <a href="https://query.comunica.dev/">Open in the Web client &rarr;</a>
          <a href="/docs/query/getting_started/query_browser_app/">How this works &rarr;</a>
        </span>
      </div>
      <textarea key={presetId} className="live-demo-query" rows={lines} spellCheck="false" defaultValue={preset.query} />
      <div className="live-demo-sources">
        <span className="live-demo-sources-label">Sources</span>
        {preset.sources.map(s => (
          <span key={s.url} className="live-demo-source">
            <span className="live-demo-source-type">{s.type}</span>
            {s.url}
            <button type="button" title="Remove source">&times;</button>
          </span>
        ))}
        <input type="text" className="live-demo-source-add" placeholder="+ Add a source URL" spellCheck="false" />
      </div>
      <div className="live-demo-actions">
        <button className="live-demo-run">&#9654; Run query</button>
        <span className="live-demo-status">{preset.status}</span>
      </div>
      <div className="live-demo-results">
        <table>
          <thead><tr>{preset.variables.map(v => <th key={v}>{v}</th>)}</tr></thead>
          <tbody>
            {preset.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell.iri ? <a href={cell.iri}>{cell.iri}</a> : cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
