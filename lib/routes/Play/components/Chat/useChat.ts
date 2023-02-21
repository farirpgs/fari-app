import produce from "immer";
import { useState } from "react";
import { CommandResult, IDicePoolResult } from "../../../../domains/dice/Dice";
import { useEvent } from "../../../../hooks/useEvent/useEvent";

export enum MessageType {
  Text = "text",
  Roll = "roll",
}

export type ITextMessage = {
  type: MessageType.Text;
  value: string;
};

export type RollMessageValue = {
  text: string;
  total: string;
  label: string | undefined;
  command?: string;
};

export type IRollMessage = {
  type: MessageType.Roll;
  value: RollMessageValue;
};

export type IMessageToSend = ITextMessage | IRollMessage;
export type IMessage = IMessageToSend & { fromUserId: string };

export type IChat = {
  messages: Array<IMessage>;
};

export function useChat() {
  const MAX_MESSAGES = 50;

  const [chat, setChat] = useState<IChat>({ messages: [] });
  const [viewedCount, setViewedCount] = useState(0);

  const messageCount = chat.messages.length;
  const unreadCount = messageCount - viewedCount;
  const unreadCountVisible = unreadCount > 0 ? unreadCount : 0;

  const sendMessage = useEvent((message: IMessage) => {
    setChat(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.messages.push(message);
        draft.messages = draft.messages.slice(-MAX_MESSAGES);
      })
    );
  });

  const overrideChat = useEvent((newChat: IChat | undefined) => {
    if (newChat) {
      setChat(newChat);
    }
  });

  const readAll = useEvent(() => {
    setViewedCount(messageCount);
  });

  return {
    state: { chat, messageCount, unreadCount: unreadCountVisible },
    actions: { sendMessage, overrideChat, readAll },
  };
}

export const RollMessage = {
  fromDicePoolResult(result: IDicePoolResult): RollMessageValue {
    let text = result.commandResults
      .map((commandResult) => {
        const command = commandResult.command;
        const value = commandResult.value;
        const details = commandResult.details || "";
        const result = details ? details : `${command}: [${value}]`;
        return result;
      })
      .join(" • ");

    const hasModifier =
      result.modifier !== null &&
      result.modifier !== undefined &&
      result.modifier !== 0;
    if (hasModifier) {
      text += ` + ${result.modifier}`;
    }

    const total = CommandResult.getTotal(result.commandResults);
    const highest = CommandResult.getHighest(result.commandResults);
    const lowest = CommandResult.getLowest(result.commandResults);
    const totalWithModifier = total + (result.modifier || 0);

    if (!hasModifier) {
      text += `\nHighest: ${highest}`;
      text += `\nLowest: ${lowest}`;
    }

    return {
      text: text,
      total: totalWithModifier.toString(),
      label: result.label,
      command: undefined,
    };
  },
};
