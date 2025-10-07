import { useEffect, useState } from "react";
import { Conversation, ConversationContent } from "./ai-elements/conversation";
import {
  PromptInput as Input,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputProvider,
} from "@/components/ai-elements/prompt-input";
import { Message, MessageAvatar, MessageContent } from "./ai-elements/message";
import { Suggestions, Suggestion } from "./ai-elements/suggestion";
import { Axis3DIcon } from "lucide-react";
import axios from "axios";
import {
  useDevMovementsReport,
  useEcosystemMovementsReport,
  useGenesisTokenReport,
  useUpcomingUnstakingReport,
} from "@/hooks/report/use-wintelligence";
type Sender = "assistant" | "user" | "system";

interface ChatMessage {
  id: number;
  from: Sender;
  content: string;
}
type SuggestionKey =
  | "dev-movements"
  | "genesis-overview"
  | "upcoming-unstaking"
  | "ecosystem-movements";

const suggestionToHook: Record<SuggestionKey, string> = {
  "dev-movements": "Analyse dev token movements",
  "genesis-overview": "Give me token overview",
  "upcoming-unstaking": "Give me upcoming unstaking report",
  "ecosystem-movements": "Give me Ecosystem movement report",
};
export default function ChatComponent() {
  const [selectedService, setSelectedService] = useState<SuggestionKey | null>(
    null
  );
  const [tokenAddress, setTokenAddress] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState(false);

  const [stage, setStage] = useState<
    "initial" | "awaiting-address" | "scanning" | "awaiting-confirmation"
  >("initial");
  const [input, setInput] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      from: "assistant",
      content: "Hello! Please select a suggestion to start.",
    },
  ]);
  const { data: devReport, isLoading } = useDevMovementsReport(
    tokenAddress,
    selectedService === "dev-movements" && isEnabled,
    "base"
  );
  const { data: overview, isLoading: loadingTokenReport } =
    useGenesisTokenReport(
      tokenAddress,
      selectedService === "genesis-overview" && isEnabled
    );
  const { data: unstaking, isLoading: loadingUnstakingReport } =
    useUpcomingUnstakingReport(
      tokenAddress,
      selectedService === "upcoming-unstaking" && isEnabled
    );
  const { data: ecosystem, isLoading: loadingEcosystemReport } =
    useEcosystemMovementsReport(
      tokenAddress,
      selectedService === "ecosystem-movements" && isEnabled,
      "smart_money"
    );
  const suggestions = [
    "Analyse dev token movements",
    "Give me token overview",
    "Give me upcoming unstaking report",
    "Give me Ecosystem movement report",
  ];

  // Utility function to validate EVM address
  const isValidEvmAddress = (address: string) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  //   const scanAddress = (address: string) => {
  //     setMessages((prev) => [
  //       ...prev,
  //       { id: prev.length, from: "user", content: address },
  //       {
  //         id: prev.length + 1,
  //         from: "assistant",
  //         content: `Scanning address "${address}" for "${selectedSuggestion}"...`,
  //       },
  //     ]);
  //     setStage("initial");
  //     setSelectedSuggestion(null);
  //     setInput("");
  //   };
  const handleUserConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length, from: "user", content: "Yes, proceed." },
        {
          id: prev.length + 1,
          from: "assistant",
          content: "Generating report... please wait.",
        },
      ]);
      // 👇 Now we actually trigger data fetching
      setIsEnabled(true);
      setStage("scanning");
    } else {
      setMessages((prev) => [
        ...prev,
        { id: prev.length, from: "user", content: "No, cancel." },
        {
          id: prev.length + 1,
          from: "assistant",
          content: "Operation canceled.",
        },
      ]);
      setStage("initial");
    }
  };

  useEffect(() => {
    if (!isEnabled) return;
    if (isLoading) return;
    if (loadingTokenReport) return;
    if (loadingUnstakingReport) return;
    if (loadingEcosystemReport) return;
    if (!selectedService) return;
    let reportSections: string[] = [];
    let errorDetected = false;

    // 🧩 DEV MOVEMENTS
    if (selectedService === "dev-movements") {
      console.log("preparing dev mov report");
      console.log(devReport, isLoading);

      if (devReport) {
        console.log("got devReport", devReport);

        if (devReport.report_for_24h)
          reportSections.push(
            `### 📊 24-Hour Report\n\n${devReport.report_for_24h}`
          );
        if (devReport.report_for_168h)
          reportSections.push(
            `### 🗓️ 7-Day Report\n\n${devReport.report_for_168h}`
          );
        if (devReport.comparison_report)
          reportSections.push(
            `### ⚖️ Comparison Report\n\n${devReport.comparison_report}`
          );
      } else {
        errorDetected = true;
      }
    }

    // 🧩 GENESIS OVERVIEW
    else if (selectedService === "genesis-overview") {
      if (overview) {
        const { report, token_summary, quotes } = overview;
        if (report) reportSections.push(`### 📘 Token Overview\n\n${report}`);
        if (token_summary)
          reportSections.push(
            `### 📈 Token Summary\n\n\`\`\`json\n${JSON.stringify(
              token_summary,
              null,
              2
            )}\n\`\`\``
          );
        if (quotes)
          reportSections.push(
            `### 💰 Market Data\n\n**Name:** ${quotes.name}\n**Symbol:** ${
              quotes.symbol
            }\n**Price (USD):** $${quotes.price_usd}\n**Market Cap:** $${Number(
              quotes.market_cap_usd
            ).toLocaleString()}`
          );
      } else {
        errorDetected = true;
      }
    }

    // 🧩 UPCOMING UNSTAKING
    else if (selectedService === "upcoming-unstaking") {
      if (unstaking) {
        if (unstaking.report_for_336h)
          reportSections.push(
            `### 🔓 Upcoming Unstaking (14-Day Report)\n\n${unstaking.report_for_336h}`
          );
      } else {
        errorDetected = true;
      }
    }

    // 🧩 ECOSYSTEM MOVEMENTS
    else if (selectedService === "ecosystem-movements") {
      if (ecosystem) {
        if (ecosystem.report_for_24h)
          reportSections.push(
            `### 🌍 24-Hour Ecosystem Report\n\n${ecosystem.report_for_24h}`
          );
        if (ecosystem.report_for_168h)
          reportSections.push(
            `### 📆 7-Day Ecosystem Report\n\n${ecosystem.report_for_168h}`
          );
        if (ecosystem.comparison_report)
          reportSections.push(
            `### ⚖️ Comparison Report\n\n${ecosystem.comparison_report}`
          );
      } else {
        errorDetected = true;
      }
    }
    console.log("reportSections", reportSections);

    // ⚠️ HANDLE FAILURES
    if (errorDetected || reportSections.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          from: "assistant",
          content:
            "⚠️ **Report generation failed.** Please check the token address or try again later.",
        },
      ]);
      setStage("initial");
      setIsEnabled(false);
      return;
    }

    // 🧠 COMBINE & SEND
    const fullReport = reportSections
      .map((section) => section.trim())
      .join("\n\n---\n\n");

    console.log("fullReport", fullReport);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length,
        from: "assistant",
        content: fullReport,
      },
    ]);

    setStage("initial");
    setIsEnabled(false);
  }, [devReport, overview, unstaking, ecosystem]);

  const scanAddress = async (address: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length, from: "user", content: address },
      {
        id: prev.length + 1,
        from: "assistant",
        content: `Scanning address "${address}" on Base network...`,
      },
    ]);
    setStage("scanning");
    setTokenAddress(address);
    try {
      const apiKey = "Ck3CfdmQYzcFaHJGsy0mz"; // Replace with your Alchemy API key
      const baseURL = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;

      const requestBody = {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getTokenMetadata",
        params: [address],
      };
      const response = await axios.post(baseURL, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
      //   const data = response.data;
      const { name, symbol, decimals, logo } = response.data.result;

      if (response.data && name) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length,
            from: "assistant",
            content: `The address belongs to the ${symbol.toUpperCase()} token. Proceed?`,
          },
        ]);
        setStage("awaiting-confirmation");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length,
            from: "assistant",
            content:
              "Unable to retrieve token information from Base network. Please check the address and try again.",
          },
        ]);
        setStage("initial");
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          from: "assistant",
          content:
            "An error occurred while fetching token information. Please try again later.",
        },
      ]);
      setStage("initial");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const key = (Object.keys(suggestionToHook) as SuggestionKey[]).find(
      (k) => suggestionToHook[k] === suggestion
    );
    if (key) {
      setSelectedService(key);
      setStage("awaiting-address");
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          from: "assistant",
          content: `Please provide the token address for the "${suggestion}" analysis.`,
        },
      ]);
    }
  };
  const handleSubmit = async () => {
    if (!isValidEvmAddress(input)) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          from: "assistant",
          content:
            "Invalid address. Please enter a valid EVM address starting with 0x.",
        },
      ]);
      return;
    }

    // 👇 Instead of starting report fetch directly, first scan token info
    await scanAddress(input);
  };
  const formatReport = (text: string) =>
    text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-foreground">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^-\s+/gm, "") // Remove dashes at the beginning of lines
      .replace(/\n-\s+/g, "\n") // Remove dashes after line breaks
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/^\s*/, "<p>")
      .replace(/\s*$/, "</p>")
      .replace(/\n/g, "<br/>");
  return (
    <PromptInputProvider>
      <div className="max-w-4xl mx-auto p-6 relative rounded-lg border h-full min-h-[400px] bg-gray-100 w-full">
        <Conversation>
          <ConversationContent>
            {messages.map((msg) => (
              <Message key={msg.id} from={msg.from}>
                <MessageContent className="p-2">
                  <div
                    className="text-sm leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{
                      __html: formatReport(msg.content),
                    }}
                  />
                </MessageContent>
                {msg.from === "assistant" && (
                  <MessageAvatar src="/WINT_Transparent.png" />
                )}
              </Message>
            ))}
          </ConversationContent>
        </Conversation>

        <div className="max-w-4xl mx-auto p-6 relative rounded-lg border mt-4 flex flex-col gap-4">
          <Suggestions>
            {suggestions.map((s) => (
              <Suggestion
                key={s}
                suggestion={s}
                onClick={() => stage === "initial" && handleSuggestionClick(s)}
                disabled={stage !== "initial"}
              />
            ))}
          </Suggestions>

          {stage === "awaiting-address" && (
            <Input
              onSubmit={handleSubmit}
              className="mt-4 w-full max-w-2xl mx-auto relative"
            >
              <PromptInputTextarea
                value={input}
                placeholder="Provide token address..."
                onChange={(e) => setInput(e.currentTarget.value)}
                className="pr-12"
              />
              <PromptInputSubmit
                status="ready"
                disabled={!input.trim()}
                className="absolute bottom-1 right-1"
              />
            </Input>
          )}
          {stage === "awaiting-confirmation" && (
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => handleUserConfirmation(true)}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
              >
                Yes, proceed
              </button>
              <button
                onClick={() => handleUserConfirmation(false)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </PromptInputProvider>
  );
}
