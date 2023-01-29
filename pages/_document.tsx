import Document, {
  Head,
  Html,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

export default class MyDocument extends Document {
  //   static async getInitialProps(ctx: DocumentContext) {
  //     const originalRenderPage = ctx.renderPage;

  //     try {
  //       ctx.renderPage = () =>
  //         originalRenderPage({
  //           enhanceApp: (App) => (props) =>
  //             sheet.collectStyles(<App {...props} />),
  //         });

  //       const initialProps = await Document.getInitialProps(ctx);
  //       return {
  //         ...initialProps,
  //         styles: (
  //           <>
  //             {initialProps.styles}
  //             {sheet.getStyleElement()}
  //           </>
  //         ),
  //       };
  //     } finally {
  //       sheet.seal();
  //     }
  //   }
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="font-sans h-screen">
          <Main />
          <NextScript />
          <script
            src="https://kit.fontawesome.com/26eccec266.js"
            crossOrigin="anonymous"
          ></script>
        </body>
      </Html>
    );
  }
}
