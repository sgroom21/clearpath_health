import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { aj } from "@/lib/arcjet";
import { supabaseAdmin } from "@/lib/supabase";

async function upsertClinician(
  userId: string,
  email: string,
  name: string,
) {
  await supabaseAdmin
    .from("clinicians")
    .upsert(
      {
        id: userId,
        email,
        name,
      },
      {
        onConflict: "id",
      },
    );
}

export async function POST(
  req: NextRequest,
) {
  // Arcjet Protection
  const decision = await aj.protect(req, {
    requested: 1,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please wait a moment.",
        },
        { status: 429 },
      );
    }

    if (decision.reason.isBot()) {
      return NextResponse.json(
        {
          error:
            "Bot traffic detected.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: "Request blocked.",
      },
      { status: 403 },
    );
  }

  // Clerk Auth
  const { userId, sessionClaims } =
    await auth();

  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  // Parse Request
  const {
    message,
    instruction,
    patientId,
    resultType,
  } = await req.json();

  const userContent =
    instruction || message;

  if (!userContent) {
    return NextResponse.json(
      {
        error:
          "No message or instruction provided",
      },
      { status: 400 },
    );
  }

  // Env Validation
  const apiKey =
    process.env.OPENROUTER_API_KEY;

  const apiUrl =
    process.env.OPENROUTER_BASE_URL;

  const model =
    process.env.OPENROUTER_AI_MODEL;

  if (!apiKey || !apiUrl || !model) {
    return NextResponse.json(
      {
        error:
          "OpenRouter configuration not set",
      },
      { status: 500 },
    );
  }

  try {
    // Upsert Clinician
    const email =
      (sessionClaims?.email as string) ??
      "";

    const name =
      (sessionClaims?.name as string) ??
      "";

    await upsertClinician(
      userId,
      email,
      name,
    );

    console.log({
      apiUrl,
      model,
    });

    // OpenRouter Request
    const response = await fetch(
      `${apiUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: userContent,
            },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        }),
      },
    );

    if (!response.ok) {
      const error =
        await response.text();

      console.error(
        "OpenRouter API error:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Failed to generate response from OpenRouter",
        },
        {
          status: response.status,
        },
      );
    }

    const data =
      await response.json();

    const reply =
      data.choices?.[0]?.message
        ?.content ??
      "No response generated.";

    let insertedResultId:
      | number
      | undefined;

    // Save AI Result
    if (patientId && resultType) {
      const {
        data: insertedResult,
        error: resultError,
      } = await supabaseAdmin
        .from("ai_results")
        .insert({
          clinician_id: userId,
          patient_id: patientId,
          result_type: resultType,
          content: reply,
        })
        .select()
        .single();

      if (resultError) {
        console.error(
          "ai_results insert error:",
          resultError,
        );
      }

      insertedResultId =
        insertedResult?.id;

      const { error: auditError } =
        await supabaseAdmin
          .from("audit_logs")
          .insert({
            clinician_id: userId,
            patient_id: patientId,
            action: "generate",
            result_type: resultType,
            metadata: {},
          });

      if (auditError) {
        console.error(
          "audit_logs insert error:",
          auditError,
        );
      }
    }

    return NextResponse.json({
      reply,
      resultId:
        insertedResultId,
    });
  } catch (error) {
    console.error(
      "API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate response",
        details: String(error),
      },
      { status: 500 },
    );
  }
}