import { createClient } from "@liveblocks/client";
import { env } from "../../constants/env";

export function makeLiveBlocksClient() {
  return createClient({
    publicApiKey: env.isDev
      ? "pk_live_LQJHauN3xAZFOMO6XY7fscYK"
      : "pk_live_LQJHauN3xAZFOMO6XY7fscYK",
  });
}
