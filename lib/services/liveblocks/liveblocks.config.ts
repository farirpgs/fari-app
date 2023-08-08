import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { IPlayerPresence } from "../../routes/Play/types/IPlayerPresence";

const client = createClient({
  publicApiKey: false
    ? "pk_test_ETujS9FV5jeieP0ussc8xBkQ"
    : "pk_live_LQJHauN3xAZFOMO6XY7fscYK",
});

type Presence = IPlayerPresence;
type Storage = {
  [key: string]: any;
};
type UserMeta = {};
type RoomEvent = {};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
