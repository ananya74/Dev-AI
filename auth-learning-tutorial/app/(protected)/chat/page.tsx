"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, Bot, User, Mic, ImagePlus, X, StopCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  createdAt?: string;
}
interface ChatHistoryItem {
  createdAt: string;
  messages: Message[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  // Fetch chat history (newest last)
  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch("/api/chat/history");
      if (res.ok) {
        const data = await res.json();
        const allMessages = (data as ChatHistoryItem[])
          .flatMap((chat) => chat.messages)
          .sort(
            (a, b) =>
              new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          );
        setMessages(allMessages);
      }
    }
    fetchHistory();
  }, []);

  /** 📨 Send message or image */
  async function sendMessage() {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      role: "user",
      content: input || "Sent an image",
      imageUrl: previewUrl || undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (selectedImage) formData.append("image", selectedImage);

      const res = await fetch("/api/chat", { method: "POST", body: formData });
      const data = await res.json();
      console.log("Chat API Response:", data); 

      const botMessage: Message = {
        role: "assistant",
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
      setTimeout(() => {
        setPreviewUrl(null);
        setSelectedImage(null);
      }, 100);
    }
  }


  /** 📷 Image Upload */
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  /** 🎤 Start Recording */
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = handleAudioStop;

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
    }
  }

  /** 🛑 Stop Recording and send to API */
  async function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  /** 🧠 Handle audio after stop */
  async function handleAudioStop() {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];

    const form = new FormData();
    form.append("audio", audioBlob);

    try {
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await res.json();
      const transcript = data.text || "Could not transcribe audio.";

      /* setMessages((prev) => [...prev, { role: "user", content: transcript }]); */
      setInput(transcript);
      /* await sendMessage(); */
    } catch (err) {
      console.error("Transcription failed:", err);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-0 p-2 text-white shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">DEV AI</h1>

      {/* Chat Box */}
      <div className="h-[450px] overflow-y-auto space-y-3 p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-inner">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-[85%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`p-2 rounded-full bg-gradient-to-r ${
                    msg.role === "user"
                      ? "from-blue-500 to-cyan-400"
                      : "from-gray-700 to-gray-800"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-green-300" />
                  )}
                </div>

                <div
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-gray-800 text-gray-100 border border-gray-700"
                  }`}
                >
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/(\d+)\.\s/g, "<br/><b>$1.</b> ")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                  {msg.imageUrl && (
                    <Image
                      src={msg.imageUrl}
                      alt="Sent"
                      width={160}
                      height={160}
                      className="mt-2 w-40 h-40 object-cover rounded-lg border border-gray-600"
                    />

                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 italic text-sm text-center"
          >
            Thinking...
          </motion.p>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="mt-3 relative">
          <Image
            src={previewUrl}
            alt="Preview"
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-lg border border-gray-600"
          />

          <button
            onClick={() => {
              setPreviewUrl(null);
              setSelectedImage(null);
            }}
            className="absolute top-0 right-0 bg-black/70 p-1 rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className="mt-3 flex items-center gap-3 bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl px-3 py-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder-gray-400"
        />

        <label className="cursor-pointer">
          <ImagePlus className="h-5 w-5 text-gray-300 hover:text-white" />
          <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
        </label>

        {/* 🎤 Mic Button */}
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`${
            isRecording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-blue-500 to-cyan-500"
          } text-white px-3 py-2 rounded-lg transition`}
        >
          {isRecording ? (
            <StopCircle className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        <Button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
//1