import Highlight from 'react-highlight';
import ReactMarkdown from 'react-markdown';

export default function Markdown({body}) {
    return (
        <ReactMarkdown
            escapeHtml={false}
            source={body}
            renderers={{
                code: CodeBlock,
                inlineCode: CodeBlockInline,
                heading: Heading,
            }}
        />
    );
}

const CodeBlock = ({value, language}) => {
    return (
        <Highlight className={language}>
            {value}
        </Highlight>
    )
}

const CodeBlockInline = ({value, language}) => {
    return (
        <code>{value}</code>
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
