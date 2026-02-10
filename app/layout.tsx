// app/layout.tsx

import '../styles/globals.css';
//import Header from '../components/Header';

export const metadata = {
  title: 'Intelli-Internal-AI- Tools',
  description: 'Internal AI tools hub',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
