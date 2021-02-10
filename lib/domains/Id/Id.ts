import { v4 as uuidV4 } from "uuid";

export const Id = {
  generate() {
    return uuidV4();
  },
};
