import Highlight from 'react-highlight';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

export default function Markdown({body}) {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw/*, rehypeSanitize*/]}
            plugins={[gfm]}
            children={body}
            components={{
                code: CodeBlock,
                heading: Heading,
            }}
        />
    );
}

const CodeBlock = (ctx) => {
    if (ctx.inline) {
        return (
            <code>{ctx.children}</code>
        )
    }
    return (
        <Highlight className={ctx.className}>
            {ctx.children}
        </Highlight>
    )
}

const Heading = (props) => {
    const children = React.Children.toArray(props.children)
    const text = children.reduce(flatten, '')
    const slug = text.toLowerCase().replace(/\W/g, '-')
    return React.createElement('h' + props.level, {id: slug}, props.children)
}

function flatten(text, child) {
    return typeof child === 'string'
        ? text + child
        : React.Children.toArray(child.props.children).reduce(flatten, text)
}
