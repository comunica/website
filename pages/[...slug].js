import Head from '../components/Head';
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import Highlight from 'react-highlight';
import DocIndex from "../components/DocIndex";

export default function Page({ frontmatter, body, path, paths, mattersData }) {
  return (
    <div className="container-page">
      <Head title={frontmatter.title}/>
      <main>
        <h1>{frontmatter.title}</h1>
        <hr />
        <ReactMarkdown
            escapeHtml={false}
            source={body}
            renderers={{
                code: CodeBlock,
                inlineCode: CodeBlockInline,
            }}
        />
        {frontmatter.index && <DocIndex path={path} paths={paths} mattersData={mattersData}/>}
      </main>
    </div>
  )
}

export async function getStaticProps({ ...ctx }) {
    const { slug } = ctx.params;
    const { paths, matters } = await getStaticData();
    const path = '/' + slug.join('/');
    const data = matters[path + '/'];
    const mattersData = {};
    for (const p in matters) {
        mattersData[p] = matters[p].data;
    }

    return {
        props: {
            frontmatter: data.data,
            body: data.content,
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
        .map(content => matter(content.default))
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

const CodeBlock = ({ value, language }) => {
    return (
        <div>
            <Highlight className={language}>
                {value}
            </Highlight>
            <br />
        </div>
    )
}

const CodeBlockInline = ({ value, language }) => {
    return (
        <code>{value}</code>
    )
}
