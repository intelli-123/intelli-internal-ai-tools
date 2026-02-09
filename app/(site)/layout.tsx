// app/(site)/layout.tsx
import '../../styles/globals.css';
import Header from '../../components/Header';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container">{children}</main>
    </>
  );
}