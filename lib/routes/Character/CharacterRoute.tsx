import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import {
  CharactersContext,
  CharactersManagerMode,
} from "../../contexts/CharactersContext";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CharacterDialog } from "./components/CharacterDialog";

export const CharacterRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const { t } = useTranslate();
  const history = useHistory();
  const charactersManager = useContext(CharactersContext);

  useEffect(() => {
    const characterToLoad = charactersManager.state.characters.find(
      (s) => s.id === props.match.params.id
    );

    if (characterToLoad) {
      charactersManager.actions.select(characterToLoad);
    } else {
      history.replace("/");
      charactersManager.actions.openManager(CharactersManagerMode.Redirect);
    }
  }, [props.match.params.id]);

  return (
    <>
      <PageMeta
        title={t("characters-route.title")}
        description={t("characters-route.description")}
      />

      <Page>
        <CharacterDialog
          open={!!charactersManager.state.selectedCharacter}
          character={charactersManager.state.selectedCharacter}
          onSave={(newCharacter) => {
            charactersManager.actions.upsert(newCharacter);
          }}
          onClose={() => {
            history.replace("/");
            charactersManager.actions.close();
            charactersManager.actions.openManager(
              CharactersManagerMode.Redirect
            );
          }}
        />
      </Page>
    </>
  );
};

CharacterRoute.displayName = "CharacterRoute";
