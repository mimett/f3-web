"use client"

import Button from "@/components/ui/button"
import { opBNB } from "@/config/chains"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import ConnectWalletUI from "@/components/connect-wallet/connect-wallet"

export default function GetMainSection({
  children,
}: React.PropsWithChildren<{}>) {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork({
      // throwForSwitchChainNotSupported: true,
      onError(error) {
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x15Eb",
              rpcUrls: ["https://opbnb-testnet-rpc.bnbchain.org"],
              chainName: "OPBNB Testnet",
              nativeCurrency: {
                name: "tBNB",
                symbol: "tBNB",
                decimals: 18,
              },
              blockExplorerUrls: ["https://opbnbscan.com"],
            },
          ],
        })
      },
    })

  if (!address) {
    return <ConnectWalletUI></ConnectWalletUI>
  } else if (chain?.id != opBNB.id) {
    return (
      <div className={"absolute left-1/2 top-1/2 flex flex-col gap-y-3 p-5"}>
        <p>Please switch to opBNB network.</p>
        <Button
          className={"mx-auto"}
          size={"medium"}
          shape={"rounded"}
          onClick={() => switchNetwork?.(opBNB.id)}
        >
          Switch Chain
        </Button>
      </div>
    )
  } else {
    return (
      <div className={"px-4 pb-4 pt-4 sm:px-6 lg:px-8 3xl:px-10 3xl:pt-0.5"}>
        {children}
      </div>
    )
  }
}
