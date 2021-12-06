import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid, { GridSize } from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { ICharacter, ISection } from "../../domains/character/types";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { BlockByType } from "../Character/components/CharacterDialog/components/BlockByType";

export const CharacterPrintRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const theme = useTheme();
  const history = useHistory();
  const charactersManager = useContext(CharactersContext);
  const settingsManager = useContext(SettingsContext);
  const [character, setCharacter] = useState<ICharacter | undefined>(undefined);
  const myBinderManager = useContext(MyBinderContext);
  const logger = useLogger();

  useEffect(() => {
    logger.track("character.print");

    settingsManager.actions.setThemeModeTemporarily("light");
  }, []);

  useEffect(() => {
    const characterToLoad = charactersManager.state.characters.find(
      (s) => s.id === props.match.params.id
    );

    if (characterToLoad) {
      setCharacter(characterToLoad);
    } else {
      history.replace("/");
      myBinderManager.actions.open({ folder: "characters" });
    }
  }, [props.match.params.id, charactersManager.state.characters]);

  const maxWidth = character?.wide ? "lg" : "md";

  return (
    <>
      <PageMeta title={character?.name} />

      <Box bgcolor={theme.palette.background.paper} mt="1rem">
        <Container maxWidth={maxWidth}>
          <PrintCharacter character={character} />
        </Container>
      </Box>
    </>
  );
};

CharacterPrintRoute.displayName = "CharacterPrintRoute";
export default CharacterPrintRoute;

function PrintCharacter(props: { character: ICharacter | undefined }) {
  const theme = useTheme();
  const headerColor = theme.palette.background.paper;
  const headerBackgroundColor = useTextColors(
    theme.palette.background.paper
  ).primary;
  return (
    <>
      <Box mb="1rem">
        <Grid container justifyContent="center">
          <Grid item>
            <FateLabel uppercase={false} variant="h4">
              {props.character?.name}
            </FateLabel>
          </Grid>
        </Grid>
      </Box>
      <Box>
        {props.character?.pages.map((page, pageIndex) => {
          const leftSections = page.sections.left;
          const rightSections = page.sections.right;
          return (
            <Box
              key={pageIndex}
              className={css({
                pageBreakAfter: "always",
              })}
            >
              <Box
                className={css({
                  borderBottom: `3px solid ${headerBackgroundColor}`,
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                })}
              >
                <Box
                  className={css({
                    background: headerBackgroundColor,
                    color: headerColor,
                    marginRight: "1rem",
                    width: "auto",
                    padding: ".5rem 1rem",
                    // Pentagone
                    // https://bennettfeely.com/clippy/
                    clipPath:
                      "polygon(0 0, 90% 0, 100% 35%, 100% 100%, 0 100%)",
                  })}
                >
                  <FateLabel
                    noWrap
                    className={css({
                      fontSize: "1.4rem",
                    })}
                  >
                    {previewContentEditable({ value: page.label })}
                  </FateLabel>
                </Box>
              </Box>
              {/* <Box
              className={css({
                columns: "2",
                columnGap: "1rem",
                // breakInside: "avoid",
              })}
            >
              <Box
                className={css({
                  pageBreakInside: "avoid",
                })}
              >
                <PrintSections sections={leftSections} />
              </Box>
              <Box
                className={css({
                  pageBreakInside: "avoid",
                })}
              >
                <PrintSections sections={rightSections} />
              </Box>
            </Box> */}
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <PrintSections sections={leftSections} />
                </Grid>
                <Grid item xs={6}>
                  <PrintSections sections={rightSections} />
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

function PrintSections(props: { sections: Array<ISection> }) {
  const theme = useTheme();
  const headerColor = theme.palette.background.paper;
  const headerBackgroundColor = useTextColors(
    theme.palette.background.paper
  ).primary;

  return (
    <>
      {props.sections.map((section, sectionIndex) => {
        return (
          <Box
            key={sectionIndex}
            className={css({
              pageBreakInside: "avoid",
            })}
          >
            <Grid container>
              <Grid item xs>
                <Box
                  className={css({
                    // Hexagone
                    // https://bennettfeely.com/clippy/
                    clipPath:
                      "polygon(2% 0%, 100% 0, 100% 70%, 98% 100%, 0 100%, 0% 30%)",
                    background: headerBackgroundColor,
                    color: headerColor,
                    width: "100%",
                    padding: ".5rem",
                  })}
                >
                  <FateLabel
                    noWrap
                    className={css({
                      fontSize: "1rem",
                    })}
                  >
                    {previewContentEditable({ value: section.label })}
                  </FateLabel>
                </Box>
              </Grid>
            </Grid>
            <Grid container>
              {section.blocks.map((block) => {
                const width: GridSize = !!block.meta.width
                  ? ((block.meta.width * 12) as GridSize)
                  : 12;
                return (
                  <Grid
                    item
                    xs={width}
                    key={block.id}
                    className={css({
                      pageBreakInside: "avoid",
                    })}
                  >
                    <Box my=".5rem" px=".5rem">
                      <BlockByType
                        advanced={false}
                        readonly={true}
                        dataCy={`character-card.${section.label}.${block.label}`}
                        block={block}
                        onChange={() => undefined}
                        onRoll={() => undefined}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </>
  );
}
