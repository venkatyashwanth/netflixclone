import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/navigation/Navigation';

export default async function LocaleLayout({ children, params }) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <>
      <NextIntlClientProvider>
        <Navigation />
        <main className="pageContent">
          {children}
        </main>
      </NextIntlClientProvider>
    </>
  )
}


