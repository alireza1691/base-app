import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import { CopyIcon, Loader, MessageSquare, SearchIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Message, MessageAvatar, MessageContent } from "./ai-elements/message";
import { useState } from "react";
import { Response } from "./ai-elements/response";
import { Input } from "./ui/input";
import { Action, Actions } from "./ai-elements/actions";
export default function ChatComponent() {
  const [input, setInput] = useState("");

  const messages = ["text1", "text2"].map((text, index) => ({
    id: index,
    from: index % 2 === 0 ? "user" : "bot",
    content: text,
  }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setInput("");
    }
  };
  const report = "=sdjhfiusdghfusdgufgsdfhgsdhfgdshjfgsd";
  const isReportLoading = false;
  return (
    <div className="max-w-4xl ml-auto p-6 relative size-full rounded-lg border h-[600px]  bg-black w-full">
      <Conversation>
        <ConversationContent>
          <Message from="user">
            <MessageContent className="p-2">
              Hello Wintelligence! <br></br>Can you share any notable info about{" "}
              's upcoming unstakings?
            </MessageContent>
            <MessageAvatar src="/" />
          </Message>
          <Message from="assistant">
            <MessageContent className=" p-2">
              {isReportLoading ? (
                <Loader />
              ) : report ? (
                <div className="text-sm leading-relaxed space-y-3">
                  <p>
                    <strong>Sure, here is the report:</strong>
                  </p>
                  example
                </div>
              ) : (
                <h3 className="font-semibold ">Analysis Unavailable</h3>
              )}
            </MessageContent>
            <MessageAvatar src="/images/WINT_Transparent.png" />
          </Message>
          {report && (
            <Actions>
              <Action
                onClick={() => navigator.clipboard.writeText(report)}
                label="Copy"
              >
                <CopyIcon className="size-3" />
              </Action>
            </Actions>
          )}
        </ConversationContent>
      </Conversation>
    </div>
  );
}
