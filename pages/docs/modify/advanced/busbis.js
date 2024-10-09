// Placed in separate dir because the [slug].js file cannot change the path name of js files since nextjs places them themselves

import Head from '../../../../components/Head';
import Markdown from "../../../../components/Markdown";
import 'cross-fetch/polyfill';

export default function Busbis() {
  return (
    <div className="container-page">
      <Head
          title={'Buses and Actors Bis'}
          description={'Bus and actor communication in the Comunica framework bis'}
      />
      <main>
          <h1>Comunica Association Bounties</h1>
      </main>
    </div>
  )
}

export async function getStaticProps({ ...ctx }) {
    return { props: { } };
}

