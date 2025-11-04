/* import { auth } from "@/auth"; // from your next-auth setup
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
      if (!user.id) {
        return new NextResponse("User ID missing", { status: 400 });
      }
      
      chat = await db.chat.create({
        data: {
          userId: user.id,
          title: message.slice(0, 30) || "New Chat",
        },
      });
    }

    // Store user's message
    const userMessage = await db.message.create({
      data: {
        chatId: chat.id,
        role: "user",
        content: message,
      },
    });

    //  Call Groq API (LLM)
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

    //  Save assistant’s message in DB
    const assistantMessage = await db.message.create({
      data: {
        chatId: chat.id,
        role: "assistant",
        content: reply,
      },
    });

    // 7Return the assistant’s reply and chat ID
    return NextResponse.json({
      reply,
      chatId: chat.id,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
 */

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { put } from "@vercel/blob"; // for image upload

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

//  Transcribe voice using Whisper (OpenAI)


export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const contentType = req.headers.get("content-type") || "";
    let message = "";
    let imageUrl: string | null = null;
    
    let chatId: string | null = null;

    //  Handle FormData (image/audio uploads)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      chatId = formData.get("chatId")?.toString() || null;
      const messageField = formData.get("message");
      if (messageField) message = messageField.toString();

     

      //  Upload image to Vercel Blob
      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const blob = await put(imageFile.name, imageFile, {
          access: "public",
          addRandomSuffix: true, // ✅ ensures unique filename
        });

        imageUrl = blob.url;
      }
    } else {
      //  JSON request
      const json = await req.json();
      message = json.message;
      chatId = json.chatId;
      imageUrl = json.imageUrl || null;
    }

    if (!message && !imageUrl)
      return new NextResponse("Missing message or image", { status: 400 });

    // Create or get existing chat
    let chat;
    if (chatId) {
      chat = await db.chat.findUnique({ where: { id: chatId } });
      if (!chat) return new NextResponse("Chat not found", { status: 404 });
    } else {
      chat = await db.chat.create({
        data: {
          userId: user.id!,
          title: message?.slice(0, 30) || "New Chat",
        },
      });
    }

    // Save user message
    await db.message.create({
      data: { chatId: chat.id, role: "user", content: message || "[Image]" },
    });

    
    // Build Groq payload
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      model: imageUrl
        ? "meta-llama/llama-4-scout-17b-16e-instruct" // Vision model
        : "llama-3.1-8b-instant", // Text-only
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
      ],
    };

    if (imageUrl) {
      payload.messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "Describe this image" },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      });
    } else {
      payload.messages.push({ role: "user", content: message });
    }

    //  Get Groq response
    const completion = await groq.chat.completions.create(payload);
    const reply =
      completion?.choices?.[0]?.message?.content || "No response from Groq";

    //  Save AI reply
    await db.message.create({
      data: { chatId: chat.id, role: "assistant", content: reply },
    });

    //  Return result
    return NextResponse.json({
      reply,
      chatId: chat.id,
      imageUrl,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
 
