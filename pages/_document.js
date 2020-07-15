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
                <Head/>
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
