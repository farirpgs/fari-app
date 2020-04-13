import { TextField, Typography } from "@material-ui/core";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { Page } from "../../components/Page/Page";

export const Play: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const id = props.match.params.id;
  const [nameInput, setNameInput] = useState("");
  const peerManager = usePeerJS({
    id,
    onChange: (data) => {
      console.debug(data);
    },
  });

  const isGM = !id;
  const isPlayer = !isGM;

  const href = `/play/${peerManager.state.hostId}`;
  //   useEffect(() => {
  //     const intervalId = setInterval(() => {
  //       peerManager.actions.sendToConnections({ lol: 3 });
  //     }, 2000);
  //     return () => {
  //       clearInterval(intervalId);
  //     };
  //   }, []);

  return (
    <Page h1="Create Your Character" appBarActions={<div></div>}>
      <br />
      <Typography>
        hostId: <a href={href}>{peerManager.state.hostId}</a>
      </Typography>
      <Typography>{href}</Typography>
      <Typography>
        isConnectedToHost: {peerManager.state.isConnectedToHost}
      </Typography>
      <Typography>
        Connections: {peerManager.state.numberOfConnections}
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

function usePeerJS(options: { id?: string; onChange: (data: any) => void }) {
  const peer = useRef<Peer>(undefined);
  const [hostId, setHostId] = useState<string>(undefined);
  const [connectionToHost, setConnectionToHost] = useState<Peer.DataConnection>(
    undefined
  );
  const [connections, setConnections] = useState<Array<Peer.DataConnection>>(
    []
  );

  useEffect(() => {
    function setupPeer() {
      peer.current = new Peer(undefined, { debug: 3 });
      if (!options.id) {
        return setupHasHost();
      } else {
        return setupAsConnection();
      }
    }

    function setupHasHost() {
      console.debug("Host: Setup");

      peer.current.on("open", onPeerOpenCallback);
      peer.current.on("disconnected", onPeerDisconnectedCallback);
      peer.current.on("close", onPeerCloseCallback);
      peer.current.on("error", onPeerErrorCallback);

      return () => {
        peer.current.off("open", onPeerOpenCallback);
        peer.current.off("disconnected", onPeerDisconnectedCallback);
        peer.current.off("close", onPeerCloseCallback);
        peer.current.off("error", onPeerErrorCallback);
      };

      function onPeerOpenCallback(id: string) {
        setHostId(id);
        console.debug("Host: Connection Established");
      }
      function onPeerDisconnectedCallback() {
        setHostId(undefined);
        console.debug("Host: Connection lost. Please reconnect");
      }
      function onPeerCloseCallback() {
        setHostId(undefined);
        console.debug("Host: Connection destroyed");
      }
      function onPeerErrorCallback(error: any) {
        setHostId(undefined);
        console.debug("Host: Error", error);
      }
    }

    function setupAsConnection() {
      console.debug("Connection: Setup");

      const connection = peer.current.connect(options.id);
      connection.on("open", onConnectionOpen);
      connection.on("close", onConnectionClose);
      connection.on("data", onConnectionData);
      return () => {
        connection.off("open", onConnectionOpen);
        connection.off("close", onConnectionClose);
        connection.off("data", onConnectionData);
      };

      function onConnectionOpen() {
        debugger;
        setConnectionToHost(connection);
        console.debug("Connection: Connected To Host");
      }
      function onConnectionClose() {
        setConnectionToHost(undefined);
        console.debug("Connection: Disconnected From Host");
      }
      function onConnectionData(data: any) {
        console.debug("Connection: Received Data", data);
      }
    }
    setupPeer();
  }, [options.id]);

  useEffect(() => {
    function subscribeConnectionToChanges() {
      connections.forEach((c) => c.on("data", options.onChange));
      return () => {
        connections.forEach((c) => c.off("data", options.onChange));
      };
    }

    return subscribeConnectionToChanges();
  }, [connections]);

  useEffect(() => {
    function setupConnectionSetterOnLoad() {
      const id = setInterval(() => {
        if (!!peer.current) {
          console.debug("peer.current.connections", peer.current.connections);
          const activeConnections = Object.keys(peer.current.connections)
            .map((id) => {
              const [connection] = peer.current.connections[id];
              return connection;
            })
            .filter((c) => c !== undefined);

          setConnections(activeConnections);
        }
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }
    return setupConnectionSetterOnLoad();
  }, []);

  return {
    state: {
      hostId,
      isConnectedToHost: !!connectionToHost,
      numberOfConnections: connections.length,
    },
    actions: {
      sendToHost(action: any) {
        connectionToHost.send(action);
      },
      sendToConnections(action: any) {
        connections.forEach((connection) => {
          connection.send(action);
        });
      },
    },
  };
}

Play.displayName = "Play";
