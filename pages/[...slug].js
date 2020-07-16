import Head from '../components/Head';
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import Highlight from 'react-highlight';

export default function Page({ frontmatter, body }) {
  return (
    <div className="container-page">
      <Head title={frontmatter.title}/>
      <main>
        <h1>{frontmatter.title}</h1>
        <hr />
        <ReactMarkdown
            source={body}
            renderers={{
                code: CodeBlock,
                inlineCode: CodeBlockInline
            }}
        />
      </main>
    </div>
  )
}

export async function getStaticProps({ ...ctx }) {
    const { slug } = ctx.params;

    const content = await import(`./${slug.join('/')}.md`);
    const data = matter(content.default);

    return {
        props: {
            frontmatter: data.data,
            body: data.content,
        },
    }
}

export async function getStaticPaths() {
    const paths = ((context) => {
        const keys = context.keys();
        const data = keys.map((key, index) => {
            let slug = key.slice(1, -3);
            return slug;
        })
        return data;
    })(require.context('./', true, /\.md$/));

    return {
        paths,
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
