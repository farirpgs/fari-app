import React from "react";
import { IInjections } from "../../services/injections";

export const InjectionsContext = React.createContext<IInjections>(
  undefined as any
);
