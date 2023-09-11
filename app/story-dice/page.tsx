import { StoryDiceRoute } from "../../lib/routes/StoryDice/StoryDiceRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("story-dice-route.title"),
    description: t("story-dice-route.description"),
  };
}

export default function () {
  return <StoryDiceRoute></StoryDiceRoute>;
}
