import React, { useCallback, useEffect, useRef, useState } from 'react';

const WORKER_URL = '/js/comunica-worker.js';
const WEB_CLIENT_URL = 'https://query.comunica.dev/';
const RESULT_LIMIT = 10;

const PRESETS = [
  {
    id: 'acquaintances',
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
  },
  {
    id: 'interests',
    label: 'Common interests of two people',
    query: `PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?interest ?name WHERE {
  <https://www.rubensworks.net/#me> foaf:topic_interest ?interest.
  <https://ruben.verborgh.org/profile/#me> foaf:topic_interest ?interest.
  ?interest rdfs:label ?name.
  FILTER LANGMATCHES(LANG(?name), "en")
}`,
    sources: [
      { url: 'https://www.rubensworks.net/', type: 'RDFa' },
      { url: 'https://ruben.verborgh.org/profile/', type: 'Turtle' },
      { url: 'https://fragments.dbpedia.org/2016-04/en', type: 'TPF' },
    ],
  },
  {
    id: 'bradpitt',
    label: 'Directors of movies starring Brad Pitt',
    query: `PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?title ?name WHERE {
  ?movie dbo:starring [ rdfs:label "Brad Pitt"@en ];
         rdfs:label ?title;
         dbo:director [ rdfs:label ?name ].
  FILTER LANGMATCHES(LANG(?title), "EN")
  FILTER LANGMATCHES(LANG(?name), "EN")
}`,
    sources: [
      { url: 'https://fragments.dbpedia.org/2016-04/en', type: 'TPF' },
    ],
  },
];

// The Web client reads its state from the URL fragment.
function webClientUrl(query, sources) {
  const encode = value => encodeURIComponent(value).replace(/\(/g, '%28').replace(/\)/g, '%29');
  const parameters = [
    `query=${encode(query)}`,
    `datasources=${sources.map(source => encode(source.url)).join(';')}`,
  ];
  return `${WEB_CLIENT_URL}#${parameters.join('&')}`;
}

function formatDuration(milliseconds) {
  return `${(milliseconds / 1000).toFixed(1)} s`;
}

const SPARQL_KEYWORDS = 'SELECT|CONSTRUCT|ASK|DESCRIBE|WHERE|PREFIX|BASE|FROM|NAMED|DISTINCT|REDUCED|' +
  'OPTIONAL|UNION|MINUS|GRAPH|SERVICE|FILTER|BIND|VALUES|AS|ORDER|BY|ASC|DESC|LIMIT|OFFSET|' +
  'GROUP|HAVING|NOT|IN|EXISTS|INSERT|DELETE|DATA|WITH|USING|SILENT|TRUE|FALSE|' +
  'LANGMATCHES|LANG|DATATYPE|BOUND|IRI|URI|STR|REGEX|COUNT|SUM|MIN|MAX|AVG|SAMPLE|GROUP_CONCAT';
const SPARQL_TOKEN = new RegExp([
  '(#[^\\n]*)',
  '(<[^<>\\s]*>)',
  '("(?:[^"\\\\]|\\\\.)*"(?:@[\\w-]+|\\^\\^\\S+)?)',
  '([?$][\\w]+)',
  '([A-Za-z_][\\w-]*:[\\w-]*|:[\\w-]+)',
  `\\b(${SPARQL_KEYWORDS})\\b`,
  '(\\b\\d+(?:\\.\\d+)?\\b)',
].join('|'), 'gi');
const SPARQL_CLASSES = ['comment', 'iri', 'string', 'variable', 'prefixed', 'keyword', 'number'];

// Splits a query into colored spans; plain text is passed through unchanged.
function highlightSparql(text) {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(SPARQL_TOKEN)) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const kind = SPARQL_CLASSES[match.slice(1).findIndex(group => group !== undefined)];
    parts.push(<span key={match.index} className={`sparql-${kind}`}>{match[0]}</span>);
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

export default function LiveDemo() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [query, setQuery] = useState(PRESETS[0].query);
  const [sources, setSources] = useState(PRESETS[0].sources);
  const [newSource, setNewSource] = useState('');
  const [state, setState] = useState('idle');
  const [engineReady, setEngineReady] = useState(false);
  const [variables, setVariables] = useState([]);
  const [rows, setRows] = useState([]);
  const [truncated, setTruncated] = useState(false);
  const [requests, setRequests] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(undefined);

  const worker = useRef(undefined);
  const token = useRef(0);
  const started = useRef(0);

  const run = useCallback((nextQuery = query, nextSources = sources) => {
    if (!worker.current) {
      return;
    }
    token.current++;
    started.current = Date.now();
    setState('running');
    setVariables([]);
    setRows([]);
    setTruncated(false);
    setRequests(0);
    setDuration(0);
    setError(undefined);
    worker.current.postMessage({
      type: 'query',
      token: token.current,
      query: nextQuery,
      sources: nextSources.map(source => source.url),
      limit: RESULT_LIMIT,
    });
  }, [query, sources]);

  useEffect(() => {
    const instance = new Worker(WORKER_URL);
    worker.current = instance;
    instance.onmessage = (event) => {
      const message = event.data;
      if (message.type === 'ready') {
        setEngineReady(true);
        return;
      }
      if (message.type === 'engineError') {
        setError(message.message);
        return;
      }
      // Ignore messages of queries that were replaced in the meantime.
      if (message.token !== token.current) {
        return;
      }
      setDuration(Date.now() - started.current);
      if (typeof message.requests === 'number') {
        setRequests(message.requests);
      }
      switch (message.type) {
        case 'variables':
          setVariables(message.variables);
          break;
        case 'result':
          setRows(previous => [...previous, message.row]);
          break;
        case 'end':
          setTruncated(message.truncated);
          setState('done');
          break;
        case 'error':
          setError(message.message);
          setState('done');
          break;
        default:
          break;
      }
    };
    instance.onerror = () => {
      setError('The query engine could not be loaded.');
      setState('done');
    };
    // Download the engine now, so that the first run only waits on the sources.
    instance.postMessage({ type: 'preload' });
    return () => {
      token.current++;
      instance.terminate();
      worker.current = undefined;
    };
  }, []);

  function stop() {
    if (worker.current) {
      worker.current.postMessage({ type: 'stop' });
    }
  }

  // Loading an example does not execute it; that stays up to the visitor.
  function selectPreset(id) {
    const preset = PRESETS.find(candidate => candidate.id === id);
    setPresetId(id);
    setQuery(preset.query);
    setSources(preset.sources);
    token.current++;
    setState('idle');
    setVariables([]);
    setRows([]);
    setTruncated(false);
    setRequests(0);
    setDuration(0);
    setError(undefined);
  }

  function addSource(event) {
    event.preventDefault();
    const url = newSource.trim();
    if (url && !sources.some(source => source.url === url)) {
      setSources([...sources, { url }]);
    }
    setNewSource('');
  }

  const running = state === 'running';
  let status;
  if (error) {
    status = `Query failed: ${error}`;
  } else if (!engineReady) {
    status = 'Loading the query engine…';
  } else if (state === 'idle') {
    status = 'Press Run to execute this query in your browser.';
  } else {
    status = `${rows.length}${truncated ? '+' : ''} result${rows.length === 1 ? '' : 's'}` +
      ` · ${formatDuration(duration)} · ${requests} HTTP request${requests === 1 ? '' : 's'}`;
  }

  return (
    <div className="grid-wide live-demo-row">
      <div className="live-demo">
        <div className="live-demo-header">
          <label className="live-demo-presets">
            Example
            <select value={presetId} onChange={event => selectPreset(event.target.value)}>
              {PRESETS.map(preset => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
            </select>
          </label>
          <span className="live-demo-links">
            <a href={webClientUrl(query, sources)}>Try more live queries &rarr;</a>
          </span>
        </div>

        <div className="live-demo-editor">
          <pre className="live-demo-highlight" aria-hidden="true">{highlightSparql(query)}{'\n'}</pre>
          <textarea
            className="live-demo-query"
            aria-label="SPARQL query"
            spellCheck="false"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>

        <div className="live-demo-sources">
          <span className="live-demo-sources-label">Sources</span>
          {sources.map(source => (
            <span key={source.url} className="live-demo-source">
              {source.type ? <span className="live-demo-source-type">{source.type}</span> : undefined}
              {source.url}
              <button
                type="button"
                title="Remove this source"
                onClick={() => setSources(sources.filter(other => other.url !== source.url))}
              >&times;</button>
            </span>
          ))}
          <form onSubmit={addSource}>
            <input
              type="text"
              className="live-demo-source-add"
              placeholder="+ Add a source URL"
              spellCheck="false"
              value={newSource}
              onChange={event => setNewSource(event.target.value)}
            />
          </form>
        </div>

        <div className="live-demo-actions">
          <button
            className="live-demo-run"
            onClick={running ? stop : () => run()}
            disabled={!running && (sources.length === 0 || query.trim() === '')}
          >
            {running ? '■ Stop' : '▶ Run query'}
          </button>
          <span className={`live-demo-status${error ? ' live-demo-error' : ''}`}>{status}</span>
        </div>

        {variables.length > 0 && !error ? (
          <div className="live-demo-results">
            <table>
              <thead>
                <tr>{variables.map(variable => <th key={variable}>?{variable}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((term, column) => (
                      <td key={column}>
                        {term && term.termType === 'NamedNode'
                          ? <a href={term.value}>{term.value}</a>
                          : (term ? term.value : '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && !running ? <p className="live-demo-empty">This query has no results.</p> : undefined}
          </div>
        ) : undefined}

        {truncated ? (
          <p className="live-demo-more">
            Only the first {RESULT_LIMIT} results are shown.{' '}
            <a href={webClientUrl(query, sources)}>See all results in the Web client &rarr;</a>
          </p>
        ) : undefined}
      </div>
    </div>
  );
}
