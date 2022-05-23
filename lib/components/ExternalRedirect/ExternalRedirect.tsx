import { useEffect } from "react";

export function ExternalRedirect(props: { url: string }) {
  useEffect(() => {
    window.location.href = props.url;
  }, [props.url]);
  return null;
}
