import Head from '../components/Head';
import matter from 'gray-matter'
import DocIndex from "../components/DocIndex";
import BlogIndex from "../components/BlogIndex";
import BreadCrumbs from "../components/Breadcrumbs";
import Markdown from "../components/Markdown";
import React from 'react';

export default class Page extends React.Component {
    render() {
        const { frontmatter, body, path, paths, mattersData, excerpt } = this.props;
        let dateString = '';
        if (path.startsWith('/blog/')) {
            const [_, year, month, day] = /^\/blog\/([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])-/.exec(path);
            const date = new Date(`${month} ${day} ${year}`)
                .toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            dateString = <p className={"date"}>{date}</p>;
        }
        return (
            <div className="container-page">
                <Head title={frontmatter.title} description={excerpt || frontmatter.description}/>
                <main>
                    <BreadCrumbs frontmatter={frontmatter} path={path} paths={paths} mattersData={mattersData}/>
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
                    {frontmatter.index && <DocIndex path={path} paths={paths} mattersData={mattersData}/>}
                    {frontmatter.blog_index && <BlogIndex path={path} paths={paths} mattersData={mattersData}/>}
                </main>
            </div>
        )
    }

    componentDidMount() {
        // Get index container
        const index = document.querySelector('.headers-overview-elements');

        // Find all headers
        const container = document.querySelector('.container-page');
        const headers = container.querySelectorAll('h2');
        for (const header of headers) {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.textContent = header.innerText;
            anchor.setAttribute('href', '#' + header.id);
            anchor.setAttribute('class', 'headers-overview-element');
            listItem.appendChild(anchor);
            index.appendChild(listItem);
        }

        // Only show overview node if we have at least one header
        if (headers.length > 0) {
            index.parentNode.style.display = 'block';
        }

        // Show headers as active based on scroll status
        window.addEventListener('load', updateIndex);
        window.addEventListener('scroll', updateIndex);
        function updateIndex(){
            // Unselect all other entries
            const entries = document.querySelectorAll('a.headers-overview-element');
            for (let i = 0; i < entries.length; i++) {
                entries[i].classList.remove('headers-overview-element-active');
            }

            // Select the hovered entry
            const header = getActiveHeader();
            if (header) {
                let match = index.querySelector('a[href="#' + header.id + '"]');
                if (match) {
                    match.classList.add('headers-overview-element-active');
                }
            }
        }
        // Get the first header section that is visible
        function getActiveHeader() {
            let lastHiddenHeader;
            for (const header of headers) {
                if (header.id) {
                    if (header.getBoundingClientRect().top <= 70) { // Offset to account for fixed header
                        lastHiddenHeader = header;
                    } else {
                        return lastHiddenHeader;
                    }
                }
            }
            return lastHiddenHeader;
        }
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

    return {
        props: {
            frontmatter: data.data,
            body: data.content,
            excerpt: data.excerpt,
            path,
            paths,
            mattersData,
        },
    }
}

export async function getStaticPaths() {
    const { paths, fallback } = await getStaticData();
    return { paths, fallback };
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
        while (match = /\/[0-9]*_/.exec(p)) {
            p = p.replace(match, '/');
        }
        return p;
    });

    const matters = (await Promise.all(pathsRaw
        .map(path => import(`.${path.slice(0, -1)}.md`))))
        .map(content => matter(content.default, { excerpt_separator: '<!-- excerpt-end -->' }))
        .reduce((acc, content, i) => {
            acc[paths[i]] = content;
            return acc;
        }, {});

    return {
        paths,
        matters,
        fallback: false,
    }
}
