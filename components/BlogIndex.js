import Markdown from "./Markdown";

export default function DocIndex ({ path, paths, mattersData }) {
    const entries = paths
        .filter(p => p.startsWith(path) && p !== path + '/')
        .map(p => p.slice(path.length + 1, p.length))
        .filter(p => (p.match(/\//g) || []).length === 1) // Only files directly under blog/
        .map(p => {
            const [_, year, month, day] = /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])-/.exec(p);
            return {
                path: p,
                date: `${new Date(`${month} ${day} ${year}`)
                    .toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
                title: mattersData[path + '/' + p].title,
                excerpt: mattersData[path + '/' + p].excerpt,
            };
        })
        .map(entry =>
            <a key={entry.path} href={entry.path} className={"blog-entry"}>
                <h3>{entry.title}</h3>
                <p className={"date"}>{entry.date}</p>
                <div className={"excerpt"}>
                    <Markdown body={entry.excerpt} />
                    <p className={"read-more"}>Read more...</p>
                </div>
            </a>
        );
    return (
        <div className="index">
            {entries}
        </div>
    );
}
