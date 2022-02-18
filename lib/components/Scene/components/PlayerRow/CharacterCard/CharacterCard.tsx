import { css, cx } from "@emotion/css";
import FaceIcon from "@mui/icons-material/Face";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect } from "react";
import { useLogger } from "../../../../../contexts/InjectionsContext/hooks/useLogger";
import { ICharacter } from "../../../../../domains/character/types";
import { IDiceRollResult } from "../../../../../domains/dice/Dice";
import { useTextColors } from "../../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { BlockByType } from "../../../../../routes/Character/components/CharacterDialog/components/BlockByType";
import { useCharacter } from "../../../../../routes/Character/hooks/useCharacter";
import { previewContentEditable } from "../../../../ContentEditable/ContentEditable";
import { FateLabel } from "../../../../FateLabel/FateLabel";
import { paperStyle } from "../../../Scene";

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

  useEffect(() => {
    if (characterManager.state.character) {
      props.onChange?.(characterManager.state.character);
    }
  }, [characterManager.state.character]);

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
      <Paper className={paperStyle}>
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
            <Box>
              <Grid container alignItems="baseline" spacing={2} wrap="nowrap">
                <Grid item xs zeroMinWidth>
                  <FateLabel noWrap>{props.characterSheet?.name}</FateLabel>
                </Grid>
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
                          <FaceIcon
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
              {props.playerName && (
                <InputLabel shrink>{`(${props.playerName})`}</InputLabel>
              )}
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
