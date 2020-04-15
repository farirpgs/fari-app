import { useEffect, useState } from "react";
import { googleAnalyticsService } from "../../services/injections";

interface IPWAEvent {
  prompt: () => void;
  userChoice: Promise<{
    outcome: "accepted" | "";
  }>;
}

let shouldSuggestInstallationSingleton = false;
let pwaPromptSingleton: IPWAEvent = undefined;

export function usePWA(
  onInstall = () => undefined,
  onCancelInstall = () => undefined
) {
  const [shouldSuggestInstallation, setShouldSuggestInstallation] = useState(
    shouldSuggestInstallationSingleton
  );

  useEffect(() => {
    const beforeInstallPrompt = (event: any) => {
      pwaPromptSingleton = event;
      setShouldSuggestInstallation(true);
      shouldSuggestInstallationSingleton = true;
    };
    window.addEventListener("beforeinstallprompt", beforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPrompt);
    };
  }, []);

  const prompt = async () => {
    pwaPromptSingleton.prompt();
    const choiceResult = await pwaPromptSingleton.userChoice;
    if (choiceResult.outcome === "accepted") {
      onInstall();
      googleAnalyticsService.sendEvent({
        category: "Fari",
        action: "Install",
      });
    } else {
      onCancelInstall();
    }
  };

  return { shouldSuggestInstallation, prompt };
}
