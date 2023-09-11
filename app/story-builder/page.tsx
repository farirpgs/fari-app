import { StoryBuilderRoute } from "../../lib/routes/StoryBuilder/StoryBuilderRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("story-builder-route.title"),
    description: t("story-builder-route.description"),
  };
}

export default function StoryBuilderPage() {
  return <StoryBuilderRoute></StoryBuilderRoute>;
}
