import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MicroPost - Share Your Thoughts',
  description: 'A micro-posting platform to share your thoughts with the world',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout just passes through to the [locale] layout
  // The [locale]/layout.tsx handles the actual HTML structure
  return children;
}
