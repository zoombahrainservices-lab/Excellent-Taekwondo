export default function sitemap() {
  const base = "https://example.com";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/programs`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ];
}



