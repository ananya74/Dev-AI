import { auth } from "@/auth"; // from your next-auth setup
import { db } from "@/lib/db"; // Prisma client
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1️Authenticate the user
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //  Parse request body
    const { message, chatId } = await req.json();
    if (!message || typeof message !== "string") {
      return new NextResponse("Invalid message", { status: 400 });
    }

    let chat;

    // Create or reuse a chat
    if (chatId) {
      chat = await db.chat.findUnique({
        where: { id: chatId },
        include: { messages: true },
      });

      if (!chat) {
        return new NextResponse("Chat not found", { status: 404 });
      }
    } else {
      chat = await db.chat.create({
        data: {
          userId: user.id,
          title: message.slice(0, 30) || "New Chat",
        },
      });
    }

    // 4️⃣ Store user's message
    const userMessage = await db.message.create({
      data: {
        chatId: chat.id,
        role: "user",
        content: message,
      },
    });

    // 5️⃣ Call Groq API (LLM)
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      console.error("Groq API Error:", text);
      return new NextResponse("Groq API failed", { status: 500 });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content || "No response";

    // 6️⃣ Save assistant’s message in DB
    const assistantMessage = await db.message.create({
      data: {
        chatId: chat.id,
        role: "assistant",
        content: reply,
      },
    });

    // 7️⃣ Return the assistant’s reply and chat ID
    return NextResponse.json({
      reply,
      chatId: chat.id,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
