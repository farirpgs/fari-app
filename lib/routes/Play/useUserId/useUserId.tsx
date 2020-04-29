import { useState } from "react";
import { v4 as uuidV4 } from "uuid";

export function useUserId(): string {
  const [userId] = useState(() => {
    return uuidV4();
  });
  return userId;
}
