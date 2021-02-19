import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PersonIcon from "@material-ui/icons/Person";
import truncate from "lodash/truncate";
import React from "react";
import { ICharacter } from "../../../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../../../contexts/InjectionsContext/hooks/useLogger";
import { arraySort } from "../../../../../domains/array/arraySort";
import { IRollDiceOptions } from "../../../../../domains/dice/Dice";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../ContentEditable/ContentEditable";
import { FateLabel } from "../../../../FateLabel/FateLabel";
import { paperStyle } from "../../../Scene";

export const CharacterCard: React.FC<{
  characterSheet: ICharacter | undefined;
  playerName: string | undefined;
  readonly: boolean;
  isMe: boolean;
  onCharacterDialogOpen(): void;
  onRoll(options: IRollDiceOptions): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();
  const isLGAndUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMD = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const width = isLGAndUp ? "25%" : isMD ? "33%" : "100%";

  const skillsWithValue =
    props.characterSheet?.skills.filter((s) => {
      return true;
      // return !!s.value;
    }) ?? [];
  const sortedSkills = arraySort(skillsWithValue, [
    (skill) => {
      const bonus = parseInt(skill.value) || 0;
      return {
        value: bonus,
        direction: "desc",
      };
    },
  ]);
  // const bestSkills = sortedSkills;
  const bestSkills = sortedSkills.slice(0, 10);

  if (!props.characterSheet) {
    return null;
  }

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
                  <FateLabel noWrap>
                    {props.characterSheet?.name ||
                      t("play-route.character-name")}
                  </FateLabel>
                </Grid>
                <Grid item>
                  <Tooltip title={t("player-row.open-character-sheet")}>
                    <span>
                      <IconButton
                        size="small"
                        data-cy="character-card.open-character-sheet"
                        onClick={(e) => {
                          props.onCharacterDialogOpen();
                          logger.info("CharacterCard:onCharacterDialogOpen");
                        }}
                      >
                        <PersonIcon
                          className={css({ width: "1.5rem", height: "1.5rem" })}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
              {props.playerName && (
                <InputLabel shrink>{`(${props.playerName})`}</InputLabel>
              )}
            </Box>
          </Box>
          {renderSkills()}
          {renderAspects()}
        </Box>
      </Paper>
    </Box>
  );

  function renderSkills() {
    if (bestSkills.length === 0) {
      return null;
    }
    return (
      <Box py=".5rem" px="1rem">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FateLabel>{"Skills:"}</FateLabel>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} alignItems="center">
              {bestSkills.map((skill, skillIndex) => {
                const skillName = previewContentEditable({
                  value: skill.name,
                });
                const skillValue = previewContentEditable({
                  value: skill.value,
                });

                return (
                  <Grid item key={skillIndex}>
                    <Link
                      className={css([
                        {
                          cursor: props.readonly ? "inherit" : "pointer",
                        },
                        props.readonly && {
                          "color": theme.palette.text.primary,
                          "&:hover": {
                            textDecoration: "none",
                          },
                        },
                      ])}
                      data-cy={`character-card.skill.${skillName}`}
                      onClick={() => {
                        if (props.readonly) {
                          return;
                        }
                        const bonus = parseInt(skillValue) || 0;
                        props.onRoll({
                          bonus: bonus,
                          bonusLabel: skillName,
                        });
                      }}
                    >
                      {skillName} ({skillValue})
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderAspects() {
    return (
      <Box py="1rem" px="1rem">
        {props.characterSheet?.aspects.map((aspect, aspectIndex) => {
          const containsImage = aspect.value.includes("<img");
          const value = containsImage
            ? aspect.value
            : truncate(aspect.value, { length: 50 });

          if (!aspect.value) {
            return null;
          }

          return (
            <Box key={aspectIndex} pb=".5rem">
              <Box>
                <FateLabel>{aspect.name}</FateLabel>
              </Box>
              <Box>
                <Typography title={aspect.value}>
                  <ContentEditable readonly={true} value={value} />
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }
};
