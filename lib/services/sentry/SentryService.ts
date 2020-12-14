import * as Sentry from "@sentry/react";
import { Severity } from "@sentry/react";
import { env } from "../../constants/env";

const isLocalhost = env.context === "localhost";
const isTests = process.env.JEST_WORKER_ID !== undefined;

export class SentryService {
  constructor() {
    if (!isTests && !isLocalhost) {
      Sentry.init({
        release: `fari@v${env.version}`,
        environment: env.context,
        dsn: "https://94aa4f0e7f754d1e92a2fb12fd92be22@sentry.io/1856588",
      });
    }
  }
  public log(
    message: string,
    severity: Severity,
    context: { [key: string]: any } | undefined
  ) {
    if (isTests || isLocalhost) {
      return;
    }

    Sentry.captureMessage(message, { level: severity, extra: context });
  }
}
