import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { AppContextProvider } from "@/contexts/app";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";
import StructuredData from "@/components/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://freeqwenimage.com";
  const title = t("metadata.title") || "Free Qwen Image - AI Image Generator";
  const description = t("metadata.description") || "Free Qwen Image is a powerful AI image generator based on Qwen model.";

  return {
    title: {
      template: `%s`,
      default: title,
    },
    description: description,
    keywords: t("metadata.keywords") || "free qwen image, qwen image, ai image generator",
    authors: [{ name: "Free Qwen Image" }],
    creator: "Free Qwen Image",
    publisher: "Free Qwen Image",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: "website",
      locale: locale,
      url: siteUrl,
      title: title,
      description: description,
      siteName: "Free Qwen Image",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Free Qwen Image - AI Image Generator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@freeqwenimage",
      creator: "@freeqwenimage",
      title: title,
      description: description,
      images: [`${siteUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <NextAuthSessionProvider>
        <AppContextProvider>
          <ThemeProvider>
            <StructuredData type="website" locale={locale} />
            {children}
          </ThemeProvider>
        </AppContextProvider>
      </NextAuthSessionProvider>
    </NextIntlClientProvider>
  );
}
