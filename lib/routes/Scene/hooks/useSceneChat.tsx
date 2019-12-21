import { useState } from "react";
import { IMessage } from "../Chat";

const MAX_NUMBER_OF_MESSAGES = 100;

export function useSceneChat() {
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  function addMessage(message: IMessage) {
    setMessages(items => {
      const newMessages = [...items, message];
      return takeLastMessages(newMessages, MAX_NUMBER_OF_MESSAGES);
    });
  }
  return {
    messages: messages,
    addMessage,
    setMessages
  };
}

function takeLastMessages(array: Array<any>, limit: number) {
  if (array.length > limit) {
    const indexToStart = Math.max(array.length - limit, 1);
    return array.slice(indexToStart);
  } else {
    return array;
  }
}
