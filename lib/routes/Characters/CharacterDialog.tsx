import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import { css, cx } from "emotion";
import produce from "immer";
import React, { useEffect, useState } from "react";
import {
  ContentEditable,
  sanitizeContentEditable,
} from "../../components/ContentEditable/ContentEditable";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { ICharacter } from "./useCharacters";

export const FateLabel: React.FC<{
  className?: string;
  variant?: Variant;
  display?: "initial" | "block" | "inline";
}> = (props) => {
  return (
    <Typography
      variant={props.variant}
      className={cx(
        css({
          textTransform: "uppercase",
          fontWeight: 900,
        }),
        props.className
      )}
      display={props.display}
    >
      {props.children}
    </Typography>
  );
};

FateLabel.displayName = "FateLabel";

export const CharacterDialog: React.FC<{
  character: ICharacter;
  onSave(newCharacter: ICharacter): void;
  onDelete(): void;
  onClose(): void;
  readonly?: boolean;
}> = (props) => {
  const theme = useTheme();
  const [character, setCharacter] = useState<ICharacter>(props.character);

  useEffect(() => {
    setCharacter(props.character);
  }, [props.character]);

  function setCharacterName(value: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.name = value;
      })
    );
  }

  function setCharacterAspectName(index: number, newAspectName: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.aspects = Object.keys(draft.aspects).reduce((acc, curr, i) => {
          const name = index === i ? newAspectName : curr;
          return {
            ...acc,
            [name]: draft.aspects[curr],
          };
        }, {} as Record<string, string>);
      })
    );
  }

  function setCharacterAspect(index: number, newAspectValue: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.aspects = Object.keys(draft.aspects).reduce((acc, curr, i) => {
          const value = index === i ? newAspectValue : draft.aspects[curr];
          return {
            ...acc,
            [curr]: value,
          };
        }, {} as Record<string, string>);
      })
    );
  }

  function setCharacterStunt(value: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stunts = value;
      })
    );
  }

  function onSave() {
    const updatedCharacter = produce(character, (draft) => {
      draft.name = sanitizeContentEditable(character.name);
    });
    props.onSave(updatedCharacter);
  }

  const headerTextColors = useTextColors(theme.palette.background.paper);
  const headerStyle = css({
    background: headerTextColors.primary,
    color: theme.palette.background.paper,
    padding: ".5rem 1.5rem",
  });

  if (!character) {
    return null;
  }

  return (
    <Dialog
      open={!!props.character}
      fullWidth
      maxWidth="sm"
      onClose={props.onClose}
    >
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onSave();
        }}
      >
        <DialogTitle>{renderCharacterName()}</DialogTitle>
        <DialogContent className={css({ padding: "0" })}>
          <Grid container>
            <Grid
              item
              xs={6}
              className={css({
                borderRight: `2px solid ${headerTextColors.primary}`,
              })}
            >
              {renderCharacterAspects()}
            </Grid>
            <Grid item xs={6}>
              <FateLabel className={headerStyle}>{"Vitals"}</FateLabel>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              xs={6}
              className={css({
                borderRight: `2px solid ${headerTextColors.primary}`,
              })}
            >
              {renderCharacterStunts()}
            </Grid>
            <Grid item xs={6}>
              <FateLabel className={headerStyle}>{"Skills"}</FateLabel>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onDelete}>{"Delete"}</Button>
          <Button onClick={props.onClose}>{"Close"}</Button>
          <Button onClick={onSave} type="submit">
            {"Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  function renderCharacterName() {
    return (
      <>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <FateLabel>{"Name"}</FateLabel>
          </Grid>
          <Grid item className={css({ flex: "1 0 auto" })}>
            <ContentEditable
              border
              value={character.name}
              onChange={(value) => {
                setCharacterName(value);
              }}
            ></ContentEditable>
          </Grid>
        </Grid>
      </>
    );
  }

  function renderCharacterAspects() {
    return (
      <>
        <FateLabel className={headerStyle}>{"Aspects"}</FateLabel>

        <Box padding=".5rem 1.5rem">
          {Object.keys(character.aspects).map((aspectName, index) => {
            return (
              <Box key={index} py=".5rem">
                <Box pb=".5rem">
                  <FateLabel display="inline">
                    <ContentEditable
                      value={aspectName}
                      inline
                      onChange={(value) => {
                        setCharacterAspectName(index, value);
                      }}
                    />
                  </FateLabel>
                </Box>
                <Box>
                  <Typography>
                    <ContentEditable
                      border
                      inline
                      fullWidth
                      value={character.aspects[aspectName]}
                      onChange={(value) => {
                        setCharacterAspect(index, value);
                      }}
                    />
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </>
    );
  }

  function renderCharacterStunts() {
    return (
      <>
        <FateLabel className={headerStyle}>{"Stunts"}</FateLabel>
        <Box padding=".5rem 1.5rem">
          <Typography>
            <ContentEditable
              border
              inline
              fullWidth
              value={character.stunts}
              onChange={(value) => {
                setCharacterStunt(value);
              }}
            ></ContentEditable>
          </Typography>
        </Box>
      </>
    );
  }
};
CharacterDialog.displayName = "CharacterDialog";
