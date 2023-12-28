"use client";

import { Box, Snackbar, useTheme } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { Page } from "../../components/Page/Page";
import { Toolbox } from "../../components/Toolbox/Toolbox";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ICharacter } from "../../domains/character/types";
import { IDicePoolResult } from "../../domains/dice/Dice";
import { useEvent } from "../../hooks/useEvent/useEvent";
import { useQuery } from "../../hooks/useQuery/useQuery";
import { DiceResult } from "../DiceRoute/components/DiceResult";
import { CharacterV3Dialog } from "./components/CharacterDialog/CharacterV3Dialog";

const HIDE_RESULTS_DELAY = 10000;

function DicePoolResultsSnackBar(props: {
  dicePoolResults: Array<IDicePoolResult>;
  open: boolean;
  onClose?: () => void;
}) {
  const theme = useTheme();
  const hideTimeout = useRef<any>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (props.open) {
      handleShowResults();
    }
  }, [props.open]);

  useEffect(() => {
    if (props.dicePoolResults.length > 0) {
      handleShowResults();
    }
  }, [props.dicePoolResults]);

  const handleShowResults = useEvent(() => {
    setVisible(true);
    hideResultsSoon();
  });

  const handleHideResults = useEvent(() => {
    setVisible(false);
    props.onClose?.();
  });

  const hideResultsSoon = useEvent(() => {
    clearTimeout(hideTimeout.current);

    hideTimeout.current = setTimeout(() => {
      handleHideResults();
    }, HIDE_RESULTS_DELAY);
  });

  return (
    <Snackbar
      sx={{
        "bottom": "6.5rem !important",
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "50vw",
          display: "block",
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={visible && props.dicePoolResults.length > 0}
      message={
        <>
          <Box
            onPointerEnter={handleShowResults}
            onClick={handleShowResults}
            sx={{
              width: "100%",
            }}
          >
            <DiceResult animate={false} poolResults={props.dicePoolResults} />
          </Box>
        </>
      }
    />
  );
}

export function CharacterRoute() {
  const theme = useTheme();
  const params = useParams();
  const query = useQuery<"dialog" | "readonly">();
  const dialogMode = query.get("dialog") === "true";
  const readonly = query.get("readonly") === "true";
  const router = useRouter();
  const charactersManager = useContext(CharactersContext);
  const [dicePoolResults, setDicePoolResults] = useState<
    Array<IDicePoolResult>
  >([]);
  const myBinderManager = useContext(MyBinderContext);
  const [selectedCharacter, setSelectedCharacter] = useState<
    ICharacter | undefined
  >(undefined);
  const logger = useLogger();
  const [resultsVisible, setResultsVisible] = useState(false);

  const handleShowResults = useEvent(() => {
    setResultsVisible(true);
  });
  const handleHideResults = useEvent(() => {
    setResultsVisible(false);
  });
  const handleSetRollResults = useEvent((results: Array<IDicePoolResult>) => {
    setDicePoolResults(results);
    handleShowResults();
  });
  const handleSetRollResult = useEvent((result: IDicePoolResult) => {
    handleSetRollResults([result]);
  });

  useEffect(() => {
    logger.track("character.view");
  }, []);

  useEffect(() => {
    const characterToLoad = charactersManager.state.characters.find(
      (s) => s.id === params.id,
    );

    if (characterToLoad) {
      setSelectedCharacter(characterToLoad);
    } else {
      router.replace("/");
      myBinderManager.actions.open({ folder: "characters" });
    }
  }, [params.id, charactersManager.state.characters]);

  return (
    <>
      <DicePoolResultsSnackBar
        open={resultsVisible}
        onClose={handleHideResults}
        dicePoolResults={dicePoolResults}
      />
      <Box bgcolor={theme.palette.background.paper}>
        <Page maxWidth="none" sx={{ paddingTop: "2rem" }}>
          {!dialogMode && (
            <Toolbox
              diceFabProps={{
                onRoll: handleSetRollResults,
                onHover: handleShowResults,
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
}
