import produce from "immer";
import { useState } from "react";

export enum MessageType {
  Text = "text",
}

export type ITextMessage = {
  type: MessageType.Text;
  fromUserId: string;
  value: string;
};

export type IMessage = ITextMessage;

export type IChat = {
  messages: Array<IMessage>;
};

export function useChat() {
  const MAX_MESSAGES = 50;

  const [chat, setChat] = useState<IChat>({ messages: [] });

  function sendMessage(message: IMessage) {
    setChat(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.messages.push(message);
        draft.messages = draft.messages.slice(-MAX_MESSAGES);
      })
    );
  }

  function overrideChat(newChat: IChat | undefined) {
    if (newChat) {
      setChat(newChat);
    }
  }

  return {
    state: { chat },
    actions: { sendMessage, overrideChat },
  };
}
