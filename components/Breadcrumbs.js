export default function BreadCrumbs ({ frontmatter, path, paths, mattersData }) {
    const entries = paths
        .filter(p => path.startsWith(p))
        .map(p => ({
            path: p,
            title: mattersData[p].title,
        }))
        .map(entry => <li key={entry.path}><a href={entry.path}>{entry.title}</a></li>);
    if (entries.length > 0) {
        entries.push(<li key={"_"}>{frontmatter.title}</li>);
    }
    return (
        <ul className="breadcrumbs">
            {entries}
        </ul>
    );
}
