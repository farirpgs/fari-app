import { IconButton } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import SaveIcon from "@material-ui/icons/Save";
import React, { useEffect, useState } from "react";
import { CharacterFields } from "../../components/CharacterFields/CharacterFields";
import { routerHistory } from "../../components/History/History";
import { Page } from "../../components/Page/Page";
import { getGameBySlug } from "../../games/getGameBySlug";
import { CharacterService } from "../../services/character-service/CharacterService";
import { ICharacter } from "../../types/ICharacter";

export const PlayCharacter = props => {
  const { gameSlug, characterId } = props.match.params;
  const game = getGameBySlug(gameSlug);
  const [character, setCharacter] = useState<ICharacter>({} as any);
  const [isLoading, setIsLoading] = useState(true);

  const load = async (characterId: string) => {
    if (!character._id) {
      setIsLoading(true);
    }
    const result = await new CharacterService().get(characterId);
    setCharacter(result);
    setIsLoading(false);
  };

  async function save() {
    await new CharacterService().update(character);
    await load(characterId);
    setCharacterUpdatedSnackBar({ visible: true });
  }

  useEffect(() => {
    load(characterId);
  }, [gameSlug, characterId]);

  const characterWasJustCreated = location.search.indexOf("new=true") !== -1;
  const [
    characterCreatedSnackBar,
    setCharacterCreatedSnackBar
  ] = React.useState({ visible: characterWasJustCreated });
  const [
    characterUpdatedSnackBar,
    setCharacterUpdatedSnackBar
  ] = React.useState({ visible: false });

  const characterName = character["name"] || "";
  return (
    <Page
      isLoading={isLoading}
      h1={characterName}
      backFunction={() => {
        routerHistory.push(`/game/${game.slug}`);
      }}
      appBarActions={
        <div>
          <IconButton edge="end" onClick={save} color="inherit">
            <SaveIcon />
          </IconButton>
        </div>
      }
    >
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={characterCreatedSnackBar.visible}
        onClose={() => setCharacterCreatedSnackBar({ visible: false })}
        message={<span id="message-id">Character Created</span>}
      />
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={characterUpdatedSnackBar.visible}
        onClose={() => setCharacterUpdatedSnackBar({ visible: false })}
        message={<span id="message-id">Character Updated</span>}
      />
      <div>
        <CharacterFields
          rows={game.rows}
          character={character}
          setCharacter={async character => {
            setCharacter(character);
          }}
          onSubmit={save}
        />
      </div>
    </Page>
  );
};
