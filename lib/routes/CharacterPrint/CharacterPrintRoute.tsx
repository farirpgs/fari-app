import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { ManagerMode } from "../../components/Manager/Manager";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { ICharacter, ISection, Position } from "../../domains/character/types";
import { useQuery } from "../../hooks/useQuery/useQuery";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { BlockByType } from "../Character/components/CharacterDialog/components/BlockByType";

export const CharacterPrintRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const history = useHistory();
  const charactersManager = useContext(CharactersContext);
  const [character, setCharacter] = useState<ICharacter | undefined>(undefined);
  const logger = useLogger();

  const query = useQuery<"dev">();
  const devMode = query.get("dev") === "true";

  useEffect(() => {
    logger.info("Route:CharacterPrint");
    if (!devMode) {
      window.print();
    }
  }, []);

  useEffect(() => {
    const characterToLoad = charactersManager.state.characters.find(
      (s) => s.id === props.match.params.id
    );

    if (characterToLoad) {
      setCharacter(characterToLoad);
    } else {
      history.replace("/");
      charactersManager.actions.openManager(ManagerMode.Manage);
    }
  }, [props.match.params.id, charactersManager.state.characters]);

  return (
    <>
      <PageMeta title={character?.name} />

      <Box bgcolor={theme.palette.background.paper} mt="1rem">
        <Container>
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
  const headerBackgroundColor = useTextColors(theme.palette.background.paper)
    .primary;
  return (
    <>
      <Box mb="1rem">
        <Grid container>
          <Grid item>
            <Typography variant="h4"> {props.character?.name}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box>
        {props.character?.pages.map((page, pageIndex) => {
          const leftSections = page.sections.filter(
            (s) => s.position === Position.Left
          );
          const rightSections = page.sections.filter(
            (s) => s.position === Position.Right
          );
          return (
            <Box key={pageIndex}>
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
  const headerBackgroundColor = useTextColors(theme.palette.background.paper)
    .primary;

  return (
    <>
      {props.sections.map((section, sectionIndex) => {
        return (
          <Box key={sectionIndex}>
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
            {section.blocks.map((block, blockIndex) => {
              return (
                <Box key={blockIndex} my=".5rem" px=".5rem">
                  <BlockByType
                    advanced={false}
                    readonly={true}
                    dataCy={`character-card.${section.label}.${block.label}`}
                    block={block}
                    onChange={() => undefined}
                    onDuplicate={() => undefined}
                    onRemove={() => undefined}
                  />
                </Box>
              );
            })}
          </Box>
        );
      })}
    </>
  );
}
