import * as Sentry from "@sentry/browser";
import { env } from "../injections";

export class SentryService {
  constructor() {
    if (process.env.JEST_WORKER_ID !== undefined) {
      return;
    }

    if (location.host !== "localhost:1234") {
      Sentry.init({
        release: `fari@${env.hash}`,
        environment: env.context,
        dsn: "https://94aa4f0e7f754d1e92a2fb12fd92be22@sentry.io/1856588"
      });
    }
  }
}
