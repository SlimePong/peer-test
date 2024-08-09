import { Address } from "viem";

export interface Payload {
  message: string | null;
  address: Address | null;
}
