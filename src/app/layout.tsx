import type { Metadata } from 'next';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Be Fish Wiki — Roblox Fish Stats, Odds & Guide',
    template: '%s — Be Fish Wiki',
  },
  description:
    'The complete Be Fish Roblox wiki. Browse all 60 fish, growth and speed stats, tier progression, boosts, passes, and tips for beginners and veterans.',
  metadataBase: new URL('https://befish.cc'),
  openGraph: {
    siteName: 'Be Fish Wiki',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
