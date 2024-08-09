import { atom, useAtom } from "jotai";
import { Address } from "viem";

export type ReceiverPeerState = {
  id: string | null;
  address: Address | null;
};

const configAtom = atom<ReceiverPeerState>({
  id: null,
  address: null,
});

export default function useReceiverPeer() {
  return useAtom(configAtom);
}
