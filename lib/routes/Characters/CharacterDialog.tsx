import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // Variant,
  Grid,
  TextField,
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
import { ICharacter } from "../Play/useScene/IScene";

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
        <DialogTitle>
          <FateLabel
            className={css({ paddingRight: ".5rem" })}
            display="inline"
          >
            {"Name"}
          </FateLabel>
          <ContentEditable
            value={character.name}
            inline
            onChange={(value) => {
              setCharacter(
                produce((draft: ICharacter) => {
                  draft.name = value;
                })
              );
            }}
          ></ContentEditable>
        </DialogTitle>
        <DialogContent className={css({ padding: "0" })}>
          <Grid container>
            <Grid
              item
              xs={6}
              className={css({
                borderRight: `2px solid ${headerTextColors.primary}`,
              })}
            >
              <FateLabel className={headerStyle}>
                <Box padding=".5rem 1.5rem">{"Aspects"}</Box>
              </FateLabel>
              <Box padding=".5rem 1.5rem">
                <Box pb=".5rem">
                  <FateLabel display="inline">{"High Concept"}</FateLabel>
                  <TextField
                    value={character.highConcept}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value;
                      setCharacter(
                        produce((draft: ICharacter) => {
                          draft.highConcept = value;
                        })
                      );
                    }}
                  />
                </Box>
                <Box pb=".5rem">
                  <FateLabel display="inline">{"Trouble"}</FateLabel>
                  <TextField
                    value={character.trouble}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value;
                      setCharacter(
                        produce((draft: ICharacter) => {
                          draft.trouble = value;
                        })
                      );
                    }}
                  />
                </Box>
                <Box pb=".5rem">
                  <FateLabel display="inline">{"Other Aspects"}</FateLabel>
                  <TextField
                    value={character.otherAspects}
                    fullWidth
                    multiline
                    rows={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCharacter(
                        produce((draft: ICharacter) => {
                          draft.otherAspects = value;
                        })
                      );
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <FateLabel className={headerStyle}>
                <Box padding=".5rem 1.5rem">{"Vitals"}</Box>
              </FateLabel>
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
              <FateLabel className={headerStyle}>
                <Box padding=".5rem 1.5rem">{"Stunts"}</Box>
              </FateLabel>
              <Box padding=".5rem 1.5rem">
                <Box pb=".5rem">
                  <TextField
                    value={character.stunts}
                    fullWidth
                    multiline
                    rows={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCharacter(
                        produce((draft: ICharacter) => {
                          draft.stunts = value;
                        })
                      );
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <FateLabel className={headerStyle}>
                <Box padding=".5rem 1.5rem">{"Skills"}</Box>
              </FateLabel>
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
};
CharacterDialog.displayName = "CharacterDialog";
