import { CharacterRoute } from "../../../lib/routes/Character/CharacterRoute";
import { t } from "../../i18n";

export async function generateMetadata() {
  return {
    title: t("character-route.meta.title"),
    description: t("character-route.meta.description"),
  };
}

export default function CharacterPage() {
  return <CharacterRoute></CharacterRoute>;
}
