import { ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export function WindowPortal(props: { children: ReactNode; onClose(): void }) {
  const externalWindow = useRef<Window | null>();

  const containerEl = useRef<HTMLDivElement>();
  if (!containerEl.current) {
    containerEl.current = document.createElement("div");
  }
  useEffect(() => {
    externalWindow.current = window.open(
      "",
      "",
      "width=600,height=400,left=200,top=200"
    );

    if (externalWindow.current && containerEl.current) {
      externalWindow.current.document.body.appendChild(containerEl.current);
      externalWindow.current.onbeforeunload = () => {
        props.onClose();
      };
    }
    return () => {
      if (externalWindow.current) {
        externalWindow.current.close();
      }
    };
  }, []);

  return ReactDOM.createPortal(props.children, containerEl.current);
}
