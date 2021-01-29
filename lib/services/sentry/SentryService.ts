import * as Sentry from "@sentry/react";
import { Severity } from "@sentry/react";
import { env } from "../../constants/env";

export class SentryService {
  constructor() {
    if (!env.isTest && !env.isLocalHost) {
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
    if (env.isTest || env.isLocalhost) {
      return;
    }

    Sentry.captureMessage(message, { level: severity, extra: context });
  }
}
