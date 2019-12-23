import { MessageType } from "./MessageType";

export interface IMessage {
  text: string;
  from: string;
  type: MessageType;
  timestamp: number;
}
