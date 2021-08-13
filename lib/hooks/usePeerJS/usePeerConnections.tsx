import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { DataTransferObject } from "../../domains/data-transfer-object/DataTransferObject";
import { IPeerAction } from "./IPeerAction";
import { usePeerJS } from "./usePeerJS";

const ConnectingTimeout = 5000;

export function usePeerConnections(options: {
  onHostDataReceive: (data: any) => void;
  debug?: boolean;
}) {
  const logger = useLogger();
  const { peer, loading } = usePeerJS({ debug: options.debug });
  const connection = useRef<Peer.DataConnection | undefined>(undefined);
  const connectingTimeoutError = useRef<any>();
  const [connectionToHost, setConnectionToHost] = useState<
    Peer.DataConnection | undefined
  >(undefined);
  const [connectingToHost, setConnectingToHost] = useState(false);
  const [connectingToHostError, setConnectingToHostError] = useState(false);

  useEffect(() => {
    if (connectingToHost) {
      connectingTimeoutError.current = setTimeout(() => {
        setConnectingToHost(false);
        setConnectingToHostError(true);
      }, ConnectingTimeout);
    } else {
      clearTimeout(connectingTimeoutError.current);
    }
    return () => {
      clearTimeout(connectingTimeoutError.current);
    };
  }, [connectingToHost]);

  useEffect(() => {
    function subscribeForEvents() {
      peer.on("error", onPeerErrorCallback);
      return () => {
        peer.off("error", onPeerErrorCallback);
        connection.current?.off("open", onHostConnectionOpen);
        connection.current?.off("close", onHostConnectionClose);
        connection.current?.off("data", onHostDataReceive);
      };
    }

    return subscribeForEvents();
  }, []);

  function onPeerErrorCallback(error: any) {
    if (error.type === "peer-unavailable") {
      setConnectingToHostError(true);
      setConnectingToHost(false);
    }
  }
  function onHostConnectionOpen() {
    setConnectionToHost(connection.current);
    setConnectingToHost(false);
    logger.debug("usePeerConnections: Connected To Host");
  }
  function onHostConnectionClose() {
    setConnectionToHost(undefined);
    setConnectingToHost(false);
    logger.debug("usePeerConnections: Disconnected From Host");
  }
  function onHostDataReceive(data: any) {
    const decodedData = DataTransferObject.decode(data);
    options.onHostDataReceive(decodedData);
  }

  return {
    state: {
      isConnectedToHost: !!connectionToHost,
      connectingToHost,
      loading,
      connectingToHostError,
    },
    actions: {
      connect<T>(id: string | undefined, userId: string, metadata?: T) {
        if (!id) {
          return;
        }
        logger.debug("Connection: Setup");
        setConnectingToHost(true);
        setConnectingToHostError(false);
        try {
          connection.current = peer.connect(id, {
            reliable: true,
            label: userId,
            metadata: metadata,
          });
          connection.current.on("open", onHostConnectionOpen);
          connection.current.on("close", onHostConnectionClose);
          connection.current.on("data", onHostDataReceive);
        } catch (error) {
          logger.error("usePeerConnections.connect: Error", {
            contexts: { error },
          });
          setConnectingToHost(false);
          setConnectingToHostError(true);
        }
      },
      sendToHost<TPeerAction extends IPeerAction<string, unknown>>(
        request: TPeerAction
      ) {
        try {
          const encodedData = DataTransferObject.encode(request);
          connectionToHost?.send(encodedData);
        } catch (error) {
          logger.error("usePeerConnections.sendToHost: Error", {
            contexts: { error },
          });
        }
      },
    },
  };
}
