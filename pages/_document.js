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
                    <link href="/pagefind/pagefind-component-ui.css" rel="stylesheet"/>
                </Head>
                <body>
                <Navigation />
                <div className="nav-pusher"/>
                <pagefind-modal reset-on-close=""></pagefind-modal>
                <Main />
                <Foot/>
                <NextScript />
                <script src="/pagefind/pagefind-component-ui.js" type="module"></script>
                </body>
            </Html>
        )
    }
}

export default MyDocument
