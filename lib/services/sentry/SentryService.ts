import * as Sentry from "@sentry/browser";

export class SentryService {
  constructor() {
    if (location.host !== "localhost:1234") {
      Sentry.init({
        dsn: "https://94aa4f0e7f754d1e92a2fb12fd92be22@sentry.io/1856588"
      });
    }
  }
}
