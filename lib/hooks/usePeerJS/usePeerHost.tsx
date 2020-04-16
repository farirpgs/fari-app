import Peer from "peerjs";
import { useEffect, useState } from "react";

export function usePeerHost(options: {
  onConnectionDataReceive: (id: string, data: any) => void;
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
          options.onConnectionDataReceive(currentConnection.label, data);
        });
        currentConnection.on("open", () => {
          console.info(
            "usePeerHost: Opened new connnection",
            currentConnection.label
          );
          setConnections((connections) => {
            return [...connections, currentConnection];
          });
        });
        currentConnection.on("close", () => {
          console.info(
            "usePeerHost: Close connection",
            currentConnection.label
          );
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

  return {
    state: {
      numberOfConnections: connections.length,
      connections: connections,
    },
    actions: {
      sendToConnections(data: any) {
        connections.forEach((connection) => {
          connection.send(data);
        });
      },
    },
  };
}
