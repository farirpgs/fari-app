import { DrawRoute } from "../../lib/routes/Draw/DrawRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("draw-route.meta.title"),
    description: t("draw-route.meta.description"),
  };
}

export default async function CharacterPage() {
  return <DrawRoute></DrawRoute>;
}
