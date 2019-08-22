import Snackbar from "@material-ui/core/Snackbar";
import SaveIcon from "@material-ui/icons/Save";
import React, { useCallback, useEffect, useState } from "react";
import { routerHistory } from "../..";
import { AppFab } from "../../components/AppFab/AppFab";
import { CharacterFields } from "../../components/CharacterFields/CharacterFields";
import { Page } from "../../components/Page/Page";
import { getCharactersDb } from "../../database/database";
import { getGameBySlug } from "../../games/games";
import { ICharacter } from "../../games/IGame";

export const PlayCharacter = props => {
  const { gameSlug, characterId } = props.match.params;
  const game = getGameBySlug(gameSlug);
  const [character, setCharacter] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await getCharactersDb(game).get<ICharacter>(characterId);
    setCharacter(result);
    setIsLoading(false);
  }, [gameSlug, characterId]);

  useEffect(() => {
    load();
  }, [load]);

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
        <AppFab onClick={save}>
          <SaveIcon />
        </AppFab>

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

  async function save() {
    await getCharactersDb(game).put(character, {});
    await load();
    setCharacterUpdatedSnackBar({ visible: true });
  }
};
