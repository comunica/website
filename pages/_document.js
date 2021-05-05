import Document, { Html, Head, Main, NextScript } from 'next/document'
import Navigation from "../components/Navigation";
import Foot from "../components/Foot";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <body>
                <Navigation />
                <div className="nav-pusher"/>
                <Main />
                <Foot/>
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
