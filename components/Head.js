import Head from "next/head";

export default ({ title, description }) => (
    <Head>
        <title>Comunica – {title}</title>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="foaf:primaryTopic" href="/#software" />
        <link rel="foaf:maker" href="https://www.rubensworks.net/#me" />
        <meta property="og:image" content="/img/comunica_red.svg" />
        <meta property="og:title" content={`Comunica – ${title}`} />
        <meta property="og:description" content={`${description}`} />
        <meta property="og:url" content="/" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={`Comunica – ${title}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Comunica – ${title}`} />
        <meta name="twitter:description" content={`${description}`} />
        <meta name="twitter:image" content="/img/comunica_red.svg" />
    </Head>
);
