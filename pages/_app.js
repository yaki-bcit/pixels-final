import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <title>
            Pixels
          </title>
          <link rel="icon" href="/app-icon.png" />
        </Head>

        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp
