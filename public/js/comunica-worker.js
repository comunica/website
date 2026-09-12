/* Runs the Comunica query engine off the main thread, for the demo on the home page. */

const ENGINE_URL = 'https://rdf.js.org/comunica-browser/versions/v4/engines/query-sparql/comunica-browser.js';
const PROGRESS_INTERVAL = 250;

let engine;
let active;
let requests = 0;

// Wrap fetch before the engine is loaded, so that all of its requests are counted.
const originalFetch = self.fetch.bind(self);
self.fetch = function (...args) {
  requests++;
  return originalFetch(...args);
};

self.onmessage = function (event) {
  if (event.data.type === 'query') {
    runQuery(event.data);
  } else if (event.data.type === 'stop') {
    stopQuery(true);
  }
};

// Load the pre-built engine on first use, and keep it for later queries.
function loadEngine() {
  if (!engine) {
    importScripts(ENGINE_URL);
    engine = new self.Comunica.QueryEngine();
  }
  return engine;
}

function termToJson(term) {
  return term ? { termType: term.termType, value: term.value } : null;
}

// Finish the active query, ignoring any later events of the same run.
function finish(run, truncated) {
  if (run.finished) {
    return;
  }
  run.finished = true;
  clearInterval(run.timer);
  if (run.iterator) {
    run.iterator.destroy();
  }
  if (active === run) {
    active = undefined;
  }
  postMessage({ type: 'end', token: run.token, requests, truncated });
}

function fail(run, error) {
  if (run.finished) {
    return;
  }
  run.finished = true;
  clearInterval(run.timer);
  if (active === run) {
    active = undefined;
  }
  postMessage({ type: 'error', token: run.token, message: String((error && error.message) || error), requests });
}

function stopQuery(notify) {
  if (active) {
    const run = active;
    if (notify) {
      finish(run, false);
    } else {
      run.finished = true;
      clearInterval(run.timer);
      if (run.iterator) {
        run.iterator.destroy();
      }
      active = undefined;
    }
  }
}

async function runQuery({ token, query, sources, limit }) {
  stopQuery(false);
  requests = 0;

  const run = { token, finished: false, iterator: undefined, timer: undefined };
  active = run;
  run.timer = setInterval(() => postMessage({ type: 'progress', token, requests }), PROGRESS_INTERVAL);

  try {
    const result = await loadEngine().query(query, { sources });
    if (run.finished) {
      return;
    }

    // Queries that produce a single answer instead of a stream of rows.
    if (result.resultType === 'boolean' || result.resultType === 'void') {
      const value = await result.execute();
      postMessage({ type: 'variables', token, variables: ['result'] });
      postMessage({
        type: 'result',
        token,
        row: [{ termType: 'Literal', value: result.resultType === 'boolean' ? String(value) : 'Done' }],
        requests,
      });
      finish(run, false);
      return;
    }

    const quads = result.resultType === 'quads';
    let variables;
    if (quads) {
      variables = ['subject', 'predicate', 'object'];
    } else {
      const metadata = await result.metadata();
      // Comunica reports variables either directly or wrapped, depending on the version.
      variables = (metadata.variables || []).map(entry => (entry.variable ? entry.variable.value : entry.value));
    }
    if (run.finished) {
      return;
    }
    postMessage({ type: 'variables', token, variables });

    run.iterator = await result.execute();
    let count = 0;
    run.iterator.on('data', (item) => {
      count++;
      // One result past the limit proves that more exist, without rendering them.
      if (count > limit) {
        finish(run, true);
        return;
      }
      const row = quads
        ? [termToJson(item.subject), termToJson(item.predicate), termToJson(item.object)]
        : variables.map(variable => termToJson(item.get(variable)));
      postMessage({ type: 'result', token, row, requests });
    });
    run.iterator.on('end', () => finish(run, false));
    run.iterator.on('error', error => fail(run, error));
  } catch (error) {
    fail(run, error);
  }
}
