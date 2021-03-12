import Box from "@material-ui/core/Box";
import { useTheme } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { DiceFab, DiceFabMode } from "../../components/DiceFab/DiceFab";
import { ManagerMode } from "../../components/Manager/Manager";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import {
  useRollDice,
  useRollDiceWithCommands,
} from "../../contexts/DiceContext/DiceContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { ICharacter } from "../../domains/character/types";
import {
  IDiceCommandNames,
  IDiceRollWithBonus,
  IRollDiceOptions,
} from "../../domains/dice/Dice";
import { useDicePool } from "../../hooks/useDicePool/useDicePool";
import { useQuery } from "../../hooks/useQuery/useQuery";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CharacterV3Dialog } from "./components/CharacterDialog/CharacterV3Dialog";
import { IDicePoolElement } from "./components/CharacterDialog/components/blocks/BlockDicePool";

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
  const poolManager = useDicePool();
  const [selectedCharacter, setSelectedCharacter] = useState<
    ICharacter | undefined
  >(undefined);
  const logger = useLogger();

  function handleOnNewRoll(result: IDiceRollWithBonus) {
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

  const rollDice = useRollDice();
  const rollWithCommands = useRollDiceWithCommands();

  const query = useQuery<"dialog">();
  const dialogMode = query.get("dialog") === "true";

  function handleOnSkillClick(
    options: IRollDiceOptions,
    commands: IDiceCommandNames[] | undefined
  ): void {
    if (commands) {
      const result = rollWithCommands(options, commands);
      handleOnNewRoll(result);
    } else {
      const result = rollDice(options);
      handleOnNewRoll(result);
    }
  }

  function handleOnClearPool() {
    poolManager.actions.clearPool();
  }

  function handleOnRollPool() {
    const result = poolManager.actions.getPoolResult();
    handleOnNewRoll(result);
  }

  function handleOnPoolClick(element: IDicePoolElement) {
    poolManager.actions.addOrRemovePoolElement(element);
  }

  return (
    <>
      <PageMeta
        title={selectedCharacter?.name || t("characters-route.title")}
        description={t("characters-route.description")}
      />

      <Box bgcolor={theme.palette.background.paper}>
        <Page>
          {!dialogMode && (
            <DiceFab
              type={DiceFabMode.RollAndPool}
              rollsForDiceBox={rolls}
              pool={poolManager.state.pool}
              onClearPool={handleOnClearPool}
              onRollPool={handleOnRollPool}
              onSelect={handleOnNewRoll}
            />
          )}
          <CharacterV3Dialog
            open={!!selectedCharacter}
            character={selectedCharacter}
            dialog={dialogMode || false}
            pool={poolManager.state.pool}
            rolls={rolls}
            onSkillClick={handleOnSkillClick}
            onPoolClick={handleOnPoolClick}
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
