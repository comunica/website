import Head from "next/head";

export default ({ title }) => (
    <Head>
        <title>Comunica – {title}</title>
        <link rel="icon" href="/favicon.ico"/>
    </Head>
);
