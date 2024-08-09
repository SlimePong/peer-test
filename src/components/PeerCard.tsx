import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useP2P from "@/lib/hooks/use-peer";

export default function PeerCard() {
  const [p2p] = useP2P();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Peer Data</CardTitle>
        <CardDescription>Your active Peer details.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Receiver Peer ID: {p2p.receiver?.peer?.id}</p>
        <p>Peer ID: {p2p.initiator?.peer?.id}</p>
      </CardContent>
    </Card>
  );
}
