import { NewCharacterRoute } from "../../../../../lib/routes/NewCharacter/NewCharacterRoute";
import { t } from "../../../../i18n";

export async function generateMetadata() {
  return {
    title: t("new-character-route.meta.title"),
    description: t("new-character-route.meta.description"),
  };
}

export default function NewCharacterPage() {
  return <NewCharacterRoute></NewCharacterRoute>;
}
