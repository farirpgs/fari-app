import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Toolbox } from "../../components/Toolbox/Toolbox";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ICharacter } from "../../domains/character/types";
import { IDiceRollResult } from "../../domains/dice/Dice";
import { useQuery } from "../../hooks/useQuery/useQuery";
import { CharacterV3Dialog } from "./components/CharacterDialog/CharacterV3Dialog";

export const CharacterRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const theme = useTheme();
  const history = useHistory();
  const charactersManager = useContext(CharactersContext);
  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const diceManager = useContext(DiceContext);
  const myBinderManager = useContext(MyBinderContext);
  const [selectedCharacter, setSelectedCharacter] = useState<
    ICharacter | undefined
  >(undefined);
  const logger = useLogger();

  function handleSetRollResult(result: IDiceRollResult) {
    setRolls((draft) => {
      return [result, ...draft];
    });
  }

  useEffect(() => {
    logger.track("character.view");
  }, []);

  useEffect(() => {
    const characterToLoad = charactersManager.state.characters.find(
      (s) => s.id === props.match.params.id
    );

    if (characterToLoad) {
      setSelectedCharacter(characterToLoad);
    } else {
      history.replace("/");
      myBinderManager.actions.open({ folder: "characters" });
    }
  }, [props.match.params.id, charactersManager.state.characters]);

  const query = useQuery<"dialog" | "readonly">();
  const dialogMode = query.get("dialog") === "true";
  const readonly = query.get("readonly") === "true";

  function handleOnRollPool() {
    const { result } = diceManager.actions.getPoolResult();
    handleSetRollResult(result);
  }

  return (
    <>
      <PageMeta title={selectedCharacter?.name} />

      <Box bgcolor={theme.palette.background.paper}>
        <Page pb="6rem">
          {!dialogMode && (
            <Toolbox
              dice={{
                onRoll: handleSetRollResult,
                rollsForDiceBox: rolls,
                onRollPool: handleOnRollPool,
              }}
            />
          )}
          <CharacterV3Dialog
            open={!!selectedCharacter}
            character={selectedCharacter}
            dialog={dialogMode || false}
            readonly={readonly}
            onRoll={handleSetRollResult}
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
