import React, { useEffect, useState } from 'react';
import Head from '../components/Head';

export default function Search() {
    const [pagefindError, setPagefindError] = useState(false);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/pagefind/pagefind-ui.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = '/pagefind/pagefind-ui.js';
        script.onload = () => {
            new window.PagefindUI({ element: '#search', showSubResults: true });
        };
        script.onerror = () => {
            setPagefindError(true);
        };
        document.head.appendChild(script);
    }, []);

    return (
        <div className="container-page" data-pagefind-ignore="all">
            <Head
                title={'Search'}
                description={'Search the Comunica documentation and blog.'}
            />
            <main>
                <h1>Search</h1>
                <hr />
                {pagefindError ? (
                    <p className="search-unavailable">
                        Search is not available in development mode.
                        Run <code>npm run build</code> to generate the search index.
                    </p>
                ) : (
                    <div id="search" />
                )}
            </main>
        </div>
    );
}
