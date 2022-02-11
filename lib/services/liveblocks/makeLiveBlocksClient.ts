import { createClient } from "@liveblocks/client";
import { env } from "../../constants/env";

export function makeLiveBlocksClient() {
  return createClient({
    publicApiKey: env.isDev
      ? "pk_test_ETujS9FV5jeieP0ussc8xBkQ"
      : "pk_live_LQJHauN3xAZFOMO6XY7fscYK",
  });
}
