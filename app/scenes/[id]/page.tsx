import { SceneRoute } from "../../../lib/routes/Scene/SceneRoute";
import { t } from "../../i18n";

export const dynamicParams = true;

export async function generateMetadata() {
  return {
    title: t("scene-route.meta.title"),
    description: t("scene-route.meta.description"),
  };
}

export default function ScenePage() {
  return <SceneRoute></SceneRoute>;
}
