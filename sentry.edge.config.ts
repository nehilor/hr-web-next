import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://demo-dsn@sentry.io/demo-project',
  environment: process.env.NODE_ENV || 'development',

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Disable in development if no real DSN
  enabled: process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false,
});
