import produce from "immer";
import { useState } from "react";
import { CommandResult, IDicePoolResult } from "../../../../domains/dice/Dice";

export enum MessageType {
  Text = "text",
  Roll = "roll",
}

export type ITextMessage = {
  type: MessageType.Text;
  value: string;
};

type RollMessageValue = {
  text: string;
  total: string;
  label: string | undefined;
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
    utils: {
      convertDicePoolResultToMessageValue(
        result: IDicePoolResult
      ): RollMessageValue {
        let text = result.commandResults.reduce((acc, commandResult) => {
          return `${acc ? `${acc} ` : acc}${commandResult.command} [${
            commandResult.value
          }]`;
        }, "");

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
        };
      },
    },
  };
}
