export default function DocIndex ({ path, paths, mattersData, reverse }) {
    let entries = paths
        .filter(p => p.startsWith(path) && p !== path + '/')
        .map(p => p.slice(path.length + 1, p.length))
        .filter(p => (p.match(/\//g) || []).length <= 2) // Max depth
        .map(p => ({
            path: p,
            title: mattersData[path + '/' + p].title,
            description: mattersData[path + '/' + p].description,
            indent: (p.match(/\//g) || []).length - 1,
        }))
        .map(entry =>
            <a key={entry.path} href={entry.path} className={"index-entry indent-" + entry.indent}>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
            </a>
        );
    if (reverse) {
        entries = entries.reverse();
    }
    return (
        <div className="index">
            {entries}
        </div>
    );
}
