import type { Metadata } from 'next';
import NavBar from '../navigationBar';
import '../styles/styles.css';

export const metadata: Metadata = {
  title: 'Lottostat',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <NavBar />
        <main className="page">
          {children}
        </main>
      </body>
    </html>
  );
}
