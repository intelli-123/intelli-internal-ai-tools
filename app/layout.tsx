// app/layout.tsx
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
