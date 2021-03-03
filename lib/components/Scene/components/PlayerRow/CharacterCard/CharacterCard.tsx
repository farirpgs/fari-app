import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PersonIcon from "@material-ui/icons/Person";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import truncate from "lodash/truncate";
import React from "react";
import { useLogger } from "../../../../../contexts/InjectionsContext/hooks/useLogger";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPointCounterBlock,
  ISkillBlock,
  ISlotTrackerBlock,
  ITextBlock,
} from "../../../../../domains/character/types";
import { IRollDiceOptions } from "../../../../../domains/dice/Dice";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { CharacterCircleBox } from "../../../../../routes/Character/components/CharacterV3Dialog";
import { ContentEditable } from "../../../../ContentEditable/ContentEditable";
import { FateLabel } from "../../../../FateLabel/FateLabel";
import { paperStyle } from "../../../Scene";

export const CharacterCard: React.FC<{
  characterSheet: ICharacter | undefined;
  playerName: string | undefined;
  readonly: boolean;
  isMe: boolean;
  width?: string;
  onCharacterDialogOpen?(): void;
  onRoll?(options: IRollDiceOptions): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();
  const isLGAndUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMD = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const dynamicInternalWidth = isLGAndUp ? "25%" : isMD ? "33%" : "100%";
  const width = props.width ?? dynamicInternalWidth;

  const sections = props.characterSheet?.pages.flatMap((p) => p.sections);
  const visibleSections = sections?.filter((s) => s.visibleOnCard);

  if (!props.characterSheet) {
    return null;
  }

  const renderBlockByBlockType: Record<
    keyof typeof BlockType,
    (block: any) => JSX.Element
  > = {
    Text: renderBlockText,
    RichText: renderBlockText,
    Skill: renderBlockSkill,
    PointCounter: renderBlockPointCounter,
    SlotTracker: renderBlockSlotTracker,
  };

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
              borderBottom: "1px solid #f0a4a4",
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
                          onClick={(e) => {
                            props.onCharacterDialogOpen?.();
                            logger.info("CharacterCard:onCharacterDialogOpen");
                          }}
                        >
                          <PersonIcon
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
          <Box py="1rem" px="1rem">
            {visibleSections?.map((section, sectionIndex) => {
              return (
                <Box key={section.id} className={css({ clear: "both" })}>
                  <Box>
                    <FateLabel>{section.label}</FateLabel>
                  </Box>
                  <Grid container>
                    {section.blocks.map((block) => {
                      return (
                        <React.Fragment key={block.id}>
                          {renderBlockByBlockType[block.type](block)}
                        </React.Fragment>
                      );
                    })}
                  </Grid>
                  {sectionIndex !== visibleSections.length - 1 && (
                    <Divider className={css({ margin: "1rem 0" })} />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );

  function renderBlockText(block: IBlock & ITextBlock) {
    const containsImage = block.value.includes("<img");
    const value = containsImage
      ? block.value
      : truncate(block.value, { length: 50 });

    return (
      <Grid item xs={12}>
        <Box>
          <FateLabel className={css({ fontSize: ".8rem" })}>
            {block.label}
          </FateLabel>
        </Box>
        <Box>
          <Typography
            title={block.value}
            className={css({ fontSize: ".8rem" })}
          >
            <ContentEditable readonly={true} value={value} />
          </Typography>
        </Box>
      </Grid>
    );
  }

  function renderBlockSkill(block: IBlock & ISkillBlock) {
    return (
      <Grid item className={css({ flex: "0 1 auto" })}>
        <Link
          className={css([
            {
              paddingRight: ".5rem",
              fontSize: ".8rem",
              cursor: props.readonly ? "inherit" : "pointer",
            },
            props.readonly && {
              "color": theme.palette.text.primary,
              "&:hover": {
                textDecoration: "none",
              },
            },
          ])}
          data-cy={`character-card.${block.label}.label`}
          onClick={() => {
            if (props.readonly) {
              return;
            }
            const bonus = parseInt(block.value) || 0;
            props.onRoll?.({
              bonus: bonus,
              bonusLabel: block.label,
            });
          }}
        >
          {block.label} ({block.value || "0"})
        </Link>
      </Grid>
    );
  }
  function renderBlockPointCounter(block: IBlock & IPointCounterBlock) {
    return (
      <Grid item xs={12}>
        <Box>
          <FateLabel className={css({ fontSize: ".8rem" })}>
            {block.label}
          </FateLabel>

          <Grid container wrap="nowrap" alignItems="center" spacing={1}>
            <Grid item>
              <CharacterCircleBox minWidth="3rem">
                <ContentEditable readonly value={block.value} />
              </CharacterCircleBox>
            </Grid>
            {block.meta?.max !== undefined && (
              <>
                <Grid item>
                  <Typography
                    className={css({
                      fontSize: "1.5rem",
                      color: "#bdbdbd",
                    })}
                  >
                    {"/"}
                  </Typography>
                </Grid>
                <Grid item>
                  <CharacterCircleBox minWidth="3rem">
                    <ContentEditable readonly value={block.meta?.max ?? ""} />
                  </CharacterCircleBox>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    );
  }
  function renderBlockSlotTracker(block: IBlock & ISlotTrackerBlock) {
    return (
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <FateLabel className={css({ fontSize: ".8rem" })}>
            {block.label}
          </FateLabel>
        </Box>
        <Grid container justify="center">
          {block.value.map((box, boxIndex) => {
            return (
              <Grid item key={boxIndex}>
                <Box
                  className={css({
                    display: "flex",
                    justifyContent: "center",
                  })}
                >
                  <Checkbox
                    color="primary"
                    disabled
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    checked={box.checked}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    );
  }
};
