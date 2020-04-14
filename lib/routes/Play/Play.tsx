import { Button, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Page } from "../../components/Page/Page";
import { usePeerConnections } from "./usePeerConnections";
import { usePeerHost } from "./usePeerHost";
import { usePeerJS } from "./usePeerJS";

const debug = false;

export const Play: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const id = props.match.params.id;
  const [nameInput, setNameInput] = useState("");

  const peerManager = usePeerJS({
    debug: debug,
  });
  const hostManager = usePeerHost({
    peer: peerManager.state.peer,
    onConnectionDataReceive() {},
    debug: debug,
  });
  const connectionsManager = usePeerConnections({
    id: id,
    hostId: peerManager.state.hostId,
    peer: peerManager.state.peer,
    onHostDataReceive() {},
    debug: debug,
  });

  // const isGM = !id;
  // const isPlayer = !isGM;

  const href = `/play/${peerManager.state.hostId}`;

  return (
    <Page h1="Create Your Character" appBarActions={<div></div>}>
      <br />
      <Button
        onClick={() => {
          hostManager.actions.sendToConnections({ LOL: 3 });
        }}
      >
        SEND TO CONNECTIONS
      </Button>
      <Typography>
        hostId: <a href={href}>{peerManager.state.hostId}</a>
      </Typography>
      <Typography>http://localhost:1234{href}</Typography>
      <Typography>
        isConnectedToHost:{" "}
        {connectionsManager.state.isConnectedToHost ? "true" : "false"}
      </Typography>
      <Typography>
        Connections: {hostManager.state.numberOfConnections}
      </Typography>
      <div>
        <TextField
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value.trim());
          }}
        ></TextField>
      </div>
    </Page>
  );
};

Play.displayName = "Play";
