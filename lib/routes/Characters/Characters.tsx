import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { css, cx } from "emotion";
import React from "react";
import { ContentEditable } from "../../components/ContentEditable/ContentEditable";
import { MagicGridContainer } from "../../components/MagicGridContainer/MagicGridContainer";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { ICharacter } from "../Play/useScene/IScene";
import { CharacterDialog } from "./CharacterDialog";
import { useCharacters } from "./useCharacters";

export const CharactersRoute: React.FC<{}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const charactersManager = useCharacters();

  return (
    <>
      <PageMeta
        title={t("characters-route.title")}
        description={t("characters-route.description")}
      ></PageMeta>

      <Page>
        <CharacterDialog
          character={charactersManager.state.selectedCharacter}
          onSave={(newCharacter) => {
            charactersManager.actions.close();
            charactersManager.actions.update(newCharacter);
          }}
          onDelete={() => {
            const confirmed = confirm("Are you sure ?");
            if (confirmed) {
              charactersManager.actions.close();
              charactersManager.actions.remove(
                charactersManager.state.selectedCharacter.id
              );
            }
          }}
          onClose={() => {
            charactersManager.actions.close();
          }}
        ></CharacterDialog>

        <Typography variant="h4">{"Characters"}</Typography>
        <Box py="1rem">
          <Grid container spacing={1} justify="center">
            <Grid item>
              <Button
                onClick={() => {
                  charactersManager.actions.add();
                }}
                variant="contained"
                color="secondary"
                endIcon={<PersonAddIcon></PersonAddIcon>}
              >
                {"Add Character"}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box py="1rem">
          <MagicGridContainer items={charactersManager.state.characters.length}>
            {charactersManager.state.characters.map((character) => {
              return renderCharacterCard(character);
            })}
          </MagicGridContainer>
        </Box>
      </Page>
    </>
  );

  function renderCharacterCard(character: ICharacter) {
    return (
      <Box
        key={character.id}
        className={cx(
          css({
            width: isSmall ? "100%" : "33%",
            padding: "0 .5rem 1.5rem .5rem",
          })
        )}
      >
        <Paper
          elevation={undefined}
          onClick={() => {
            charactersManager.actions.select(character);
          }}
          className={css({
            "cursor": "pointer",
            "&:hover": {
              background: theme.palette.action.hover,
            },
          })}
        >
          <Box>
            <Box
              className={css({
                fontSize: "1.5rem",
                width: "100%",
                padding: "0.5rem 0",
                borderBottom: "1px solid #f0a4a4",
              })}
            >
              <Box
                p={"1rem 1rem 1rem 1rem"}
                display="flex"
                justifyContent="center"
              >
                <ContentEditable
                  value={character.name}
                  readonly
                ></ContentEditable>
              </Box>
            </Box>
            <Box
              className={css({
                fontSize: "1.1rem",
                lineHeight: "1.7rem",
                padding: "0.5rem 0",
                width: "100%",
                borderBottom: `1px solid ${theme.palette.divider}`,
              })}
            >
              <Box p="0 1rem" display="flex" justifyContent="center">
                <Typography>
                  <i>{character.highConcept || "..."}</i>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }
};

CharactersRoute.displayName = "CharactersRoute";
