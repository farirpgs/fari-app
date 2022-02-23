import { css, cx } from "@emotion/css";
import LaunchIcon from "@mui/icons-material/Launch";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { useLogger } from "../../../../../contexts/InjectionsContext/hooks/useLogger";
import { ICharacter } from "../../../../../domains/character/types";
import { IDiceRollResult } from "../../../../../domains/dice/Dice";
import { useTextColors } from "../../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { BlockByType } from "../../../../../routes/Character/components/CharacterDialog/components/BlockByType";
import { useCharacter } from "../../../../../routes/Character/hooks/useCharacter";
import { previewContentEditable } from "../../../../ContentEditable/ContentEditable";
import { FateLabel } from "../../../../FateLabel/FateLabel";

export const CharacterCard: React.FC<{
  characterSheet: ICharacter | undefined;
  playerName: string | undefined;
  readonly: boolean;
  width?: string;
  onCharacterDialogOpen?(): void;
  onRoll(newRollResult: IDiceRollResult): void;
  onChange?(newCharacter: ICharacter): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();
  const width = props.width ?? "100%";
  const characterManager = useCharacter(props.characterSheet);

  const sections = characterManager.state.character?.pages
    .flatMap((p) => p.rows)
    .flatMap((r) => r.columns)
    .flatMap((c) => c.sections);
  const visibleSections = sections?.filter((s) => s.visibleOnCard);

  const headerColor = theme.palette.background.paper;
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);
  const sheetHeaderClassName = css({
    label: "SheetHeader-box",
    // Hexagone
    // https://bennettfeely.com/clippy/
    clipPath: "polygon(2% 0%, 100% 0, 100% 70%, 98% 100%, 0 100%, 0% 30%)",
    background: headerBackgroundColors.primary,
    color: headerColor,
    width: "100%",
    padding: ".5rem",
    marginTop: "1rem",
  });

  function handleSave() {
    const updatedCharacter =
      characterManager.actions.getCharacterWithNewTimestamp();
    props.onChange?.(updatedCharacter);
  }

  if (!characterManager.state.character) {
    return null;
  }
  const numberOfSections = visibleSections?.length ?? 0;
  const hasSections = numberOfSections > 0;

  return (
    <Box
      data-cy="character-card"
      className={cx(
        css({
          width: width,
          padding: "0 .5rem 1.5rem .5rem",
        })
      )}
    >
      <Paper
        className={css({
          borderRadius: "0px",
          flex: "1 0 auto",
        })}
      >
        <Box>
          <Box
            py=".5rem"
            px="1rem"
            className={css({
              fontSize: "1.5rem",
              width: "100%",
              borderBottom: hasSections ? "1px solid #f0a4a4" : undefined,
            })}
          >
            <Grid container alignItems="flex-start" spacing={1} wrap="nowrap">
              <Grid item xs>
                <FateLabel
                  noWrap
                  sx={{
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  {props.characterSheet?.name}
                </FateLabel>
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  {props.onCharacterDialogOpen && (
                    <Grid item>
                      <Tooltip title={t("player-row.open-character-sheet")}>
                        <span>
                          <IconButton
                            size="small"
                            data-cy="character-card.open-character-sheet"
                            onClick={() => {
                              props.onCharacterDialogOpen?.();
                              logger.track(
                                "session.open_character_sheet_from_card"
                              );
                            }}
                          >
                            <LaunchIcon
                              className={css({
                                width: "1.5rem",
                                height: "1.5rem",
                              })}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  )}
                  {props.onChange && !props.readonly && (
                    <Grid item>
                      <Tooltip title={t("character-dialog.save")}>
                        <span>
                          <IconButton
                            size="small"
                            data-cy="character-card.open-character-sheet"
                            onClick={() => {
                              handleSave();
                              logger.track(
                                "session.save_character_sheet_from_card"
                              );
                            }}
                          >
                            <SaveIcon
                              color={
                                characterManager.state.dirty
                                  ? "primary"
                                  : undefined
                              }
                              className={css({
                                width: "1.5rem",
                                height: "1.5rem",
                              })}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Box>
              <Grid
                container
                justifyContent="flex-end"
                alignItems="baseline"
                spacing={1}
                wrap="nowrap"
              />
              <Grid container>
                {props.playerName && (
                  <Grid item xs={12}>
                    <InputLabel shrink>{`(${props.playerName})`}</InputLabel>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
          {hasSections &&
            characterManager.state.character?.pages.map((page, pageIndex) => {
              return page.rows.map((row, rowIndex) => {
                return row.columns.map((column, columnIndex) => {
                  return column.sections.map((section, sectionIndex) => {
                    if (!section.visibleOnCard) {
                      return null;
                    }
                    return (
                      <Box
                        px="1rem"
                        pb="1rem"
                        key={section.id}
                        className={css({ clear: "both" })}
                      >
                        <Box className={sheetHeaderClassName}>
                          <FateLabel noWrap>
                            {previewContentEditable({
                              value: section.label,
                            })}
                          </FateLabel>
                        </Box>
                        <Box px=".2rem">
                          {section.blocks.map((block, blockIndex) => {
                            return (
                              <React.Fragment key={block.id}>
                                <Box pt=".5rem">
                                  <BlockByType
                                    advanced={false}
                                    readonly={props.readonly}
                                    dataCy={`character-card.${section.label}.${block.label}`}
                                    block={block}
                                    onChange={(newBlock) => {
                                      characterManager.actions.setBlock(
                                        {
                                          pageIndex: pageIndex,
                                          rowIndex: rowIndex,
                                          columnIndex: columnIndex,
                                          sectionIndex: sectionIndex,
                                          blockIndex: blockIndex,
                                        },
                                        newBlock
                                      );
                                    }}
                                    onRoll={(diceRollResult) => {
                                      props.onRoll(diceRollResult);
                                    }}
                                  />
                                </Box>
                              </React.Fragment>
                            );
                          })}
                        </Box>
                      </Box>
                    );
                  });
                });
              });
            })}
        </Box>
      </Paper>
    </Box>
  );
};
