import { CharacterTemplatesProvider } from "../../../lib/contexts/CharacterTemplatesContext/CharacterTemplatesContext";
import { CharacterRoute } from "../../../lib/routes/Character/CharacterRoute";
import { CharacterTemplateService } from "../../../lib/services/character-templates/CharacterTemplateService";
import { t } from "../../i18n";

export async function generateMetadata() {
  return {
    title: t("character-route.meta.title"),
    description: t("character-route.meta.description"),
  };
}

export default async function CharacterPage() {
  const templates = await CharacterTemplateService.getAll();
  return (
    <CharacterTemplatesProvider
      value={{
        templates: templates,
      }}
    >
      <CharacterRoute></CharacterRoute>;
    </CharacterTemplatesProvider>
  );
}
