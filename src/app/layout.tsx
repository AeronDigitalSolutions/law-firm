import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCM Associates | Advocates, Legal Consultants & Corporate Advisors",
  description:
    "Premium portfolio website for SCM Associates, showcasing legal counsel, disputes, corporate advisory, and client-first representation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
