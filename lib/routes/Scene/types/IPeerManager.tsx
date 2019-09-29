import { IPeerAction } from "./IPeerAction";

export interface IPeerManager {
  peerId: string;
  isConnectedToGM: boolean;
  numberOfConnectedPlayers: number;
  sendToAllPlayers: (action: IPeerAction) => void;
  sendToGM: (action: IPeerAction) => void;
}
