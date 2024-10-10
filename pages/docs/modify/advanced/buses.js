// Placed in separate dir because the [slug].js file cannot change the path name of js files since
// Next.js uses a fixed scheme based on the directory location of a JS file.

import Head from '../../../../components/Head';
import 'cross-fetch/polyfill';
import React from "react";
import Template from "../../../template";
import Markdown from "../../../../components/Markdown";

/**
 * Base url to use for linking to the Comunica repository.
 * @type {string}
 */
const rawRepoFiles = 'https://raw.githubusercontent.com/comunica/comunica/refs/heads/master/';
const treeRepoFiles = 'https://github.com/comunica/comunica/tree/master/';
const commonAbbreviation = [
    ['http', 'HTTP'],
    ['sparql', 'SPARQL'],
    ['rdf', 'RDF'],
]

/**
 * Replace snake case seperated abbreviation with their capitalized, well-known form
 * @param text
 */
function abbreviate(text) {
    let changed = text;
    for (const [abbreviation, replacement] of commonAbbreviation) {
        changed = changed.replace(new RegExp(`(^|-)${abbreviation}($|-)`, 'g'), `$1${replacement}$2`);
    }
    return changed;
}

function actorInfo(busName, { actorName, description }) {
    const packageUrl = `${treeRepoFiles}packages/${actorName}`;
    const actor = `@comunica/${actorName}`;
    const actorNameNatural = actorName
        .replace(`actor-${busName}-`, '')
        .replace(/-[a-zA-Z]/g, g => ` ${g[1].toUpperCase()}`)
        .replace(/^./, g => g.toUpperCase());

    return <tr>
        <td>{actorNameNatural}</td>
        <td><a href={packageUrl}>{actor}</a></td>
        <td><Markdown body={description} /></td>
    </tr>
}

function functionBusInfo({ busName, description, actors }) {
    const actorsInfo = actors.map(actor => actorInfo(busName, actor));
    const busNameNatural = abbreviate(busName)
        .replace(/-[a-zA-Z]/g, g => ` ${g[1].toUpperCase()}`)
        .replace(/^./, g => g.toUpperCase());
    return <>
        <h2 id={busName}>{busNameNatural}</h2>
        <p>
            <em>Package: <a href={`${treeRepoFiles}packages/bus-${busName}`}><code>@comunica/bus-{busName}</code></a></em>
        </p>
        <p>
            {description}
        </p>
        <table>
            <thead>
            <tr>
                <th>Actor</th>
                <th>Package</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {actorsInfo}
            </tbody>
        </table>
    </>
}

export default function Buses({ bussesInfo }) {
  const busInfo = bussesInfo.map(busInfo => functionBusInfo(busInfo));
  return (
    <Template key={'/docs/modify/advanced/busbis/'}>
    <div className="container-page">
      <Head
        title={'Buses and Actors'}
        description={'An overview of all buses in Comunica and their actors.'}
      />
        <main>
            <ul className="breadcrumbs">
                <li><a href="/docs/">Documentation</a></li>
                <li><a href="/docs/modify/">Modify Comunica</a></li>
                <li><a href="/docs/modify/advanced/">Advanced modification</a></li>
                <li>Buses and Actors</li>
            </ul>
            <div className="headers-overview">
                <p>On this page</p>
                <ol className="headers-overview-elements"/>
            </div>

            <h1>Buses and Actors</h1>
            <hr/>
            <p>
                This page gives
                an <strong>overview of all <em>buses</em> and <em>actors</em></strong> that
                are used in the default Comunica engines, such
                as <a href="https://github.com/comunica/comunica/tree/master/engines/query-sparql">Comunica
                SPARQL</a> and <a href="https://github.com/comunica/comunica/tree/master/engines/query-sparql-file">Comunica
                SPARQL File</a>.
                Other configurations such as <a href="https://github.com/comunica/comunica-query-sparql-hdt">Comunica
                SPARQL HDT</a> contain
                additional actors and buses.
            </p>
            <p>
                This builds upon
                the <a href="/docs/modify/advanced/architecture_core/">core
                architecture</a> of <em>actors</em>, <em>mediators</em>, and <em>buses</em>.
                An overview of how these buses and actors are connected can be found in
                the <a href="/docs/modify/advanced/architecture_sparql/">SPARQL architecture</a>.
            </p>
            {busInfo}
        </main>
    </div>
    </Template>
  )
}

async function fetchFile(url) {
    return await (await fetch(url)).text();
}

async function fetchJson(url) {
    try {
        const response = await fetchFile(url);
        return JSON.parse(response);
    } catch (e) {
        console.error(`Could not fetch ${url}: ${e}`);
        throw e;
    }
}

function sharedPrefixLength(a, b) {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
        i++;
    }
    return i;
}

async function generateActorInfo(actor) {
    const actorName = actor.replace('@comunica/', '');
    const actorReadme = await fetchFile(`${rawRepoFiles}packages/${actorName}/README.md`);
    const descriptionMatch = new RegExp(
        `^An? \\[([^\\]]*)\\]\\([^)]*\\)[ \n]actor((([^.]*\\.[^ \n])*[^.]*)*)\\.[ \n]`, 'gmiu'
    ).exec(actorReadme);

    if (!descriptionMatch) {
        throw new Error(`No description found for actor ${actorName} parsed:\n${actorReadme}`);
    }
    const description = descriptionMatch[2]
        .replaceAll('\n', ' ')
        .trim()
        .replace(/\s+/gu, ' ')
        .replace(/^that /gu, '')
        .replace(/^which /gu, '')
        .replace(/^./gu, g => g.toUpperCase());

    const busName = descriptionMatch[1].toLowerCase().replaceAll(' ', '-');

    return {
        busName,
        actorName,
        description,
    };
}

async function generateBusInfo(busName, actors) {
    const busPackage = await fetchJson(`${rawRepoFiles}packages/bus-${busName}/package.json`);
    const description = busPackage.description;
    return {
        busName,
        description,
        actors,
    };
}

export async function getStaticProps({...ctx}) {
    // fetch config default
    const defaultConfig = await fetchJson(`${rawRepoFiles}engines/query-sparql/package.json`);
    const actors = Object.keys(defaultConfig.dependencies).filter(dep => dep.startsWith('@comunica/actor-'));

    const actorInfo = await Promise.all(actors.map(actor => generateActorInfo(actor)));

    // Group matching actors by bus
    const busActors = {};
    actorInfo.forEach((actor) => {
        if (!(actor.busName in busActors)) {
            busActors[actor.busName] = [];
        }
        busActors[actor.busName].push(actor);
    });

    const bussesInfo = await Promise.all(
        Object.keys(busActors).map(busName => generateBusInfo(busName, busActors[busName]))
    );

    return { props: { bussesInfo } };
}
