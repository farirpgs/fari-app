import React, { useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  TextField
} from "@material-ui/core";

export function useChat() {
  const cachedName = localStorage.getItem("name");
  const [name, setName] = useState(cachedName ?? "");

  function saveName(name: string) {
    setName(name);
    localStorage.setItem("name", name);
  }
  return {
    name,
    saveName
  };
}

export function useSceneChat() {
  interface IChatMessage {
    message: string;
    from: string;
  }
  const [chatItems, setChatItems] = useState<Array<IChatMessage>>([]);

  function addMessage(parameters: { message: string; from?: string }) {
    setChatItems(items => {
      return [
        ...items,
        {
          from: parameters.from ?? name,
          message: parameters.message,
          timestamp: new Date().getTime()
        }
      ];
    });
  }

  return {
    chatItems,
    send: addMessage
  };
}

const useStyle = makeStyles({
  chatContainer: {
    position: "fixed",
    zIndex: 1,
    bottom: "3.4rem",
    maxWidth: "100%",
    height: "auto",
    width: "300px",
    right: "0"
  },
  expansionPanel: {
    paddingBottom: ".2rem"
  },
  expansionPanelSummary: {
    boxShadow: "0 2px 1px rgba(0, 0, 0, .1)"
  },
  expansionPanelDetails: {
    padding: "1rem"
  },
  chatDetailsContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  chatDetailsMessages: {
    flex: "1",
    height: "8rem",
    maxHeight: "8rem",
    overflowY: "scroll"
  },
  chatDetailsControls: {
    flex: "0",
    borderTop: "1px solid rgba(0, 0, 0, .1)"
  }
});

export const Chat: React.FC<{}> = props => {
  const classes = useStyle(props);
  const chatManager = useChat();

  return (
    <div className={classes.chatContainer}>
      <ExpansionPanel className={classes.expansionPanel}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.expansionPanelSummary}
        >
          <span>Chat</span>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionPanelDetails}>
          <div className={classes.chatDetailsContainer}>
            <div className={classes.chatDetailsMessages}>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
              <div>Salut</div>
            </div>
            <div className={classes.chatDetailsControls}>
              <TextField
                label={
                  name === "" ? "What's your name ?" : "Write a message..."
                }
              />
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};
