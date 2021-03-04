import Box from "@material-ui/core/Box";
import { useTheme } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { DiceFab } from "../../components/DiceFab/DiceFab";
import { ManagerMode } from "../../components/Manager/Manager";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { ICharacter } from "../../domains/character/types";
import { IDiceRollResult, IDiceRollWithBonus } from "../../domains/dice/Dice";
import { useQuery } from "../../hooks/useQuery/useQuery";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CharacterV3Dialog } from "./components/CharacterV3Dialog";

export const CharacterRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
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

      <Box bgcolor={theme.palette.background.paper}>
        <Page>
          {dialogMode && (
            <DiceFab
              rolls={rolls}
              onSelect={(result) => {
                handleOnRoll(result);
              }}
            />
          )}
          <CharacterV3Dialog
            open={!!selectedCharacter}
            character={selectedCharacter}
            dialog={dialogMode || false}
            rolls={rolls}
            onRoll={(bonus) => {
              roll(bonus);
            }}
            onSave={(newCharacter) => {
              charactersManager.actions.upsert(newCharacter);
            }}
          />
        </Page>
      </Box>
    </>
  );
};

CharacterRoute.displayName = "CharacterRoute";
export default CharacterRoute;
