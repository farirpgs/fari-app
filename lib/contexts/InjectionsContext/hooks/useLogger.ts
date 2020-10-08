import { Severity } from "@sentry/react";
import { useContext } from "react";
import { InjectionsContext } from "../InjectionsContext";

export function useLogger() {
  const { sentryService } = useContext(InjectionsContext);

  function debug(message: string, context?: any) {
    sentryService.log(message, Severity.Debug, context);
  }

  function info(message: string, context?: any) {
    sentryService.log(message, Severity.Info, context);
  }
  function warn(message: string, context?: any) {
    sentryService.log(message, Severity.Warning, context);
  }
  function error(message: string, context?: any) {
    sentryService.log(message, Severity.Error, context);
  }

  return {
    info,
    debug,
    warn,
    error,
  };
}
