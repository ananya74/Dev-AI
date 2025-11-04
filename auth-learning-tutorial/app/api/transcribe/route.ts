import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // Get FormData (we expect audio blob from frontend)
  const formData = await req.formData();
  const audioFile = formData.get("audio") as Blob | null;
  if (!audioFile) {
    return NextResponse.json({ error: "No audio provided" }, { status: 400 });
  }

  // Prepare FormData for ElevenLabs API
  const elevenForm = new FormData();
  elevenForm.append("model_id", "scribe_v1");
  elevenForm.append("file", audioFile);

  try {
    const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: elevenForm,
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("Error:", data);
      return NextResponse.json({ error: data }, { status: resp.status });
    }

    return NextResponse.json({ text: data.text });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
