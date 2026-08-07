import React from "react";

export const metadata = {
  title: "SystemFeed — Learn System Design",
  description: "A swipeable, adaptive feed for learning system design — starts with your weak spots.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta name="theme-color" content="#0a0e14" />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='6' fill='%230a0e14'/%3E%3Cg fill='%2352e3c2'%3E%3Crect x='4' y='14' width='3' height='6' rx='1'/%3E%3Crect x='9' y='10' width='3' height='10' rx='1'/%3E%3Crect x='14' y='6' width='3' height='14' rx='1'/%3E%3Crect x='19' y='3' width='2' height='17' rx='1' opacity='0.5'/%3E%3C/g%3E%3C/svg%3E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/style.css?v=1.0.3" />
      </head>
      <body>
        {children}
        <script src="/js/data.js?v=1.0.3" defer />
        <script src="/js/storage.js?v=1.0.3" defer />
        <script src="/js/algorithm.js?v=1.0.3" defer />
        <script src="/js/diagrams.js?v=1.0.3" defer />
        <script src="/js/app.js?v=1.0.3" defer />
      </body>
    </html>
  );
}
