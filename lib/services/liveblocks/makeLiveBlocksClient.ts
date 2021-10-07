import { createClient } from "@liveblocks/client";

export function makeLiveBlocksClient() {
  return createClient({
    publicApiKey: import.meta.env.DEV
      ? "pk_test_ETujS9FV5jeieP0ussc8xBkQ"
      : "pk_live_LQJHauN3xAZFOMO6XY7fscYK",
  });
  // return createClient({
  //   authEndpoint: async (room: string) => {
  //     const test = import.meta.env.DEV ? "test=true" : "";
  //     const result = await axios.get(
  //       `/.netlify/functions/auth?room=${room}${test}`
  //     );
  //     return result.data.liveblocks.token;
  //   },
  // });
}
