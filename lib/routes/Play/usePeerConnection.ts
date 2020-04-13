import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { IPeerAction } from "../types/IPeerAction";

export type IPeerConnectionManager = ReturnType<typeof usePeerConnection>;

export function usePeerConnection(
  peedId: string,
  handleDataReceiveFromHost: (action: IPeerAction) => void,
  options: { disabled: boolean }
) {
  const [connectionToHost, setConnectionToHost] = useState<Peer.DataConnection>(
    undefined
  );
  const peer = useRef<Peer>(undefined);
  if (!peer.current && !options.disabled) {
    peer.current = new Peer();
  }
  useEffect(() => {
    if (options.disabled) {
      return;
    }
    const connection = peer.current.connect(peedId);
    function onConnectionOpen() {
      setConnectionToHost(connection);
    }
    function onConnectionClose() {
      setConnectionToHost(undefined);
    }
    function onConnectionData(data) {
      handleDataReceiveFromHost(data);
    }
    connection.on("open", onConnectionOpen);
    connection.on("close", onConnectionClose);
    connection.on("data", onConnectionData);
    return () => {
      connection.off("open", onConnectionOpen);
      connection.off("close", onConnectionClose);
      connection.off("data", onConnectionData);
    };
  }, [peedId]);

  return {
    isConnectedToHost: !!connectionToHost,
    sendToGM: (action: IPeerAction) => {
      if (!!connectionToHost) {
        connectionToHost.send(action);
      }
    },
  };
}
