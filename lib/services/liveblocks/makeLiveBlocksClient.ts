import { createClient } from "@liveblocks/client";

export const LIVEBLOCKS_DEV_KEY =
  "pk_dev_idze__Foj9T2QRR01oBR1su_4y-gl_mx8JwL90_FjQrsrtqxLnvJw5Q1GooxboHQ";
export const LIVEBLOCKS_PROD_KEY =
  "pk_prod_DW7rLdIMrMduCwv9ETNWBueq2ih0mUFHJdeisqaw15jZtJrLb6Z_G80IjQS_kBW8";
export const LIVEBLOCKS_PUBLIC_KEY = LIVEBLOCKS_PROD_KEY;

export function makeLiveBlocksClient() {
  return createClient({
    publicApiKey: LIVEBLOCKS_PUBLIC_KEY,
  });
}
