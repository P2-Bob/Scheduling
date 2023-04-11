import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { ProtectedPages } from './components/protectedPages'

export default function App({
  Component,
  pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ProtectedPages>
        <Component {...pageProps} />
      </ProtectedPages>
    </SessionProvider>
  )
}
