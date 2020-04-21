import * as Sentry from "@sentry/browser";
import React from "react";

export const ErrorReport: React.FC<{ eventId: string }> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        padding: "3rem",
      }}
    >
      <div
        style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}
      >
        {"Ooops! Looks like something went wrong"}
      </div>
      <button
        style={{
          padding: "1rem",
          background: "#3f50b5",
          fontWeight: "bold",
          fontSize: "1.2rem",
          color: "white",
          cursor: "pointer",
          borderRadius: "4px",
        }}
        onClick={() => Sentry.showReportDialog({ eventId: props.eventId })}
      >
        Report feedback
      </button>
    </div>
  );
};
