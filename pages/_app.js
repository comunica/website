import '../styles/main.scss'
import '../node_modules/highlight.js/styles/github.css';
import ReactGA from 'react-ga';
import React from 'react';

export default class MyApp extends React.Component {

    render() {
        const { Component, pageProps } = this.props;
        return <Component {...pageProps} />
    }

    componentDidMount() {
        ReactGA.initialize('UA-175823881-1');
        ReactGA.pageview(window.location.pathname);

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
    }
}
