import type { AppProps } from 'next/app';
import NavBar from '../navigationBar';
import '../styles/styles.css';
import '../styles/button-17.css';
import '../styles/slider.css';
import '../styles/lotto.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar />
      <div>
        <Component {...pageProps} />
      </div>
    </>
  );
}
