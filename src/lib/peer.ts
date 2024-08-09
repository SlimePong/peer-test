import Peer from "peerjs";

export const RECV_PEER_ID = "slime-game-2";

export function getPeerId(peer: Peer) {
  return peer.id;
}
