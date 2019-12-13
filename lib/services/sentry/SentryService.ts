import * as Sentry from "@sentry/browser";

function initializeSentry() {
  Sentry.init({
    dsn: "https://94aa4f0e7f754d1e92a2fb12fd92be22@sentry.io/1856588"
  });
}

export const SentryService = { initializeSentry };
