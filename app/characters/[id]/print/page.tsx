import { CharacterPrintRoute } from "../../../../lib/routes/CharacterPrint/CharacterPrintRoute";
import { t } from "../../../i18n";

export async function generateMetadata() {
  return {
    title: t("character-print-route.meta.title"),
    description: t("character-print-route.meta.description"),
  };
}

export default function CharacterPrintPage() {
  return <CharacterPrintRoute></CharacterPrintRoute>;
}
