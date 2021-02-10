import { useState } from "react";
import { Id } from "../../domains/id/Id";

export function useUserId(): string {
  const [userId] = useState(() => {
    return Id.generate();
  });
  return userId;
}
