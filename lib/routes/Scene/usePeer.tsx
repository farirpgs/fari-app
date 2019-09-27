import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { IPeerAction } from "./IPeerAction";

export function usePeer(
  peerIdFromParams: string | undefined,
  handleDataReceiveFromGM: (action: IPeerAction) => void,
  handleDataReceiveFromPlayer: (action: IPeerAction) => void
) {
  const [peerId, setPeerId] = useState<string>(peerIdFromParams);
  const [connectionToGM, setConnectionToGM] = useState<Peer.DataConnection>(
    undefined
  );
  const [connectionsToPlayers, setConnectionsToPlayers] = useState<
    Array<Peer.DataConnection>
  >([]);
  const peer = useRef<Peer>(undefined);
  if (!peer.current) {
    peer.current = new Peer();
  }

  function sendToAllPlayers(action: IPeerAction) {
    connectionsToPlayers.forEach(connection => {
      connection.send(action);
    });
  }

  function sendToGM(action: IPeerAction) {
    connectionToGM.send(action);
  }

  useEffect(() => {
    const isPlayer = !!peerIdFromParams;
    if (isPlayer) {
      const connection = peer.current.connect(peerIdFromParams);
      connection.on("open", function() {
        setConnectionToGM(connection);
      });
      connection.on("close", function() {
        setConnectionToGM(undefined);
      });
      connection.on("data", function(data) {
        handleDataReceiveFromGM(data);
      });
    }

    function onPeerOpenCallback(id: string) {
      setPeerId(id);
    }

    function onConnectionCallback(connection: Peer.DataConnection) {
      setConnectionsToPlayers([...connectionsToPlayers, connection]);
      connection.on("data", data => {
        handleDataReceiveFromPlayer(data);
      });

      connection.on("close", () => {
        setConnectionsToPlayers(allConnections => {
          return allConnections.filter(c => {
            if (connection.peer !== c.peer) {
              return c;
            }
          });
        });
      });
    }

    function onPeerDisconnectedCallback() {
      console.log("Connection lost. Please reconnect");
    }

    function onPeerCloseCallback() {
      console.log("Connection destroyed");
    }

    function onPeerErrorCallback(error) {
      console.log(error);
    }

    peer.current.on("open", onPeerOpenCallback);
    peer.current.on("connection", onConnectionCallback);
    peer.current.on("disconnected", onPeerDisconnectedCallback);
    peer.current.on("close", onPeerCloseCallback);
    peer.current.on("error", onPeerErrorCallback);

    return () => {
      peer.current.off("open", onPeerOpenCallback);
      peer.current.off("connection", onConnectionCallback);
      peer.current.off("disconnected", onPeerDisconnectedCallback);
      peer.current.off("close", onPeerCloseCallback);
      peer.current.off("error", onPeerErrorCallback);
    };
  }, [
    peerIdFromParams,
    connectionsToPlayers,
    setConnectionsToPlayers,
    setPeerId
  ]);

  return {
    peerId,
    isConnectedToGM: !!connectionToGM,
    numberOfConnectedPlayers: connectionsToPlayers.length,
    sendToAllPlayers,
    sendToGM
  };
}
