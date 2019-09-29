import { Fab } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";
import AddIcon from "@material-ui/icons/Add";
import WifiIcon from "@material-ui/icons/Wifi";
import DeleteIcon from "@material-ui/icons/Delete";
import LayersIcon from "@material-ui/icons/Layers";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { AppLink } from "../../components/AppLink/AppLink";
import { AppPaper } from "../../components/AppPaper/AppPaper";
import { Banner } from "../../components/Banner/Banner";
import { routerHistory } from "../../components/History/History";
import { Page } from "../../components/Page/Page";
import { SceneService } from "../../services/scene-service/SceneService";
import { IScene } from "../../types/IScene";
import { defaultArcName } from "./defaultArcName";
import { IGroupedScenes } from "./IGroupedScenes";
import * as selectors from "./sceneSelectors";
import { liveLinks } from "../../singletons/liveLinks";
import { green } from "@material-ui/core/colors";

export const Scenes: React.FC<{}> = props => {
  const [groupedScenes, setGroupedScenes] = useState<IGroupedScenes>({});
  const [isLoading, setIsLoading] = useState(true);
  const [sceneAddedSnackBar, setSceneAddedSnackBar] = React.useState({
    visible: false
  });
  const [sceneDeletedSnackBar, setSceneDeletedSnackBar] = React.useState({
    visible: false
  });

  const hasItems = Object.keys(groupedScenes).length > 0;
  const hasLiveLinks = liveLinks.length !== 0;

  const loadScenes = async () => {
    setIsLoading(true);
    const scenes = await new SceneService().getAll();
    const groupedScenes = selectors.groupScenesByCampaign(scenes);

    setGroupedScenes(groupedScenes);
    setIsLoading(false);
  };

  const deleteScene = async (scene: IScene) => {
    new SceneService().remove(scene);
    await loadScenes();
    setSceneDeletedSnackBar({ visible: true });
  };

  useEffect(() => {
    loadScenes();
  }, []);

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

      {hasLiveLinks && (
        <div className="margin-1">
          <AppPaper>
            <div className="row">
              <div className="col-xs-12">
                <List component="nav">
                  {liveLinks.map(link => {
                    const truncatedDescription = _.truncate(link.description, {
                      length: 50
                    });
                    return (
                      <AppLink to={link.url} key={link.url}>
                        <ListItem
                          button
                          style={{
                            zoom: "1.2"
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar style={{ background: green[400] }}>
                              <WifiIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={link.label}
                            secondary={truncatedDescription}
                          />
                        </ListItem>
                      </AppLink>
                    );
                  })}
                </List>
              </div>
            </div>
          </AppPaper>
        </div>
      )}

      {!hasItems && (
        <Banner variant="info">
          <div>
            You didn't create any scenes yet.
            <br />
            Click on button below to add a get started!
          </div>
        </Banner>
      )}

      <div className="row center-xs margin-1">
        <div className="col-xs">
          <Fab
            onClick={() => {
              routerHistory.push("/scenes/create");
            }}
            variant="extended"
            color="primary"
          >
            <AddIcon style={{ marginRight: " .5rem" }} />
            Add a scene
          </Fab>
        </div>
      </div>

      {hasItems && (
        <AppPaper>
          <div className="row">
            <div className="col-xs-12">
              <List component="nav">
                {Object.keys(groupedScenes).map((arcName, index) => (
                  <div key={index} className="margin-1">
                    {arcName !== defaultArcName && (
                      <div
                        style={{
                          fontSize: "1.5rem"
                        }}
                      >
                        {arcName}
                      </div>
                    )}

                    {groupedScenes[arcName].map(scene => {
                      const truncatedDescription = _.truncate(
                        scene.description,
                        {
                          length: 50
                        }
                      );
                      return (
                        <AppLink to={`/scenes/${scene._id}`} key={scene._id}>
                          <ListItem
                            button
                            style={{
                              zoom: "1.2"
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <LayersIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={scene.name}
                              secondary={truncatedDescription}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={async e => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  deleteScene(scene);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </AppLink>
                      );
                    })}
                  </div>
                ))}
              </List>
            </div>
          </div>
        </AppPaper>
      )}
    </Page>
  );
};
