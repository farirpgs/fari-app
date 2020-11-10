import {
  Box,
  Grid,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { css, cx } from "emotion";
import truncate from "lodash/truncate";
import React from "react";
import { ICharacter } from "../../../../../contexts/CharactersContext/CharactersContext";
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

  const skillsWithValue =
    props.characterSheet?.skills.filter((s) => {
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
  const bestSkills = sortedSkills.slice(0, 5);

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
                      onClick={() => {
                        if (props.readonly) {
                          return;
                        }
                        const bonus = parseInt(skill.value) || 0;
                        props.onRoll({
                          bonus: bonus,
                          bonusLabel: skill.name,
                        });
                      }}
                    >
                      {skill.name} ({skill.value})
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

  return (
    <Box
      width={width}
      className={cx(
        css({
          // width: width,
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
              <Grid
                container
                justify="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <FateLabel>{props.characterSheet?.name}</FateLabel>
                </Grid>
                <Grid item>
                  <Tooltip title={t("player-row.open-character-sheet")}>
                    <span>
                      <IconButton
                        size="small"
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
          {renderAspects()}{" "}
        </Box>
      </Paper>
    </Box>
  );
};
