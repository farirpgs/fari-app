import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import LayersIcon from "@material-ui/icons/Layers";
import SaveIcon from "@material-ui/icons/Save";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import uuid from "uuid/v4";
import { AppFab } from "../components/AppFab";
import { AppLink } from "../components/AppLink";
import { AppProgress } from "../components/AppProgress";
import { getScenesDb } from "../database/database";
import { Characters } from "../routes/Characters";
import { CreateCharacter } from "../routes/CreateCharacter";
import { Dices } from "../routes/Dices";
import { Games } from "../routes/Games";
import { NotFoundRoute } from "../routes/NotFoundRoute";
import { PlayCharacter } from "../routes/PlayCharacter";

interface IScene {
  _id: string;
  _rev: string;
  name: string;
  postIts?: Array<{
    content: string;
  }>;
}
const Scene: React.FC<{ match: { params: { sceneId: string } } }> = props => {
  const { sceneId } = props.match.params;
  const [scene, setScene] = useState<IScene>(undefined);
  const isLoading = scene === undefined;

  const [sceneUpdatedSnackBar, setSceneUpdatedSnackBar] = React.useState({
    visible: false
  });

  const loadScenes = useCallback(async () => {
    const result = await getScenesDb().get<IScene>(sceneId);
    setScene(result);
  }, [sceneId]);

  const save = () => {
    console.log("save");
  };

  useEffect(() => {
    loadScenes();
  }, [loadScenes]);

  return (
    <div>
      {isLoading && <AppProgress />}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={sceneUpdatedSnackBar.visible}
        onClose={() => setSceneUpdatedSnackBar({ visible: false })}
        message={<span id="message-id">Scene Updated</span>}
      />
      {!isLoading && (
        <div className="row">
          <div className="col-xs-12">
            <div>
              <h1>{scene.name}</h1>
              <h2>Scene</h2>
              <AppFab onClick={save}>
                <SaveIcon />
              </AppFab>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Scenes: React.FC<{}> = props => {
  const [newSceneName, setSceneName] = useState("");
  const [scenes, setScenes] = useState<Array<IScene>>(undefined);
  const isLoading = scenes === undefined;
  const hasItems = scenes && scenes.length > 0;
  const shouldShowEmptyNotice = !isLoading && !hasItems;

  const [sceneAddedSnackBar, setSceneAddedSnackBar] = React.useState({
    visible: false
  });
  const [sceneDeletedSnackBar, setSceneDeletedSnackBar] = React.useState({
    visible: false
  });

  const loadScenes = useCallback(async () => {
    const result = await getScenesDb().allDocs({
      include_docs: true
    });
    setScenes((result.rows.map(row => row.doc) as unknown) as Array<IScene>);
  }, []);

  const addScene = async (sceneName: string) => {
    await getScenesDb().put({
      _id: uuid(),
      name: newSceneName
    });
    await loadScenes();
    setSceneAddedSnackBar({ visible: true });
  };
  const deleteCharacter = async (scene: IScene) => {
    await getScenesDb().remove(scene._id, scene._rev, {});
    await loadScenes();
    setSceneDeletedSnackBar({ visible: true });
  };

  useEffect(() => {
    loadScenes();
  }, [loadScenes]);

  return (
    <div>
      {isLoading && <AppProgress />}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={sceneAddedSnackBar.visible}
        onClose={() => setSceneAddedSnackBar({ visible: false })}
        message={<span id="message-id">Scene Added</span>}
      />
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={sceneDeletedSnackBar.visible}
        onClose={() => setSceneDeletedSnackBar({ visible: false })}
        message={<span id="message-id">Scene Deleted</span>}
      />
      <div className="route-box">
        <h1>Scenes</h1>

        <div className="row end-xsx">
          <div className="col-xs-6">
            <TextField
              value={newSceneName}
              label="Add a new scene"
              variant="outlined"
              style={{
                width: "100%"
              }}
              onChange={e => {
                setSceneName(e.target.value);
              }}
            />
          </div>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              addScene(newSceneName);
            }}
          >
            Add
          </Button>
        </div>
        <br />

        {shouldShowEmptyNotice && (
          <Paper style={{ padding: "2rem", background: "aliceblue" }}>
            It seems you don't have any scenes created yet.
          </Paper>
        )}

        {hasItems && (
          <div>
            <div className="row">
              <div className="col-xs-12 col-md-4">
                <List component="nav">
                  {scenes.map((scene, index) => (
                    <AppLink to={`/scenes/${scene._id}`} key={scene._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <LayersIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={scene["name"]} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={async e => {
                              e.stopPropagation();
                              e.preventDefault();

                              deleteCharacter(scene);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index !== scenes.length - 1 && <Divider />}
                    </AppLink>
                  ))}
                </List>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AppRouter = () => (
  <Switch>
    <Route exact path={"/"} component={Games} />
    <Route exact path={"/games"} component={Games} />
    <Route exact path={"/game/:gameSlug"} component={Characters} />
    <Route exact path={"/game/:gameSlug/create"} component={CreateCharacter} />
    <Route exact path={"/dices"} component={Dices} />
    <Route exact path={"/scenes"} component={Scenes} />
    <Route exact path={"/scenes/:sceneId"} component={Scene} />
    <Route
      exact
      path={"/game/:gameSlug/play/:characterId"}
      component={PlayCharacter}
    />
    <Route path="*" component={NotFoundRoute} status={404} />
  </Switch>
);
