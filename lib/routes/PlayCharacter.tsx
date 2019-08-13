import Snackbar from "@material-ui/core/Snackbar";
import SaveIcon from "@material-ui/icons/Save";
import React, { useCallback, useEffect, useState } from "react";
import { AppFab } from "../components/AppFab";
import { AppLink } from "../components/AppLink";
import { AppProgress } from "../components/AppProgress";
import { CharacterFields } from "../components/CharacterFields";
import { getCharactersDb } from "../database/database";
import { getGameBySlug } from "../games/games";
import { ICharacter } from "../games/IGame";

export const PlayCharacter = props => {
  const { gameSlug, characterId } = props.match.params;
  const game = getGameBySlug(gameSlug);
  const [character, setCharacter] = useState({});
  const isLoading = Object.keys(character).length === 0;

  const load = useCallback(async () => {
    const result = await getCharactersDb(game).get<ICharacter>(characterId);
    setCharacter(result);
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

  return (
    <div>
      {isLoading && <AppProgress />}
      <div className="route-box">
        <h1>Play Character</h1>
        <h2>
          <AppLink to={`/game/${game.slug}`}>All Characters</AppLink>
        </h2>
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

        {!isLoading && (
          <div className="row">
            <div className="col-xs-12">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );

  async function save() {
    await getCharactersDb(game).put(character, {});
    await load();
    setCharacterUpdatedSnackBar({ visible: true });
  }
};
