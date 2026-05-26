import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST() {
  try {
    console.log("START TEST");

    const completion =
      await client.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "user",
            content: "Hello",
          },
        ],
      });

    console.log("SUCCESS");
    console.log(completion);

    return Response.json(completion);
  } catch (err: any) {
    console.error("REAL ERROR:");
    console.error(err);

    return Response.json(
      {
        message: err?.message,
        stack: err?.stack,
        raw: err,
      },
      { status: 500 }
    );
  }
}