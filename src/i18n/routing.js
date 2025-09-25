import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hi', 'te'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',                    // Root stays the same
    '/pathnames': {
      te: '/పథనామాలు',          // Telugu translation of "pathnames"
      hi: '/पथनाम'              // Hindi translation of "pathnames"
    }
  }
});