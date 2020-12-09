import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PersonIcon from "@material-ui/icons/Person";
import truncate from "lodash/truncate";
import React from "react";
import {
  ICharacter,
  ISection,
} from "../../../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../../../contexts/InjectionsContext/hooks/useLogger";
import { arraySort } from "../../../../../domains/array/arraySort";
import { IRollDiceOptions } from "../../../../../domains/dice/Dice";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { ContentEditable } from "../../../../ContentEditable/ContentEditable";
import { FateLabel } from "../../../../FateLabel/FateLabel";
import { paperStyle } from "../../../Scene";

export const CharacterCard: React.FC<{
  characterSheet: ICharacter | undefined;
  readonly: boolean;
  onCharacterDialogOpen(): void;
  onRoll(options: IRollDiceOptions): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();
  const isLGAndUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMD = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const width = isLGAndUp ? "25%" : isMD ? "33%" : "100%";

  const aspectsSection = props.characterSheet?.sections.find(
    (s) => s.label === "Aspects"
  ) as ISection<string>;
  const skillsSection = props.characterSheet?.sections.find(
    (s) => s.label === "Skills"
  ) as ISection<string>;

  const aspects = aspectsSection.fields;
  const skills = skillsSection.fields;

  const skillsWithValue =
    skills.filter((s) => {
      return !!s.value;
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
  const bestSkills = sortedSkills.slice(0, 6);

  if (!props.characterSheet) {
    return null;
  }

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
                      data-cy={`character-card.skill.${skill.label}`}
                      onClick={() => {
                        if (props.readonly) {
                          return;
                        }
                        const bonus = parseInt(skill.value) || 0;
                        props.onRoll({
                          bonus: bonus,
                          bonusLabel: skill.label,
                        });
                      }}
                    >
                      {skill.label} ({skill.value})
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
      <Box py=".5rem" px="1rem">
        {aspects.map((aspect, aspectIndex) => {
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
                <FateLabel>{aspect.label}</FateLabel>
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
            </Box>
          </Box>
          {renderSkills()}
          {renderAspects()}
        </Box>
      </Paper>
    </Box>
  );
};
