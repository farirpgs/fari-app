import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export function usePeer<T>(
  peerIdFromParams: string | undefined,
  dataToSend: any,
  handleDataReceive: (data: T) => void
) {
  const [peerId, setPeerId] = useState<string>(peerIdFromParams);
  const [, setConnectionToGM] = useState<Peer.DataConnection>(undefined);
  const [connectionsToPlayers, setConnectionsToPlayers] = useState<
    Array<Peer.DataConnection>
  >([]);
  const [numberOfConnectedPlayers, setNumberOfConnectedPlayers] = useState(0);
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
    const isReceiver = !!peerIdFromParams;
    if (isReceiver) {
      const connection = peer.current.connect(peerIdFromParams);
      connection.on("open", function() {
        setConnectionToGM(connection);
      });
      connection.on("data", function(data) {
        handleDataReceive(data);
      });
    }

    const onPeerOpenCallback = id => {
      setPeerId(id);
    };

    const onConnectionCallback = (connection: Peer.DataConnection) => {
      setConnectionsToPlayers([...connectionsToPlayers, connection]);
      connection.on("data", data => {
        console.log("got data from players");
        console.log(data);
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
    };

    const onPeerDisconnectedCallback = () => {
      console.log("Connection lost. Please reconnect");
    };

    const onPeerCloseCallback = () => {
      console.log("Connection destroyed");
    };

    const onPeerErrorCallback = err => {
      console.log(err);
    };

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
