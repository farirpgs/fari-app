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
} from "../../../../contexts/ScenesContext";

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
          const abrev = getAbrev(scene.name);
          const backgroundColor = getColor(abrev);
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
                secondary={formatDate(scene.lastUpdated)}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

ScenesManager.displayName = "ScenesManager";

function formatDate(timestamp: number) {
  try {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = new Date(timestamp).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  } catch (error) {
    return new Date(timestamp).toString();
  }
}

function getColor(str: string) {
  let hash = 0;
  let i;

  for (i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let colour = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += `00${value.toString(16)}`.substr(-2);
  }

  return colour;
}

function getAbrev(str: string) {
  const [first, second] = str.split("");

  if (first && second) {
    return first + second;
  }
  return first;
}
