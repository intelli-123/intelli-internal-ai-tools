// app/layout.tsx

import '../styles/globals.css';
//import Header from '../components/Header';

export const metadata = {
  title: 'Intelli-Internal-AI- Tools',
  description: 'Internal AI tools hub',
  icons: {
    icon: '/favicon.ico', // This now points to public/favicon.ico
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
