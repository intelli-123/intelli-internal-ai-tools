// app/(settings)/internalaitools/settings/layout.tsx
import '../../../../styles/globals.css';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  // Intentionally no header here
  return <main className="container">{children}</main>;
}