import Highlight from 'react-highlight';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import dynamic from 'next/dynamic';

// Only loaded on pages that contain a <centralized-performance> element, with its closing tag on the next line.
const CentralizedPerformance = dynamic(() => import('./CentralizedPerformance'), {
    ssr: false,
    loading: () => <p className="perf-status">Loading the results…</p>,
});

export default function Markdown({body}) {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw/*, rehypeSanitize*/]}
            plugins={[gfm]}
            children={body}
            components={{
                code: CodeBlock,
                table: Table,
                h1: Heading,
                h2: Heading,
                h3: Heading,
                h4: Heading,
                h5: Heading,
                h6: Heading,
                'centralized-performance': CentralizedPerformance,
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

const Table = ({node, ...props}) => (
    <div className="table-wrapper">
        <table {...props}/>
    </div>
)

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
