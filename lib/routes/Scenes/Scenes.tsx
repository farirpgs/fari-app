import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import LayersIcon from "@material-ui/icons/Layers";
import React, { useCallback, useEffect, useState } from "react";
import uuid from "uuid/v4";
import { routerHistory } from "../..";
import { AppFab } from "../../components/AppFab/AppFab";
import { AppLink } from "../../components/AppLink/AppLink";
import { Page } from "../../components/Page/Page";
import { getScenesDb } from "../../database/database";
import { IScene } from "../../root/AppRouter";

export const Scenes: React.FC<{}> = props => {
  const [newSceneName, setSceneName] = useState("");
  const [scenes, setScenes] = useState<Array<IScene>>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const hasItems = scenes && scenes.length > 0;

  const [sceneAddedSnackBar, setSceneAddedSnackBar] = React.useState({
    visible: false
  });
  const [sceneDeletedSnackBar, setSceneDeletedSnackBar] = React.useState({
    visible: false
  });
  const loadScenes = useCallback(async () => {
    setIsLoading(true);
    const result = await getScenesDb().allDocs({
      include_docs: true
    });
    setScenes((result.rows.map(row => row.doc) as unknown) as Array<IScene>);
    setIsLoading(false);
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
    <Page isLoading={isLoading} h1="Scenes">
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

      <AppFab
        onClick={() => {
          routerHistory.push("/scenes/create");
        }}
      >
        <AddIcon />
      </AppFab>

      {!hasItems && (
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
    </Page>
  );
};
