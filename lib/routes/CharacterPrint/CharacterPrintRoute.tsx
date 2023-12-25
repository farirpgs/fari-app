import {
  Box,
  Container,
  Grid,
  GridSize,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { ICharacter, ISection } from "../../domains/character/types";
import { ManagerBox } from "../Character/components/CharacterDialog/CharacterV3Dialog";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../Character/components/CharacterDialog/MiniThemeContext";
import { BlockByType } from "../Character/components/CharacterDialog/components/BlockByType";
function CharacterPrintRoute() {
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
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
      (s) => s.id === params.id,
    );

    if (characterToLoad) {
      setCharacter(characterToLoad);
    } else {
      navigate("/", {
        replace: true,
      });
      myBinderManager.actions.open({ folder: "characters" });
    }
  }, [params.id, charactersManager.state.characters]);

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
}

CharacterPrintRoute.displayName = "CharacterPrintRoute";
export default CharacterPrintRoute;

function PrintCharacter(props: { character: ICharacter | undefined }) {
  const theme = useTheme();
  const miniTheme = useMiniTheme({
    character: props.character,
    enforceBackground: theme.palette.background.paper,
  });
  return (
    <>
      <MiniThemeContext.Provider value={miniTheme}>
        <style>{miniTheme.style}</style>
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
            return (
              <Box
                key={pageIndex}
                sx={{
                  pageBreakAfter: "always",
                  marginBottom: "1rem",
                }}
              >
                <Box
                  sx={{
                    borderBottom: `1px solid ${miniTheme.borderColor}`,
                    width: "100%",
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      marginRight: "1rem",
                      width: "auto",
                      padding: ".5rem 1rem",
                      borderBottom: `4px solid ${miniTheme.textPrimary}`,
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: miniTheme.pageHeadingFontFamily,
                        fontSize: `${miniTheme.pageHeadingFontSize}rem`,
                        fontWeight: miniTheme.pageHeadingFontWeight,
                      }}
                    >
                      {previewContentEditable({ value: page.label })}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  {page.rows.map((row, rowIndex) => {
                    const columnSize = Math.floor(12 / row.columns.length);
                    return (
                      <ManagerBox
                        key={rowIndex}
                        readonly={true}
                        label={<>Row #{rowIndex + 1}</>}
                      >
                        {row.columns.length > 0 && (
                          <Grid container>
                            {row.columns.map((column, columnIndex) => {
                              return (
                                <Grid
                                  item
                                  key={columnIndex}
                                  // xs={12}
                                  xs={columnSize as GridSize}
                                >
                                  <ManagerBox
                                    readonly={true}
                                    label={<>Column #{columnIndex + 1}</>}
                                  >
                                    {column.sections.map((section) => {
                                      return (
                                        <PrintSections
                                          key={section.id}
                                          section={section}
                                        />
                                      );
                                    })}
                                  </ManagerBox>
                                </Grid>
                              );
                            })}
                          </Grid>
                        )}
                      </ManagerBox>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </MiniThemeContext.Provider>
    </>
  );
}

function PrintSections(props: { section: ISection }) {
  const miniTheme = useContext(MiniThemeContext);

  return (
    <>
      <Box
        sx={{
          pageBreakInside: "avoid",
        }}
      >
        <Grid container>
          <Grid item xs>
            <Box
              sx={{
                background: miniTheme.hideSectionBackground
                  ? undefined
                  : miniTheme.textPrimary,

                color: miniTheme.hideSectionBackground
                  ? miniTheme.textPrimary
                  : miniTheme.textPrimaryInverted,
                width: "100%",
                padding: miniTheme.hideSectionBackground ? "0 .5rem" : ".5rem",
              }}
            >
              <Typography
                noWrap
                sx={{
                  fontFamily: miniTheme.sectionHeadingFontFamily,
                  fontSize: `${miniTheme.sectionHeadingFontSize}rem`,
                  fontWeight: miniTheme.sectionHeadingFontWeight,
                }}
              >
                {previewContentEditable({
                  value: props.section.label,
                }) || " "}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          {props.section.blocks.map((block) => {
            const width: GridSize = !!block.meta.width
              ? ((block.meta.width * 12) as GridSize)
              : 12;
            return (
              <Grid
                item
                xs={width}
                key={block.id}
                sx={{
                  pageBreakInside: "avoid",
                }}
              >
                <Box my=".5rem" px=".5rem">
                  <BlockByType
                    advanced={false}
                    readonly={true}
                    dataCy={`character-card.${props.section.label}.${block.label}`}
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
    </>
  );
}
