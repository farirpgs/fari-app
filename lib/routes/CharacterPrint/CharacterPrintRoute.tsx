import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ManagerMode } from "../../components/Manager/Manager";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import {
  BlockType,
  ICharacter,
  ISection,
  Position,
} from "../../domains/character/types";
import { Font } from "../../domains/font/Font";
import { useQuery } from "../../hooks/useQuery/useQuery";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { BlockDicePool } from "../Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { BlockPointCounter } from "../Character/components/CharacterDialog/components/blocks/BlockPointCounter";
import { BlockRichText } from "../Character/components/CharacterDialog/components/blocks/BlockRichText";
import { BlockSkill } from "../Character/components/CharacterDialog/components/blocks/BlockSkill";
import { BlockSlotTracker } from "../Character/components/CharacterDialog/components/blocks/BlockSlotTracker";
import { BlockText } from "../Character/components/CharacterDialog/components/blocks/BlockText";

export const CharacterPrintRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const history = useHistory();
  const charactersManager = useContext(CharactersContext);
  const [character, setSelectedCharacter] = useState<ICharacter | undefined>(
    undefined
  );
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
      setSelectedCharacter(characterToLoad);
    } else {
      history.replace("/");
      charactersManager.actions.openManager(ManagerMode.Manage);
    }
  }, [props.match.params.id, charactersManager.state.characters]);

  return (
    <>
      <PageMeta
        title={character?.name || t("characters-route.title")}
        description={t("characters-route.description")}
      />

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
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);

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
              <Grid container spacing={0}>
                <Grid
                  item
                  xs={6}
                  className={css({
                    borderRight: `2px solid ${headerBackgroundColors.primary}`,
                  })}
                >
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
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);

  return (
    <>
      {props.sections.map((section, sectionIndex) => {
        return (
          <Box key={sectionIndex}>
            <Grid container>
              <Grid item xs>
                <Box
                  className={css({
                    background: headerBackgroundColors.primary,
                    color: headerColor,
                    width: "100%",
                    padding: ".1rem .5rem",
                    textTransform: "uppercase",
                    fontWeight: theme.typography.fontWeightBold,
                    fontSize: "1.4em",
                    lineHeight: Font.lineHeight(1.4),
                  })}
                >
                  {section.label}
                </Box>
              </Grid>
            </Grid>
            {section.blocks.map((block, blockIndex) => {
              return (
                <Box key={blockIndex} my=".5rem" px=".5rem">
                  {block.type === BlockType.Text && (
                    <BlockText
                      editing={false}
                      readonly={true}
                      pageIndex={0}
                      sectionIndex={0}
                      section={section}
                      block={block}
                      blockIndex={blockIndex}
                      onLabelChange={(value) => {}}
                      onValueChange={(value) => {}}
                      onMetaChange={(meta) => {}}
                    />
                  )}
                  {block.type === BlockType.RichText && (
                    <BlockRichText
                      editing={false}
                      readonly={true}
                      pageIndex={0}
                      sectionIndex={0}
                      section={section}
                      block={block}
                      blockIndex={blockIndex}
                      onLabelChange={(value) => {}}
                      onValueChange={(value) => {}}
                      onMetaChange={(meta) => {}}
                    />
                  )}
                  {block.type === BlockType.Skill && (
                    <BlockSkill
                      editing={false}
                      readonly={true}
                      pageIndex={0}
                      sectionIndex={0}
                      section={section}
                      block={block}
                      blockIndex={blockIndex}
                      onLabelChange={(value) => {}}
                      onValueChange={(value) => {}}
                      onMetaChange={(meta) => {}}
                      onSkillClick={(options, commands) => {}}
                    />
                  )}
                  {block.type === BlockType.DicePool && (
                    <BlockDicePool
                      editing={false}
                      readonly={true}
                      pageIndex={0}
                      sectionIndex={0}
                      section={section}
                      block={block}
                      blockIndex={blockIndex}
                      onLabelChange={(value) => {}}
                      onValueChange={(value) => {}}
                      onMetaChange={(meta) => {}}
                      pool={[]}
                      onPoolClick={(element) => {}}
                    />
                  )}
                  {block.type === BlockType.PointCounter && (
                    <BlockPointCounter
                      editing={false}
                      readonly={true}
                      pageIndex={0}
                      sectionIndex={0}
                      section={section}
                      block={block}
                      blockIndex={blockIndex}
                      onLabelChange={(value) => {}}
                      onValueChange={(value) => {}}
                      onMetaChange={(meta) => {}}
                    />
                  )}

                  {block.type === BlockType.SlotTracker && (
                    <BlockSlotTracker
                      editing={false}
                      readonly={true}
                      pageIndex={0}
                      sectionIndex={0}
                      section={section}
                      block={block}
                      blockIndex={blockIndex}
                      onLabelChange={(value) => {}}
                      onValueChange={(value) => {}}
                      onMetaChange={(meta) => {}}
                      onAddBox={() => {}}
                      onRemoveBox={() => {}}
                      onToggleBox={(boxIndex) => {}}
                      onBoxLabelChange={(boxIndex, value) => {}}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </>
  );
}
