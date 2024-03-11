// import './globals.css'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Giigs App',
//   description: 'The #1 music booking app',
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }
import "./globals.css";
import Head from "next/head";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Giigs App",
  keywords:
    "music, booking, live shows, artists, gigs, concerts, music app, musicians, musicians app, music booking app, music booking, music booking platform, music booking software, music booking website, music booking app for musicians, music booking app for artists, music booking app for bands, music booking app for live shows, music booking app for concerts, music booking app for gigs, music booking app for events, music booking app for festivals, music booking app for venues, music booking app for promoters, music booking app for managers, music booking app for agents, music booking app for labels, music booking app for music industry, music booking app for music business, music booking app for music",
  description: "Giigs , the #1 music booking app",
  url: "https://www.giigsapp.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <link rel="canonical" href={metadata.url} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta
          name="twitter:image"
          content="https://www.giigsapp.com/default-sharing-image.jpg"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Your page description" />
        <meta name="keywords" content="your, keywords, here" />
        <link rel="canonical" href="https://www.giigsapp.com/page-url" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
