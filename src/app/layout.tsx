import Logo from "@/components/ui/logo";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import { FooterComponent } from "@/components/FooterComponent";
import { en } from "@/lib/i18n/en";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: en.siteTitle,
  description: en.siteDescription,
  openGraph: {
    images: "https://smartimgs.com/og.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
      </head>
      <body
        className={`${font.variable} flex min-h-full flex-col bg-gray-100 font-[family-name:var(--font-plus-jakarta-sans)] text-gray-900 antialiased`}
      >
        <LanguageProvider>
          <header className="py-6 text-center">
            <Link href="/" className="inline-flex justify-center">
              <Logo />
            </Link>
          </header>

          <main className="grow overflow-hidden">{children}</main>
          <Toaster />
          <FooterComponent />
        </LanguageProvider>
      </body>
    </html>
  );
}
