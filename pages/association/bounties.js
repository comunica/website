import Head from '../../components/Head';
import 'cross-fetch/polyfill';

export default function Page({ githubData }) {
  const entries = githubData.data.search.nodes
      .map(node => <div className="card-bounty" id={node.url}>
          <a href={node.repository.url} target="_blank"><h3>{node.repository.nameWithOwner}</h3></a>
          <a href={node.url} target="_blank"><h2>{node.title} <span className="issue-id">#{node.number}</span></h2></a>
          <div className="issue-metadata">
              {node.assignees.totalCount > 0
                  ? <div className="issue-bounty-claimed">🔒 Claimed</div>
                  : <a href={`mailto:ruben.taelman@ugent.be?subject=I want to claim a bounty&body=In am interested in claiming ${node.url}, please tell me more!`}><div className="issue-bounty-unclaimed">🖐️ I want to work on this</div></a>}
              Created <span>{new Date(node.createdAt)
              .toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>);
    //<hr />
    //<div className="issue-body" dangerouslySetInnerHTML={{__html: node.bodyHTML}} />

  return (
    <div className="container-page">
      <Head
          title={'Comunica Association Bounties'}
          description={'Bounties that have been placed on issues'}
      />
      <main>
          <h1>Comunica Association Bounties</h1>
          <hr/>
          <p>
              This page lists all issues on which a bounty has been placed
              at the <a href="/association/">Comunica Association</a>.
          </p>
          <p>
              As a <strong>developer</strong>, express your interest to work on any issue,
              after which we can discuss the details.
          </p>
          <p>
              As an <strong>organization</strong>, you can <a href="mailto:ruben.taelman@ugent.be?subject=I want to place a bounty">mail us</a> to add additional bounties regarding Comunica-related projects.
          </p>
          <div className="grid-wide">
              {entries}
          </div>
      </main>
    </div>
  )
}

export async function getStaticProps({ ...ctx }) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(`The GitHub API token environment variable 'GITHUB_TOKEN' has not been set.`);
  }
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        query {
          search(type: ISSUE, query: "label:comunica-association-bounty state:open", first: 100) {
            nodes {
              ... on Issue {
                title
                url
                number
                repository {
                  name
                  nameWithOwner
                  url
                  description
                }
                assignees {
                  totalCount
                }
                bodyHTML
                createdAt
              }
            }
          }
        }
      `,
      variables: {
        now: new Date().toISOString(),
      },
    }),
  });
  if (!response.ok) {
    throw new Error('Invalid GitHub API response.')
  }
  const githubData = await response.json();
  return { props: { githubData } };
}
