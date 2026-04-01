import type { AppProps } from 'next/app';
import NavBar from '../navigationBar';
import '../styles/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar />
      <main className="page">
        <Component {...pageProps} />
      </main>
    </>
  );
}
