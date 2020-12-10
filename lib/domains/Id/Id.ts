import { v4 as uuidV4 } from "uuid";

export const Id = {
  get() {
    return uuidV4();
  },
};
