"use client";

import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch("/api/chat/history");
      if (res.ok) {
        const data = await res.json();

        // Flatten messages (if you have multiple chats)
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allMessages = data.flatMap((chat: any) => chat.messages);
        setMessages(allMessages);
      }
    }
    fetchHistory();
  }, []);




  async function sendMessage() {
    if (!input.trim()) return;

    // Show the user message instantly
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = {
        role: "assistant" as const,
        content: data.reply || "No response from model",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded-lg bg-background shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">AI Chat</h1>

      <div className="h-[400px] overflow-y-auto space-y-3 p-2 border rounded bg-muted/30">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
            {/* {msg.content} */}
            <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                    __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
                    .replace(/(\d+)\.\s/g, "<br/><b>$1.</b> ")       // numbered points
                    .replace(/\n/g, "<br/>"),                         // line breaks
                }}
            />

          </div>
        ))}
        {isLoading && <p className="text-gray-500">Thinking...</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={isLoading}>
          Send
        </Button>
      </div>
    </div>
  );
}
