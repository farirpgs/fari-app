import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { env } from "./constants/env";
import { ICharacter } from "./domains/character/types";
import { IScene, ISession } from "./hooks/useScene/IScene";
import { IChat } from "./routes/Play/components/Chat/useChat";
import { IPlayerInteraction } from "./routes/Play/types/IPlayerInteraction";
import { IPlayerPresence } from "./routes/Play/types/IPlayerPresence";

export const liveBlockClient = createClient({
  publicApiKey: env.isDev
    ? "pk_test_ETujS9FV5jeieP0ussc8xBkQ"
    : "pk_live_LQJHauN3xAZFOMO6XY7fscYK",
});

// Presence represents the properties that will exist on every User in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
export type Presence = IPlayerPresence & {
  // cursor: { x: number, y: number } | null,
  // ...
};

// Optionally, Storage represents the shared document that persists in the
// Room, even after all Users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
export type Storage = {
  // author: LiveObject<{ firstName: string, lastName: string }>,
  // ...
  session: ISession;
  chat: IChat;
  scene: IScene;
  characters: Record<string, ICharacter>;
};

// Optionally, UserMeta represents static/readonly metadata on each User, as
// provided by your own custom auth backend (if used). Useful for data that
// will not change during a session, like a User's name or avatar.
// type UserMeta = {
//   id?: string,  // Accessible through `user.id`
//   info?: Json,  // Accessible through `user.info`
// };

// Optionally, the type of custom events broadcasted and listened for in this
// room. Must be JSON-serializable.
export type RoomEvent = IPlayerInteraction & {};

export const {
  RoomProvider,
  useMyPresence,
  useObject,
  useStorage,
  useOthers,
  useMutation,
  useRoom,
  useUpdateMyPresence,
  useBroadcastEvent,
  useEventListener,
  /* ...all the other hooks you’re using... */
} = createRoomContext<Presence, Storage, {} /* UserMeta */, RoomEvent>(
  liveBlockClient
);
