import { PlayOfflineRoute } from "../../lib/routes/Play/PlayOfflineRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("home-route.play-offline.title"),
    description: t("home-route.play-offline.description"),
  };
}

export default function PlayOfflinePage() {
  return <PlayOfflineRoute></PlayOfflineRoute>;
}
