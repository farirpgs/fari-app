import { DiceRoute } from "../../lib/routes/DiceRoute/DiceRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("dice-route.meta.title"),
    description: t("dice-route.meta.description"),
  };
}

export default function DicePage() {
  return <DiceRoute></DiceRoute>;
}
