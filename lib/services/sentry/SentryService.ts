import * as Sentry from "@sentry/react";
import { Severity } from "@sentry/react";
import { env } from "../../constants/env";

const shouldLog =
  !env.isTest && !env.isDev && location.hostname !== "localhost";

export function makeSentryService() {
  if (shouldLog) {
    Sentry.init({
      release: `fari@v${env.version}`,
      environment: env.context as string,
      dsn: "https://94aa4f0e7f754d1e92a2fb12fd92be22@sentry.io/1856588",
    });
  }

  return {
    log(
      message: string,
      severity: Severity,
      context: { [key: string]: any } | undefined
    ) {
      if (!shouldLog) {
        return;
      }

      Sentry.captureMessage(message, { level: severity, ...context });
    },
    setTag: Sentry.setTag,
  };
}
