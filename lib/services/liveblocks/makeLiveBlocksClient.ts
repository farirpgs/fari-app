import { createClient } from "@liveblocks/client";

export function makeLiveBlocksClient() {
  return createClient({
    publicApiKey: false
      ? "pk_dev_idze__Foj9T2QRR01oBR1su_4y-gl_mx8JwL90_FjQrsrtqxLnvJw5Q1GooxboHQ"
      : "pk_prod_DW7rLdIMrMduCwv9ETNWBueq2ih0mUFHJdeisqaw15jZtJrLb6Z_G80IjQS_kBW8",
  });
}
