import { useContext } from "react";
import { InjectionsContext } from "../InjectionsContext";

export function useLogger() {
  const { logger } = useContext(InjectionsContext);

  return logger;
}
