import Snackbar from "@material-ui/core/Snackbar";
import SaveIcon from "@material-ui/icons/Save";
import React, { useCallback, useEffect, useState } from "react";
import { AppFab } from "../components/AppFab";
import { AppLink } from "../components/AppLink";
import { AppProgress } from "../components/AppProgress";
import { charactersDb } from "../database/database";
import { getGameBySlug } from "../games/games";
import { ICharacter } from "../games/IGame";
import { CharacterFields } from "./CharacterFields";

export const PlayCharacter = props => {
  const { gameSlug, characterId } = props.match.params;
  const game = getGameBySlug(gameSlug);
  const [character, setCharacter] = useState({});
  const isLoading = Object.keys(character).length === 0;

  const load = useCallback(async () => {
    const result = await charactersDb.get<ICharacter>(characterId);
    setCharacter(result);
  }, [gameSlug, characterId]);

  useEffect(() => {
    load();
  }, [load]);

  const [snackOpened, setSnackOpened] = React.useState(false);

  return (
    <div>
      {isLoading && <AppProgress />}
      <div className="route-box">
        <h1>Play Character</h1>
        <h2>
          <AppLink to={`/g/${game.slug}`}>All Characters</AppLink>
        </h2>
        <Snackbar
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackOpened}
          onClose={() => setSnackOpened(false)}
          message={<span id="message-id">Character Updated</span>}
        />

        {!isLoading && (
          <div className="row">
            <div className="col-xs-12">
              <div>
                <AppFab onClick={save}>
                  <SaveIcon />
                </AppFab>
                <br />
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
    await charactersDb.put(character, {});
    await load();
    setSnackOpened(true);
  }
};
