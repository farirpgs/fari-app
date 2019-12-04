import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { IPeerAction } from "../types/IPeerAction";

export type IPeerHostManager = ReturnType<ReturnType<typeof makeUsePeerHost>>;

function makeUsePeerHost() {
  let peerSingleton: Peer = undefined;
  let connectionsSingleton: Array<Peer.DataConnection> = [];

  return function usePeerHost(
    handleDataReceiveFromPlayer: (action: IPeerAction) => void,
    options: { disabled: boolean }
  ) {
    const [peerId, setPeerId] = useState<string>(peerSingleton?.id);
    const [connections, setConnections] = useState<Array<Peer.DataConnection>>(
      connectionsSingleton
    );
    const peer = useRef<Peer>(undefined);

    if (!peer.current && !options.disabled) {
      peer.current = peerSingleton || new Peer();
      peerSingleton = peer.current;
    }

    // Setup event listeners
    useEffect(() => {
      if (options.disabled) {
        return;
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
      function onPeerErrorCallback(error: any) {
        setPeerId(undefined);
        console.warn(error);
      }
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
    }, []);

    // Set players connections every 1s
    useEffect(() => {
      if (options.disabled) {
        return;
      }
      const id = setInterval(() => {
        if (!!peer.current) {
          const activeConnections = Object.keys(peer.current.connections)
            .map(id => {
              const [connection] = peer.current.connections[id];
              return connection;
            })
            .filter(c => c !== undefined);

          setConnections(activeConnections);
          connectionsSingleton = activeConnections;
        }
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }, []);

    // Handle data from players connections
    useEffect(() => {
      if (options.disabled) {
        return;
      }
      connections.forEach(c => c.on("data", handleDataReceiveFromPlayer));
      return () => {
        connections.forEach(c => c.off("data", handleDataReceiveFromPlayer));
      };
    }, [connections]);

    return {
      peerId,
      numberOfConnections: connections.length,
      sendToAllPlayers: (action: IPeerAction) => {
        connections.forEach(connection => {
          connection.send(action);
        });
      }
    };
  };
}

export const usePeerHost = makeUsePeerHost();
