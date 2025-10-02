import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/navigation/Navigation';
import { AuthProvider } from "@/components/contexts/Authcontext";
import AppContainer from "../../components/AppContainer";

export default async function LocaleLayout({ children, params }) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <NextIntlClientProvider>
          <AuthProvider>
            <AppContainer>
              <Navigation />
              <main>
                {children}
              </main>
            </AppContainer>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}