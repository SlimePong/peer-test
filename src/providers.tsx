import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { Provider as JotaiProvider } from "jotai";

type ProviderProps = { children: ReactNode };

export function Providers(props: ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>{props.children}</JotaiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
