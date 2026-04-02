import type { Metadata } from 'next';
import NavBar from '../navigationBar';
import '../styles/styles.css';

export const metadata: Metadata = {
  title: 'Lottostat',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()` }} />
      </head>
      <body>
        <NavBar />
        <main className="page">
          {children}
        </main>
      </body>
    </html>
  );
}
