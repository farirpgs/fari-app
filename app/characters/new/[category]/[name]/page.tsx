import { NewCharacterRoute } from "../../../../../lib/routes/NewCharacter/NewCharacterRoute";
import { t } from "../../../../i18n";

export async function generateMetadata() {
  return {
    title: t("new-character-route.meta.title"),
    description: t("new-character-route.meta.description"),
  };
}
// {template && (
//   <PageMeta
//     title={`Use the ${template?.fileName} character sheet template on Fari App`}
//     description={`Get started playing TTRPGs online with Fari App using this ${template?.fileName} template!`}
//   />
// )}

export default function NewCharacterPage() {
  return <NewCharacterRoute></NewCharacterRoute>;
}
