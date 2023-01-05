import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import {
  IMessageToSend,
  MessageType,
} from "../../routes/Play/components/Chat/useChat";

export const ChatMessageParser = {
  parse(props: {
    message: string | undefined | null;
  }): IMessageToSend | undefined {
    if (!props.message) {
      return undefined;
    }

    try {
      if (props.message.startsWith("/r") || props.message.startsWith("/roll")) {
        const command = props.message
          .replace("/roll", "")
          .replace("/r", "")
          .trim();

        const diceRoll = new DiceRoll(command);
        return {
          type: MessageType.Roll,
          value: {
            text: diceRoll.output,
            total: diceRoll.total.toString(),
            label: command,
            command,
          },
        };
      }
      return {
        type: MessageType.Text,
        value: props.message,
      };
    } catch (error) {
      console.error("Error parsing chat message", error);
    }
  },
};
