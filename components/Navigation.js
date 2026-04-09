import React from 'react';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2.5"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

export default function Navigation() {
    return (
        <>
            <nav>
                <div>
                    <a href="/"><img src="/img/comunica_white.svg" className="nav-icon" alt="Comunica logo" /></a>
                    <a href="#" className="toggle-nav"><img src="/img/navigation-toggle.svg" alt="Toggle navigation bar" /></a>
                </div>
                <ul>
                    <li><a href="https://query.comunica.dev/">Try live</a></li>
                    <li><a href="/docs/">Docs</a></li>
                    <li><a href="/blog/">Blog</a></li>
                    <li><a href="/about/">About</a></li>
                    <li><a href="/ask/">Ask</a></li>
                    <li><a href="/research/">Research</a></li>
                    <li><a href="/events/">Events</a></li>
                    <li><a href="/association/">Association</a></li>
                    <li><a href="https://github.com/comunica/comunica">GitHub</a></li>
                    <li>
                        <button className="nav-search-btn" id="nav-search-trigger" aria-label="Open search">
                            <SearchIcon />
                            <span className="nav-search-label">Search</span>
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
                <div className="search-modal">
                    <button className="search-modal-close" id="search-modal-close" aria-label="Close search">
                        &times;
                    </button>
                    <div id="nav-search" />
                </div>
            </div>
        </>
    );
}
