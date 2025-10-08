import { Buy } from "@coinbase/onchainkit/buy";
import type { Token } from "@coinbase/onchainkit/token";

export default function BuyComponent() {
  const WINTToken: Token = {
    address: "0xdf2fd7dd75143a5010f145440d49748275e362a3",
    chainId: 8453,
    decimals: 6,
    name: "Whale Intel",
    symbol: "WINT",
    image:
      "https://assets.coingecko.com/coins/images/55997/standard/Original_Logo_Symbol.png?1747991346",
  };
  return (
    <div className=" border shadow-sm w-fit mx-auto items-center justify-center flex p-2 rounded-xl">
      <Buy toToken={WINTToken} />
    </div>
  );
}
