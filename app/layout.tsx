import './globals.css';
import './pages.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loomstone | Handcrafted & Bespoke Luxury Carpets',
  description: 'Bespoke handwoven and Axminster carpets made from natural wool, silk, and modern fibers for considered interiors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ash text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
