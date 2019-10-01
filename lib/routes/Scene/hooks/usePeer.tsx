import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { IPeerAction } from "../types/IPeerAction";

export type IPeerManager = ReturnType<typeof usePeer>;

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

  function addPlayerConnection(connection: Peer.DataConnection) {
    setConnectionsToPlayers(allConnections => {
      return [...allConnections, connection];
    });
  }

  function removePlayerConnection(connection: Peer.DataConnection) {
    setConnectionsToPlayers(allConnections => {
      return allConnections.filter(c => {
        if (connection.peer !== c.peer) {
          return c;
        }
      });
    });
  }

  function onPeerOpenCallback(id: string) {
    setPeerId(id);
  }

  function onConnectionCallback(connection: Peer.DataConnection) {
    addPlayerConnection(connection);
    connection.on("data", data => {
      handleDataReceiveFromPlayer(data);
    });

    connection.on("close", () => {
      removePlayerConnection(connection);
    });
  }

  function onPeerDisconnectedCallback() {
    setPeerId(undefined);
    console.warn("Connection lost. Please reconnect");
  }

  function onPeerCloseCallback() {
    setPeerId(undefined);
    console.warn("Connection destroyed");
  }

  function onPeerErrorCallback(error) {
    setPeerId(undefined);
    console.warn(error);
  }

  function addGMPeerEventListener() {
    peer.current.on("open", onPeerOpenCallback);
    peer.current.on("connection", onConnectionCallback);
    peer.current.on("disconnected", onPeerDisconnectedCallback);
    peer.current.on("close", onPeerCloseCallback);
    peer.current.on("error", onPeerErrorCallback);
  }

  function removeGMPeerEventListener() {
    peer.current.off("open", onPeerOpenCallback);
    peer.current.off("connection", onConnectionCallback);
    peer.current.off("disconnected", onPeerDisconnectedCallback);
    peer.current.off("close", onPeerCloseCallback);
    peer.current.off("error", onPeerErrorCallback);
    peer.current.destroy();
  }

  function connectPlayerToGM() {
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

  useEffect(() => {
    const isPlayer = !!peerIdFromParams;
    if (isPlayer) {
      connectPlayerToGM();
    } else {
      addGMPeerEventListener();
    }

    return () => {
      removeGMPeerEventListener();
    };
  }, [peerIdFromParams]);

  return {
    peerId,
    isConnectedToGM: !!connectionToGM,
    numberOfConnectedPlayers: connectionsToPlayers.length,
    sendToAllPlayers: (action: IPeerAction) => {
      connectionsToPlayers.forEach(connection => {
        connection.send(action);
      });
    },
    sendToGM: (action: IPeerAction) => {
      if (!!connectionToGM) {
        connectionToGM.send(action);
      }
    }
  };
}
