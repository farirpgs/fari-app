import { Join } from "../../(components)/play";
import { t } from "../../../i18n";

export async function generateMetadata() {
  return {
    title: t("home-route.play-online.title"),
    description: t("home-route.play-online.description"),
  };
}

export default function PlayOnlinePage() {
  return <Join></Join>;
}
