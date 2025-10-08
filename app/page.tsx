"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import SwapComponent from "@/components/swap";
import ChatComponent from "@/components/chat";
import BuyComponent from "@/components/buy-wint";

export default function Home() {
  return (
    <div className={`${styles.container} mb-20 flex  flex-col items-center`}>
      <header className={"flex flex-row justify-between px-2 items-center"}>
        <div className="flex flex-row items-center justify-center">
          <Image
            priority
            src="/WINT_Transparent.png"
            alt="Logo"
            width={64}
            height={64}
          />
        </div>

        <Wallet />
      </header>

      <ChatComponent />
      <BuyComponent />
      {/* <SwapComponent /> */}
    </div>
  );
}
