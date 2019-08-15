import React from "react";
import { Page } from "../../components/Page/Page";

export const Home = props => {
  return (
    <Page
      outside={
        <div
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1519744346361-7a029b427a59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80")',
            height: "400px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative"
          }}
        >
          <div
            style={{
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white"
            }}
          >
            <h1>Fari</h1>
            <h2>The Roll Playing Game Companion</h2>
          </div>
        </div>
      }
    />
  );
};
