import {
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from "@material-ui/core";
import { css } from "emotion";
import React, { useContext } from "react";
import {
  ISavableScene,
  ScenesContext,
} from "../../../../../contexts/ScenesContext";
import { SceneListItem } from "./domains/SceneListItem";

type IProps = {
  open: boolean;
  onLoad(scene: ISavableScene): void;
  onClose(): void;
};

export const ScenesManager: React.FC<IProps> = (props) => {
  const scenesManager = useContext(ScenesContext);
  const theme = useTheme();

  return (
    <Drawer anchor={"right"} open={props.open} onClose={props.onClose}>
      <List>
        {scenesManager.state.scenes.map((scene) => {
          const abrev = SceneListItem.getAbreviation(scene.name);
          const backgroundColor = SceneListItem.getColor(abrev);
          const color = theme.palette.getContrastText(backgroundColor);
          return (
            <ListItem
              button
              key={scene.id}
              onClick={() => {
                props.onLoad(scene);
              }}
            >
              <ListItemAvatar>
                <Avatar
                  className={css({
                    color: color,
                    backgroundColor: backgroundColor,
                  })}
                >
                  {abrev}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={scene.name}
                secondary={SceneListItem.formatDate(scene.lastUpdated)}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

ScenesManager.displayName = "ScenesManager";
