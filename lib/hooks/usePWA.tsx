import { useEffect, useRef, useState } from "react";

interface IPWAEvent {
  prompt: () => void;
  userChoice: Promise<{
    outcome: "accepted" | "";
  }>;
}

export function usePWA(
  onInstall = () => undefined,
  onCancelInstall = () => undefined
) {
  const pwaPrompt = useRef<IPWAEvent>(undefined);
  const [shouldSuggestInstallation, setShouldSuggestInstallation] = useState(
    false
  );
  useEffect(() => {
    const beforeInstallPrompt = (event: any) => {
      pwaPrompt.current = event;
      setShouldSuggestInstallation(true);
    };
    window.addEventListener("beforeinstallprompt", beforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPrompt);
    };
  }, []);
  const prompt = async () => {
    pwaPrompt.current.prompt();
    const choiceResult = await pwaPrompt.current.userChoice;
    if (choiceResult.outcome === "accepted") {
      onInstall();
    } else {
      onCancelInstall();
    }
  };
  return { shouldSuggestInstallation, prompt };
}
