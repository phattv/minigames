import type { Metadata } from "next";
import { Momo_Signature, Momo_Trust_Sans } from "next/font/google";
import "./globals.css";

const momoSignature = Momo_Signature({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-heading",
});

const momoTrustSans = Momo_Trust_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Mini Games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.style.fontSize = localStorage.getItem("fontSize") || "125%"` }} />
      </head>
      <body className={`${momoTrustSans.variable} ${momoSignature.variable} font-[family-name:var(--font-body)]`}>
        {children}
      </body>
    </html>
  );
}
