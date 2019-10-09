import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { IPeerAction } from "../types/IPeerAction";
import { getSafe } from "./getSafe";

export type IPeerManager = ReturnType<typeof usePeer>;

let peerSingleton: Peer = undefined;
let connectionsToPlayerSingleton: Array<Peer.DataConnection> = [];

export function usePeer(
  peerIdFromParams: string | undefined,
  handleDataReceiveFromGM: (action: IPeerAction) => void,
  handleDataReceiveFromPlayer: (action: IPeerAction) => void
) {
  const defaultPeerId = peerIdFromParams || getSafe(() => peerSingleton.id);
  const [peerId, setPeerId] = useState<string>(defaultPeerId);
  const [connectionToGM, setConnectionToGM] = useState<Peer.DataConnection>(
    undefined
  );
  const [connectionsToPlayers, setConnectionsToPlayer] = useState<
    Array<Peer.DataConnection>
  >(connectionsToPlayerSingleton);
  const peer = useRef<Peer>(undefined);

  if (!peer.current) {
    peer.current = peerSingleton || new Peer();
    peerSingleton = peer.current;
  }

  function onPeerOpenCallback(id: string) {
    setPeerId(id);
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
    peer.current.on("disconnected", onPeerDisconnectedCallback);
    peer.current.on("close", onPeerCloseCallback);
    peer.current.on("error", onPeerErrorCallback);
  }

  function removeGMPeerEventListener() {
    peer.current.off("open", onPeerOpenCallback);
    peer.current.off("disconnected", onPeerDisconnectedCallback);
    peer.current.off("close", onPeerCloseCallback);
    peer.current.off("error", onPeerErrorCallback);
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

  // Setup event listeners
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

  // Set players connections every 1s
  useEffect(() => {
    const id = setInterval(() => {
      if (peer.current) {
        const activeConnections = Object.keys(peer.current.connections)
          .map(id => {
            const [connection] = peer.current.connections[id];
            return connection;
          })
          .filter(c => c !== undefined);

        setConnectionsToPlayer(activeConnections);
        connectionsToPlayerSingleton = activeConnections;
      }
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  // Handle data from players connections
  useEffect(() => {
    const isPlayer = !!peerIdFromParams;
    if (isPlayer) {
      return;
    }

    connectionsToPlayers.forEach(c =>
      c.on("data", handleDataReceiveFromPlayer)
    );
    return () => {
      connectionsToPlayers.forEach(c =>
        c.off("data", handleDataReceiveFromPlayer)
      );
    };
  }, [connectionsToPlayers]);

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
