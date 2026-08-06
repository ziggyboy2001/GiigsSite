import "./globals.css";

const SITE_URL = "https://giigsapp.com";
const OG_IMAGE = `${SITE_URL}/images/giigSplash.png`;

const DESCRIPTION =
  "Giigs is the real-time map of live music near you. See every concert and show happening right now, later tonight, tomorrow, or across the whole week, all on one live map. Filter by genre and distance, tap any pin for the artist, venue, set time, cover charge, and how far away it is, then get walking directions or grab tickets in a tap. Build a multi-stop bar crawl between live shows, check in at venues to redeem perks and happy-hour pricing, save shows, and invite friends. Live now in New Orleans and Atlanta with more cities being added. Free on iOS and Android.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Giigs: Find Live Music Near You Tonight",
    template: "%s · Giigs",
  },
  description: DESCRIPTION,
  applicationName: "Giigs",
  generator: "Next.js",
  category: "Music & Events",
  keywords: [
    "live music app",
    "find live music near me",
    "concerts tonight",
    "live music tonight",
    "local shows",
    "music discovery app",
    "bar crawl app",
    "New Orleans live music",
    "Atlanta live music",
    "concert finder",
    "what shows are happening tonight",
    "live music map",
    "book a musician",
    "venue booking app",
  ],
  authors: [{ name: "Giigs", url: SITE_URL }],
  creator: "Giigs",
  publisher: "Giigs Inc",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Giigs",
    title: "Giigs: Find Live Music Near You Tonight",
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Giigs, the real-time map of live music near you",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giigs: Find Live Music Near You Tonight",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/giigsVector916.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: "#08080c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Giigs",
      url: SITE_URL,
      logo: `${SITE_URL}/images/giigsVector916.png`,
      email: "cesar@getgiigs.com",
      description:
        "Giigs is a live music discovery platform connecting fans with local shows, venues, and artists.",
      sameAs: [
        "https://apps.apple.com/us/app/giigs/id6467974842",
        "https://play.google.com/store/apps/details?id=com.brentpurks.Gigs",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Giigs",
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "MobileApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Giigs",
      operatingSystem: "iOS, Android",
      applicationCategory: "MusicApplication",
      description: DESCRIPTION,
      url: SITE_URL,
      downloadUrl: [
        "https://apps.apple.com/us/app/giigs/id6467974842",
        "https://play.google.com/store/apps/details?id=com.brentpurks.Gigs",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Giigs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Giigs is a free mobile app that shows you live music happening near you in real time. Browse a live map of concerts and shows tonight, this week, or right now, filter by genre, follow venues and artists, build bar crawls, check in for perks, and grab tickets.",
          },
        },
        {
          "@type": "Question",
          name: "How do I find live music near me tonight?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Open Giigs and the live map shows every nearby show happening tonight and right now. Tap a pin to see the artist, venue, set time, cover, and distance, then get directions or tickets in a tap.",
          },
        },
        {
          "@type": "Question",
          name: "Which cities does Giigs cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Giigs is live in New Orleans and Atlanta with more cities being added. Real venues, real shows, updated in real time.",
          },
        },
        {
          "@type": "Question",
          name: "Is Giigs free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Giigs is free to download on iOS and Android, and free for fans to discover shows.",
          },
        },
        {
          "@type": "Question",
          name: "Can venues and event planners book musicians on Giigs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Venues, event planners, and private hosts can discover and book musicians using verified profiles, reviews, Giigs Ratings, and live audio and video. Each artist profile includes data like average draw, confidence score, expected crowd, and genre match, and you can book for live music, private events, corporate events, weddings, meetings, and more directly in the app.",
          },
        },
        {
          "@type": "Question",
          name: "What is a Giigs bar crawl?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A bar crawl is a route Giigs builds between multiple live shows in one night. It includes the stops, turn-by-turn walking directions, walk times between venues, perks at each stop, and a live pin so you always know where the next set is.",
          },
        },
        {
          "@type": "Question",
          name: "How do check-ins and perks work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "When you arrive at a venue you can check in inside Giigs to redeem perks such as happy-hour pricing. Your perks follow you through the night, and you can also save shows, view your history, and invite friends.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
