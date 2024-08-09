import { HttpTransport } from "viem";
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected, metaMask } from "wagmi/connectors";
export type TransportConfig = Record<typeof base.id, HttpTransport>;

export const transports: TransportConfig = {
  [base.id]: http(),
};

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "PeerJS Example",
      // appLogoUrl: "https://PLACEHOLDER.png",
    }),
    injected({ shimDisconnect: true }),
    // walletConnect({ projectId: "" }),
    metaMask(),
  ],
  // ssr: true,

  transports,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
