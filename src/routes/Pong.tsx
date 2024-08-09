import { useEffect, useMemo, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import { useAccount } from "wagmi";
import { Account } from "../components/account";
import { createPayload, parsePayload, sendPayload } from "@/lib/utils";
import Container from "@/components/Container";
import ConnectCard from "@/components/ConnectCard";
import PeerCard from "@/components/PeerCard";
import useP2P from "@/lib/hooks/use-peer";

function Pong() {
  const [p2p, setP2P] = useP2P();
  const { isConnected, address } = useAccount();
  const [connection, setConnection] = useState<DataConnection | null>(null);

  const peerAddress = useMemo(() => {
    if (isConnected) {
      setP2P((state) => ({
        ...state,
        initiator: {
          peer: state.initiator.peer,
          address: address ? address : null,
        },
      }));
      return address;
    }
  }, [address, isConnected, setP2P]);

  useEffect(() => {
    const p = new Peer();

    p.on("open", (id) => {
      setP2P((state) => ({
        ...state,
        receiver: { peer: p, address: address ? address : null },
      }));
      console.log(`Pong Peer ID: ${id}`);
      document.title = id;

      p.on("connection", (conn) => {
        setConnection(conn);
        console.log(`✅ Received connection from Peer: ${conn.peer}`);
        // setConn(conn);

        conn.on("data", (data) => {
          parsePayload(data as string);
          // if (!p2p.initiator.address) throw new Error("no initiator address");
        });

        conn.on("error", (err) => {
          console.error("Connection error:", err);
        });
      });
    });

    return () => {
      if (p) {
        p.destroy();
      }
    };
  }, [p2p.initiator.peer, setP2P, address]);

  useEffect(() => {
    if (!connection || !peerAddress) return;

    const intervalId = setInterval(() => {
      if (!connection.open) {
        console.error("🚫 CONNECTION NOT OPEN");
        clearInterval(intervalId);
        return;
      }
      const payload = createPayload("ping", peerAddress);
      sendPayload(connection, payload);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [connection, peerAddress]);

  function ConnectWallet() {
    if (isConnected) return <Account />;
    return <ConnectCard />;
  }

  return (
    <Container>
      <h1>PeerJS Example - Pong</h1>
      <PeerCard />
      <ConnectWallet />
    </Container>
  );
}

export default Pong;
