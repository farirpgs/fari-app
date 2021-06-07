import { useEffect, useState } from "react";
import { CannyPost } from "./domains/CannyPost";

const PostTitlePollingInterval = 500;

export function useCanny(props: { boardToken: string; basePath: string }) {
  const [postTitle, setPostTitle] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const newTitle = CannyPost.getTitle({
        pathName: window.location.pathname,
        basePath: props.basePath,
      });
      if (newTitle !== postTitle) {
        setPostTitle(newTitle);
      }
    }, PostTitlePollingInterval);

    return () => {
      clearInterval(interval);
    };
  }, [postTitle]);

  useEffect(() => {
    (window as any).Canny("render", {
      boardToken: props.boardToken,
      basePath: props.basePath,
      ssoToken: null,
    });
  }, []);

  return { postTitle } as const;
}

export function useCannyChangelog(props: { position: string }) {
  useEffect(() => {
    (window as any).Canny("initChangelog", {
      appID: "60b65546e96f3952c1972598",
      position: props.position,
      align: "right",
    });
  }, []);
}
