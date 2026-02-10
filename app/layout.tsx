// app/layout.tsx
export const metadata = {
  title: 'Intelli-Internal-AI- Tools',
  description: 'Internal AI tools hub',
  icons: {
    icon: '/favicon.ico', // Explicitly points to public/favicon.ico
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
