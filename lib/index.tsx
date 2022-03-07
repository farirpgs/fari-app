import { setAutoFreeze } from "immer";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./index.css";

setAutoFreeze(false);

ReactDOM.render(<App />, document.getElementById("root"));
