"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { cn } from "@/lib/utils";
import { Connector } from "wagmi";

const FormSchema = z.object({
  uid: z.string().optional(),
});

export default function ConnectCard() {
  const { status, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function handleDisconnect() {
    disconnect();
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // if (!data.uid || data.uid === typeof undefined) {
    //   toast("Select a Wallet.");
    // }
    const connectorByUid = connectors.find(
      (c: Connector) => c.uid === data.uid,
    );

    if (connectorByUid) {
      setIsConnecting(true);
      try {
        connect({ chainId: 8453, connector: connectorByUid });
        // toast(`Connected Your Account!`, {
        //   style: {
        //     transform: "translateY(-64px)",
        //   },
        // });
      } catch (err) {
        console.error("Connection failed", err);
        // toast("Connection failed. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center space-y-8 pt-6 sm:pt-10">
        <CardTitle>Connect Account</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center p-4 space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
            <FormField
              control={form.control}
              name="uid"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "text-primary",
                          status === "disconnected" ? "flex" : "hidden",
                        )}
                      >
                        <SelectValue placeholder="Select a wallet provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {connectors.map((c: Connector) => {
                        return (
                          <SelectItem
                            key={c.uid}
                            value={c.uid}
                            className={"pl-2 group"}
                          >
                            {c.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isConnecting && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-full justify-center py-4 flex gap-2 items-center hover:bg-none text-xl">
                  Connecting{" "}
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                </div>
                <Button
                  size={"sm"}
                  variant={"destructive"}
                  className="w-full h-12"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </div>
            )}
            {isConnected && (
              <Button
                size={"sm"}
                variant={"destructive"}
                className="w-full h-12"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            )}
            {status === "disconnected" && (
              <Button type="submit" size={"sm"} className="w-full h-12">
                Connect
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
      <div className="h-6 md:h-10"></div>
    </Card>
  );
}
