import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { DiceFab } from "../../components/DiceFab/DiceFab";
import { ManagerMode } from "../../components/Manager/Manager";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import {
  CharactersContext,
  ICharacter,
} from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { IDiceRollResult, IDiceRollWithBonus } from "../../domains/dice/Dice";
import { useQuery } from "../../hooks/useQuery/useQuery";
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
  const [rolls, setRolls] = useState<Array<IDiceRollWithBonus>>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<
    ICharacter | undefined
  >(undefined);
  const logger = useLogger();

  function handleOnRoll(result: IDiceRollResult) {
    setRolls((draft) => {
      return [result, ...draft];
    });
  }

  useEffect(() => {
    logger.info("Route:Character");
  }, []);

  useEffect(() => {
    const characterToLoad = charactersManager.state.characters.find(
      (s) => s.id === props.match.params.id
    );

    if (characterToLoad) {
      setSelectedCharacter(characterToLoad);
    } else {
      history.replace("/");
      charactersManager.actions.openManager(ManagerMode.Manage);
    }
  }, [props.match.params.id, charactersManager.state.characters]);

  const query = useQuery<"dialog">();
  const dialogMode = query.get("dialog") === "true";
  return (
    <>
      <PageMeta
        title={selectedCharacter?.name || t("characters-route.title")}
        description={t("characters-route.description")}
      />

      <Page>
        {dialogMode && (
          <DiceFab
            rolls={rolls}
            onSelect={(result) => {
              handleOnRoll(result);
            }}
          />
        )}
        <CharacterDialog
          open={!!selectedCharacter}
          character={selectedCharacter}
          dialog={dialogMode || false}
          rolls={rolls}
          onRoll={(result) => {
            handleOnRoll(result);
          }}
          onSave={(newCharacter) => {
            charactersManager.actions.upsert(newCharacter);
          }}
        />
      </Page>
    </>
  );
};

CharacterRoute.displayName = "CharacterRoute";
export default CharacterRoute;
