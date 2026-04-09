import '../styles/main.scss'
import '../node_modules/highlight.js/styles/github.css';
import ReactGA from 'react-ga4';
import React from 'react';

export default class MyApp extends React.Component {

    render() {
        const { Component, pageProps } = this.props;
        return <Component {...pageProps} />
    }

    componentDidMount() {
        ReactGA.initialize('G-HT178MX8JL');
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname });

        // This should actually be in our Navigation component, but is not being called there for some reason
        const nav = document.querySelector('nav');
        const toggle = document.querySelector('.toggle-nav');
        toggle.addEventListener('click', (event) => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            } else {
                nav.classList.add('active');
            }

            event.preventDefault();
            return false;
        }, false);

        // Search modal
        const overlay = document.getElementById('search-overlay');
        const trigger = document.getElementById('nav-search-trigger');
        const closeBtn = document.getElementById('search-modal-close');
        let pagefindInitialized = false;

        const openSearch = () => {
            overlay.classList.add('search-overlay-open');

            if (!pagefindInitialized) {
                pagefindInitialized = true;

                // Load pagefind as an ES module via a <script type="module"> to avoid
                // webpack trying to bundle the dynamically-generated index files.
                const moduleScript = document.createElement('script');
                moduleScript.type = 'module';
                moduleScript.textContent = [
                    'import("/pagefind/pagefind.js")',
                    '  .then(pf => window.dispatchEvent(new CustomEvent("pagefind-ready", {detail: {pf}})))',
                    '  .catch(() => window.dispatchEvent(new CustomEvent("pagefind-ready", {detail: {}})));',
                ].join('\n');
                document.head.appendChild(moduleScript);

                window.addEventListener('pagefind-ready', (e) => {
                    const container = document.getElementById('nav-search');
                    const pf = e.detail.pf;

                    if (!pf) {
                        container.innerHTML =
                            '<p class="search-unavailable">Search is not available in development mode. ' +
                            'Run <code>npm run build</code> to generate the search index.</p>';
                        return;
                    }

                    container.innerHTML =
                        '<div class="pf-form">' +
                            '<input type="text" id="pf-input" class="pf-input"' +
                            ' placeholder="Search documentation…" autocomplete="off" />' +
                        '</div>' +
                        '<div id="pf-results" class="pf-results"></div>';

                    const input = document.getElementById('pf-input');
                    input.focus();

                    let timer;
                    input.addEventListener('input', function () {
                        clearTimeout(timer);
                        const query = this.value.trim();
                        timer = setTimeout(async () => {
                            const resultsDiv = document.getElementById('pf-results');
                            if (!query) { resultsDiv.innerHTML = ''; return; }

                            const search = await pf.search(query);
                            const data = await Promise.all(search.results.map(r => r.data()));

                            // Stable sort: docs pages first, then everything else,
                            // preserving the pagefind relevance order within each group.
                            const sorted = [
                                ...data.filter(r => r.url.startsWith('/docs/')),
                                ...data.filter(r => !r.url.startsWith('/docs/')),
                            ];

                            if (sorted.length === 0) {
                                resultsDiv.innerHTML =
                                    '<p class="pf-no-results">No results for <strong>' + query + '</strong></p>';
                                return;
                            }

                            resultsDiv.innerHTML = sorted.slice(0, 10).map(r =>
                                '<a href="' + r.url + '" class="pf-result">' +
                                    '<div class="pf-result-title">' + (r.meta.title || r.url) + '</div>' +
                                    '<div class="pf-result-excerpt">' + r.excerpt + '</div>' +
                                '</a>'
                            ).join('');
                        }, 300);
                    });
                }, { once: true });
            } else {
                const input = document.getElementById('pf-input');
                if (input) input.focus();
            }
        };

        const closeSearch = () => {
            overlay.classList.remove('search-overlay-open');
        };

        trigger.addEventListener('click', openSearch);
        closeBtn.addEventListener('click', closeSearch);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSearch();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
        });
    }
}
