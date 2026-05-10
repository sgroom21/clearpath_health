import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, instruction } = await req.json();

    const userContent = instruction || message;

    if (!userContent) {
      return NextResponse.json(
        { error: "No message or instruction provided" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const apiUrl = process.env.OPENROUTER_AI_URL;
    const model = process.env.OPENROUTER_AI_MODEL;

    if (!apiKey || !apiUrl || !model) {
      return NextResponse.json(
        { error: "OpenRouter configuration not set" },
        { status: 500 },
      );
    }

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: userContent,
          },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      return NextResponse.json(
        { error: "Failed to generate response from OpenRouter" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "No response generated.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response", details: String(error) },
      { status: 500 },
    );
  }
}
