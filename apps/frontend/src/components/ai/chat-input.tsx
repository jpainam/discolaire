"use client";

import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { SendHorizontalIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

interface ChatInputProps {
  isLoading: boolean;
  onSend: (text: string) => Promise<void>;
  onStop: () => void;
}

export function ChatInput({ isLoading, onSend, onStop }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const text = input.trim();
      if (!text || isLoading) {
        return;
      }

      setInput("");

      void onSend(text).catch((err) => {
        setInput(text);
        if (err instanceof Error) {
          toast.error(err.message || "Failed to send message.");
        }
      });
    },
    [input, isLoading, onSend],
  );

  return (
    <form className="mt-4 border-t pt-4" onSubmit={handleSubmit}>
      <div className="bg-card rounded-xl border p-3">
        <Textarea
          className="min-h-[100px] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your message..."
          value={input}
        />
        <div className="mt-3 flex justify-end gap-2">
          {isLoading ? (
            <Button onClick={onStop} type="button" variant="outline">
              <SquareIcon className="size-4" />
              Stop
            </Button>
          ) : null}
          <Button disabled={!input.trim()} type="submit">
            <SendHorizontalIcon className="size-4" />
            Send
          </Button>
        </div>
      </div>
    </form>
  );
}
