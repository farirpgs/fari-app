import { css } from "@emotion/css";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import React from "react";
import { useCannyChangelog } from "../../hooks/useCanny/useCanny";

export function CannyChangelog(props: { mobile: boolean }) {
  useCannyChangelog({
    position: props.mobile ? "top" : "bottom",
  });
  return (
    <>
      <span data-canny-changelog className={css({ display: "flex" })}>
        <NewReleasesIcon />
      </span>
    </>
  );
}
