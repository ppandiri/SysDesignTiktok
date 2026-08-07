import React from "react";

export const metadata = {
  title: "SystemFeed — Master System Design",
  description: "A TikTok-style vertical swipe feed for learning system design concepts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
