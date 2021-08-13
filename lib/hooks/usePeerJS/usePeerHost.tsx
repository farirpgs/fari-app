import Peer from "peerjs";
import { useEffect, useState } from "react";
import { DataTransferObject } from "../../domains/data-transfer-object/DataTransferObject";
import { IPeerAction } from "./IPeerAction";
import { usePeerJS } from "./usePeerJS";

export function usePeerHost(options: {
  onConnectionDataReceive: (id: string, data: IPeerAction<any, any>) => void;
  debug?: boolean;
}) {
  const { peer, hostId, error, loading } = usePeerJS({ debug: options.debug });
  const [connections, setConnections] = useState<Array<Peer.DataConnection>>(
    []
  );

  useEffect(() => {
    function listenForConnections() {
      peer.on("connection", onPeerConnectionCallback);
      return () => {
        peer.off("connection", onPeerConnectionCallback);
      };
      function onPeerConnectionCallback(
        currentConnection: Peer.DataConnection
      ) {
        currentConnection.on("data", (data) => {
          const decodedData = DataTransferObject.decode(data);
          options.onConnectionDataReceive(currentConnection.label, decodedData);
        });
        currentConnection.on("open", () => {
          console.info(
            "usePeerHost: Opened new connnection",
            currentConnection.label
          );
          setConnections((connections) => {
            const connectionsWithoutCurrentInCaseItWasDisconnected =
              connections.filter((c) => c.label !== currentConnection.label);

            return [
              ...connectionsWithoutCurrentInCaseItWasDisconnected,
              currentConnection,
            ];
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
        currentConnection.on("error", () => {
          console.info(
            "usePeerHost: Error connection",
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
      hostId: hostId,
      loading,
      error: error,
      numberOfConnections: connections.length,
      connections: connections,
    },
    actions: {
      sendToConnections(data: any) {
        connections.forEach((connection) => {
          const encodedData = DataTransferObject.encode(data);
          connection.send(encodedData);
        });
      },
    },
  };
}
