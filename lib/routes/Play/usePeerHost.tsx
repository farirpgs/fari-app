import Peer from "peerjs";
import { useEffect, useState } from "react";

export function usePeerHost(options: {
  onConnectionDataReceive: (data: any) => void;
  peer: Peer;
  debug?: boolean;
}) {
  const [connections, setConnections] = useState<Array<Peer.DataConnection>>(
    []
  );
  useEffect(() => {
    function listenForConnections() {
      options.peer.on("connection", onPeerConnectionCallback);
      return () => {
        options.peer.off("connection", onPeerConnectionCallback);
      };
      function onPeerConnectionCallback(
        currentConnection: Peer.DataConnection
      ) {
        currentConnection.on("data", (data) => {
          console.log(data);
        });
        currentConnection.on("open", () => {
          setConnections((connections) => {
            return [...connections, currentConnection];
          });
        });
        currentConnection.on("close", () => {
          setConnections((connections) => {
            return connections.filter(
              (c) => c.label !== currentConnection.label
            );
          });
        });
      }
    }
    return listenForConnections();
  }, []);

  useEffect(() => {
    function subscribeConnectionDataReceive() {
      connections.forEach((c) => c.on("data", options.onConnectionDataReceive));
      return () => {
        connections.forEach((c) =>
          c.off("data", options.onConnectionDataReceive)
        );
      };
    }
    return subscribeConnectionDataReceive();
  }, [connections]);

  return {
    state: {
      numberOfConnections: connections.length,
    },
    actions: {
      sendToConnections(action: any) {
        debugger;
        connections.forEach((connection) => {
          connection.send(action);
        });
      },
    },
  };
}
