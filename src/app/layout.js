import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlareCursor from "@/components/FlareCursor";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
