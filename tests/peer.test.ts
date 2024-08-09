import { expect, test, vi } from "vitest";
import Peer from "peerjs";
import { getPeerId } from "../src/lib/peer";

// Mock the Peer class
vi.mock("peerjs", () => {
  return {
    default: vi.fn().mockImplementation((id) => {
      return {
        id: id,
        on: vi.fn(),
        connect: vi.fn(),
      };
    }),
  };
});

test("get receiver ID", () => {
  const receiverPeerId = "receiver-slime-pong-2";
  const peer = new Peer(receiverPeerId);

  // Assuming getPeerId is a simple function that returns peer.id
  const x = getPeerId(peer);

  expect(x).toBe("receiver-slime-pong-2");
});
