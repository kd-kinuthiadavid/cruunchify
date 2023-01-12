import '../styles/globals.css'
import type { AppProps } from "next/app";
import { useState } from "react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  // adapted from https://tanstack.com/query/v4/docs/guides/ssr
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
        {/* adapted from https://tanstack.com/query/v4/docs/devtools */}
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp
