import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export function usePeer<T>(
  peerIdFromParams: string | undefined,
  dataToSend: any,
  handleDataReceiveFromGM: (data: T) => void
) {
  const [peerId, setPeerId] = useState<string>(peerIdFromParams);
  const [, setConnectionToGM] = useState<Peer.DataConnection>(undefined);
  const [connectionsToPlayers, setConnectionsToPlayers] = useState<
    Array<Peer.DataConnection>
  >([]);
  const peer = useRef<Peer>(undefined);
  if (!peer.current) {
    peer.current = new Peer();
  }

  const sendToAllPlayers = (data: any) => {
    connectionsToPlayers.forEach(connection => {
      connection.send(data);
    });
  };

  useEffect(() => {
    const isPlayer = !!peerIdFromParams;
    if (isPlayer) {
      const connection = peer.current.connect(peerIdFromParams);
      connection.on("open", function() {
        setConnectionToGM(connection);
      });
      connection.on("data", function(data) {
        handleDataReceiveFromGM(data);
      });
    }

    function onPeerOpenCallback(id: string) {
      setPeerId(id);
    }

    function handleDataReceiveFromPlayer(data: any) {
      console.log("character", data);
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

  useEffect(() => {
    const id = setInterval(() => {
      sendToAllPlayers(dataToSend);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [connectionsToPlayers, dataToSend]);

  return {
    peerId,
    numberOfConnectedPlayers: connectionsToPlayers.length,
    sendToAllPlayers
  };
}
