import React from 'react';

export default class Navigation extends React.Component {
    render() {
        return <nav>
            <div>
                <a href="/"><img src="/img/comunica_white.svg" className="nav-icon" alt="Comunica logo" /></a>
                <a href="#" className="toggle-nav"><img src="/img/navigation-toggle.svg" alt="Toggle navigation bar" /></a>
            </div>
            <ul>
                <li><a href="http://query.linkeddatafragments.org/">Try live</a></li>
                <li><a href="/docs/">Docs</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li><a href="/about/">About</a></li>
                <li><a href="/ask/">Ask</a></li>
                <li><a href="/research/">Research</a></li>
				<li><a href="/association/">Association</a></li>
                <li><a href="https://github.com/comunica/comunica">GitHub</a></li>
            </ul>
        </nav>;
    }

    componentDidMount() {
        // This is not being called for some reason, see _app.js
    }
}
