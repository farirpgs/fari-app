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
  SectionType,
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

  const sections = props.characterSheet?.pages.flatMap((p) => p.sections);
  const visibleSections = sections?.filter((s) => s.visibleOnCard);

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
          {visibleSections?.map((s) => {
            return (
              <Box key={s.id}>
                {s.type === SectionType.Text && renderTextSection(s)}
                {s.type === SectionType.Number && renderNumberSection(s)}
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );

  function renderNumberSection(section: ISection<string>) {
    const fieldWithValues =
      section.fields.filter((s) => {
        return !!s.value;
      }) ?? [];

    const sortedFields = arraySort(fieldWithValues, [
      (skill) => {
        const bonus = parseInt(skill.value) || 0;
        return {
          value: bonus,
          direction: "desc",
        };
      },
    ]);
    const bestFieldValues = sortedFields.slice(0, 6);

    if (bestFieldValues.length === 0) {
      return null;
    }
    return (
      <Box py=".5rem" px="1rem">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FateLabel>{section.label}</FateLabel>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} alignItems="center">
              {bestFieldValues.map((field, fieldIndex) => {
                return (
                  <Grid item key={fieldIndex}>
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
                      data-cy={`character-card.${section.label}.label.${field.label}`}
                      onClick={() => {
                        if (props.readonly) {
                          return;
                        }
                        const bonus = parseInt(field.value) || 0;
                        props.onRoll({
                          bonus: bonus,
                          bonusLabel: field.label,
                        });
                      }}
                    >
                      {field.label} ({field.value})
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

  function renderTextSection(section: ISection<string>) {
    return (
      <Box py="1rem" px="1rem">
        {section.fields.map((field, fieldIndex) => {
          const containsImage = field.value.includes("<img");
          const value = containsImage
            ? field.value
            : truncate(field.value, { length: 50 });

          if (!field.value) {
            return null;
          }

          return (
            <Box key={field.id} pb=".5rem">
              <Box>
                <FateLabel>{field.label}</FateLabel>
              </Box>
              <Box>
                <Typography title={field.value}>
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
