import { MessageType } from "./MessageType";
import { googleAnalyticsService } from "../../services/injections";

export function getText(
  inputValue: string
): {
  text: string;
  type: MessageType;
} {
  if (inputValue === "roll") {
    const first = Math.floor((Math.random() * 100) % 3);
    const second = Math.floor((Math.random() * 100) % 3);
    const third = Math.floor((Math.random() * 100) % 3);
    const fourth = Math.floor((Math.random() * 100) % 3);
    const firstText: string = FudgeText[first];
    const secondText: string = FudgeText[second];
    const thirdText: string = FudgeText[third];
    const fourthText: string = FudgeText[fourth];
    const total =
      FudgeValues[first] +
      FudgeValues[second] +
      FudgeValues[third] +
      FudgeValues[fourth];
    const formattedFirstText = firstText
      .split("")
      .slice(1)
      .join("");
    const text =
      `${formattedFirstText}${secondText}${thirdText}${fourthText}`
        .split("")
        .join(" ") + ` = ${total}`;
    googleAnalyticsService.sendEvent({
      category: "Chat",
      action: "Roll",
      label: "Fudge",
      value: total
    });
    return { text, type: MessageType.Code };
  }
  googleAnalyticsService.sendEvent({
    category: "Chat",
    action: "Send",
    label: "Fudge"
  });
  return { text: inputValue, type: MessageType.Normal };
}

export const FudgeText = {
  0: "-1",
  1: "+0",
  2: "+1"
};

export const FudgeValues = {
  0: -1,
  1: 0,
  2: 1
};
