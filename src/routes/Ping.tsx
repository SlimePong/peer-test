import { useEffect, useMemo, useState, useRef } from "react";
import Peer, { DataConnection } from "peerjs";
import { useAccount } from "wagmi";
import { Account } from "../components/account";
import { createPayload, parsePayload, sendPayload } from "@/lib/utils";
import Container from "@/components/Container";
import ConnectCard from "@/components/ConnectCard";
import PeerCard from "@/components/PeerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import useP2P from "@/lib/hooks/use-peer";

const formSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
});

function Ping() {
  const { isConnected, address } = useAccount();
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [peerReady, setPeerReady] = useState(false);
  const [, setP2P] = useP2P();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverId: "",
    },
  });

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
    if (peerRef.current) return; // Avoid re-initializing

    const peer = new Peer();
    peer.on("open", (id) => {
      console.log(`Peer ID: ${id}`);
      document.title = id;
      peerRef.current = peer;
      setPeerReady(true); // Peer is now ready
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const peer = peerRef.current;

    if (!peer) {
      toast("Error", {
        description: "Peer is not initialized.",
      });
      return;
    }

    const conn = peer.connect(values.receiverId);

    if (!conn) {
      toast("Error", {
        description:
          "Failed to establish a connection. Please check the receiver ID.",
      });
      return;
    }

    conn.on("open", () => {
      console.log(`✅ Connected to Receiver: ${values.receiverId}`);
      setConnection(conn);
      toast("Connected", {
        description: `Successfully connected to receiver: ${values.receiverId}`,
      });
    });

    conn.on("data", (data) => {
      parsePayload(data as string);
    });

    conn.on("error", (err) => {
      console.error("Connection error:", err);
      toast("Connection Error", {
        description: err.message,
      });
    });

    setP2P((state) => ({
      ...state,
      initiator: { peer, address: address ? address : null },
    }));
  }

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
      <h1>PeerJS Example - Ping</h1>
      <PeerCard />
      <ConnectWallet />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="receiverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter receiver ID" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!peerReady}>
            Connect to Receiver
          </Button>
        </form>
      </Form>
    </Container>
  );
}

export default Ping;
