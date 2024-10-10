import Head from '../components/Head';
import matter from 'gray-matter'
import DocIndex from "../components/DocIndex";
import BlogIndex from "../components/BlogIndex";
import BreadCrumbs from "../components/Breadcrumbs";
import Markdown from "../components/Markdown";
import React from 'react';
import Template from "./template";

const additionalMattersData = [
    {
        path: '/docs/modify/advanced/buses/',
        sortKey: '/docs/2_modify/advanced/buses/',
        title: 'Buses and Actors',
        description: 'An overview of all buses in Comunica and their actors.',
    }
];

export default class Page extends React.Component {
    render() {
        const { frontmatter, body, path, sortedPaths, mattersData, excerpt } = this.props;
        let dateString = '';
        if (path.startsWith('/blog/')) {
            const [_, year, month, day] = /^\/blog\/([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])-/.exec(path);
            const date = new Date(`${month} ${day} ${year}`)
                .toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            dateString = <p className={"date"}>{date}</p>;
        }
        return (
            <Template key={path}>
            <div className="container-page">
                <Head title={frontmatter.title} description={excerpt || frontmatter.description}/>
                <main>
                    <BreadCrumbs frontmatter={frontmatter} path={path} paths={sortedPaths} mattersData={mattersData}/>
                    <h1>{frontmatter.title}</h1>
                    { dateString }
                    <hr />
                    {frontmatter.wip && <div className={'wip'}>
                        <h2>🚧 Under construction 🚧️</h2>
                        <p>
                            This section still needs to be created 🔨.
                            <br />
                            In the meantime, you can read our <a href={"https://comunica.readthedocs.io/en/latest/"}>old documentation</a> and check our <a href={"https://github.com/comunica?utf8=%E2%9C%93&q=topic%3Atutorial&type=&language="}>tutorials</a>.
                        </p>
                        <p>
                            <a href={"/contribute/"}>You can contribute by helping to write guides like this.</a>
                        </p>
                    </div>}
                    <div className="headers-overview">
                        <p>On this page</p>
                        <ol className="headers-overview-elements"/>
                    </div>
                    <Markdown body={body} />
                    {frontmatter.index && <DocIndex path={path} paths={sortedPaths} mattersData={mattersData} reverse={frontmatter.reverse}/>}
                    {frontmatter.blog_index && <BlogIndex path={path} paths={sortedPaths} mattersData={mattersData}/>}
                </main>
            </div>
            </Template>
        )
    }
}

export async function getStaticProps({ ...ctx }) {
    const { slug } = ctx.params;
    const { paths, matters } = await getStaticData();
    const path = '/' + slug.join('/');
    const data = matters[path + '/'];
    const mattersData = {};
    for (const p in matters) {
        mattersData[p] = matters[p].data;
        const excerpt = matters[p].excerpt;
        if (excerpt) {
            mattersData[p].excerpt = excerpt;
        }
    }
    const sortedPaths = [
        ...paths,
        ...additionalMattersData.map(p => ({ path: p.path, sortKey: p.sortKey})),
    ].sort((a, b) => a.sortKey.localeCompare(b.sortKey)).map(p => p.path);

    return {
        props: {
            frontmatter: data.data,
            body: data.content,
            excerpt: data.excerpt,
            path,
            sortedPaths,
            mattersData,
        },
    }
}

export async function getStaticPaths() {
    const { paths, fallback } = await getStaticData();
    const rawPaths = paths.map(p => p.path);
    return { paths: rawPaths, fallback };
}

export async function getStaticData() {
    const pathsRaw = ((context) => {
        const keys = context.keys();
        const data = keys.map((key, index) => {
            let slug = key.slice(1, -3);
            return slug + '/';
        })
        return data;
    })(require.context('./', true, /\.md$/));

    // Remove index from file name
    const paths = pathsRaw.map(p => {
        let match;
        let cleaned = p;
        while (match = /\/[0-9]*_/.exec(cleaned)) {
            cleaned = cleaned.replace(match, '/');
        }
        return { path: cleaned, sortKey: p };
    });

    const matters = (await Promise.all(pathsRaw
        .map(path => import(`.${path.slice(0, -1)}.md`))))
        .map(content => matter(content.default, { excerpt_separator: '<!-- excerpt-end -->' }))
        .reduce((acc, content, i) => {
            acc[paths[i].path] = content;
            return acc;
        }, {});

    const additionalMatters = Object.fromEntries(additionalMattersData.map(p => [p.path, { data: p, content: '', excerpt: '' }]));
    return {
        paths,
        matters: {...matters, ...additionalMatters},
        fallback: false,
    }
}
