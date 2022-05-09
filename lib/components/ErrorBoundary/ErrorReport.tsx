import React from "react";

export const ErrorReport: React.FC<{ eventId: string }> = () => {
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
      <div
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {"Try refreshing the page or going page to the"}{" "}
        <a href="/"> {"home page"}</a>
        {"."}
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {"If the problem persists, please report it on Github."}
      </div>
      <a
        href="https://github.com/fariapp/fari/discussions"
        target="_blank"
        rel="noreferrer"
        style={{
          padding: "1rem",
          background: "#3f50b5",
          fontWeight: "bold",
          fontSize: "1.2rem",
          color: "white",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Report Issue on Github
      </a>
    </div>
  );
};
