import { atom, useAtom } from "jotai";
import Peer from "peerjs";
import { Address } from "viem";
interface P2PPeer {
  peer: Peer | null;
  address: Address | null;
}
export type PeerState = {
  initiator: P2PPeer;
  receiver: P2PPeer;
};

const p2pAtom = atom<PeerState>({
  initiator: {
    address: null,
    peer: null,
  },
  receiver: {
    address: null,
    peer: null,
  },
});

export default function useP2P() {
  return useAtom(p2pAtom);
}
