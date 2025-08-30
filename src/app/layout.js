import "./globals.css";
import { Inter, Oswald } from 'next/font/google';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlareCursor from "@/components/FlareCursor";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({ 
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata = {
  title: {
    default: "Excellent Taekwondo | Discipline • Confidence • Fitness",
    template: "%s | Excellent Taekwondo",
  },
  description:
    "Build discipline, confidence, and fitness at Excellent Taekwondo. Book a free trial class today!",
  openGraph: {
    title: "Excellent Taekwondo",
    description:
      "Build discipline, confidence, and fitness at Excellent Taekwondo. Book a free trial class today!",
    url: "https://example.com",
    siteName: "Excellent Taekwondo",
    images: [
      {
        url: "/images/enroll-now.jpg",
        width: 1080,
        height: 1080,
        alt: "Enroll now promotional poster",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased bg-gradient-to-br from-background via-surface/5 to-accent/5">
        <FlareCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
