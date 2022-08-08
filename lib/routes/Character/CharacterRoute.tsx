import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Toolbox } from "../../components/Toolbox/Toolbox";
import { useZIndex } from "../../constants/zIndex";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ICharacter } from "../../domains/character/types";
import { IDicePoolResult } from "../../domains/dice/Dice";
import { useEvent } from "../../hooks/useEvent/useEvent";
import { useQuery } from "../../hooks/useQuery/useQuery";
import { DiceResult } from "../DiceRoute/components/DiceResult";
import { CharacterV3Dialog } from "./components/CharacterDialog/CharacterV3Dialog";

const HIDE_RESULTS_DELAY = 5000;

function CharacterRoute() {
  const zIndex = useZIndex();
  const theme = useTheme();
  const params = useParams<{ id: string }>();
  const query = useQuery<"dialog" | "readonly">();
  const dialogMode = query.get("dialog") === "true";
  const readonly = query.get("readonly") === "true";
  const navigate = useNavigate();
  const charactersManager = useContext(CharactersContext);
  const [rolls, setRolls] = useState<Array<IDicePoolResult>>([]);
  const [resultsVisible, setResultsVisible] = useState(false);
  const myBinderManager = useContext(MyBinderContext);
  const [selectedCharacter, setSelectedCharacter] = useState<
    ICharacter | undefined
  >(undefined);
  const logger = useLogger();

  const hideTimeout = useRef<any>();

  const handleShowResults = useEvent(() => {
    setResultsVisible(true);
    hideResultsSoon();
  });

  const handleHideResults = useEvent(() => {
    setResultsVisible(false);
  });

  const hideResultsSoon = useEvent(() => {
    clearTimeout(hideTimeout.current);

    hideTimeout.current = setTimeout(() => {
      handleHideResults();
    }, HIDE_RESULTS_DELAY);
  });

  const handleSetRollResult = useEvent((result: Array<IDicePoolResult>) => {
    setRolls(result);
    handleShowResults();
  });
  const handleSetSingleRollResult = useEvent((result: IDicePoolResult) => {
    handleSetRollResult([result]);
  });

  useEffect(() => {
    logger.track("character.view");
  }, []);

  useEffect(() => {
    const characterToLoad = charactersManager.state.characters.find(
      (s) => s.id === params.id
    );

    if (characterToLoad) {
      setSelectedCharacter(characterToLoad);
    } else {
      navigate("/", {
        replace: true,
      });
      myBinderManager.actions.open({ folder: "characters" });
    }
  }, [params.id, charactersManager.state.characters]);

  return (
    <>
      <PageMeta title={selectedCharacter?.name} />
      <Snackbar
        sx={{
          "bottom": "6.5rem !important",
          "zIndex": zIndex.diceFab - 1,

          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "50vw",
            display: "block",
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            // boxShadow: "none",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        // open={resultsVisible && rolls.length > 0}
        open
        message={
          <>
            <Box
              onPointerEnter={handleShowResults}
              onClick={handleShowResults}
              sx={{
                width: "100%",
              }}
            >
              <DiceResult animate={false} poolResults={rolls} />
            </Box>
          </>
        }
      />

      <Box bgcolor={theme.palette.background.paper}>
        <Page pb="6rem" marginTop="0" maxWidth="none">
          {!dialogMode && (
            <Toolbox
              diceFabProps={{
                onRoll: handleSetRollResult,
                onHover: handleShowResults,
              }}
            />
          )}
          <CharacterV3Dialog
            open={!!selectedCharacter}
            character={selectedCharacter}
            dialog={dialogMode || false}
            readonly={readonly}
            onRoll={handleSetSingleRollResult}
            onSave={(newCharacter) => {
              charactersManager.actions.upsert(newCharacter);
            }}
          />
        </Page>
      </Box>
    </>
  );
}

CharacterRoute.displayName = "CharacterRoute";
export default CharacterRoute;
