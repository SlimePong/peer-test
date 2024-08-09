import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>The peers Ethereum account details.</CardDescription>
      </CardHeader>
      <CardContent>
        {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
        {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      </CardContent>
      <CardFooter>
        <Button
          variant={"destructive"}
          onClick={() => disconnect()}
          style={{ marginTop: "24px" }}
        >
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  );
}
