import { NextResponse } from "next/server";
import { createEducationPDF } from "@/lib/pdf";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const id = params.id;

  console.log("PDF download request for ID:", id);

  try {
    const { data, error } = await supabaseAdmin
      .from("ai_results")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data) {
      console.log("No data found for ID:", id);
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Fetch patient name
    let patientName = "Patient";
    if (data.patient_id) {
      const { data: patientData } = await supabaseAdmin
        .from("patients")
        .select("name")
        .eq("id", data.patient_id)
        .single();

      if (patientData?.name) {
        patientName = patientData.name;
      }
    }

    console.log("Generating PDF for:", data.result_type);

    const pdfBytes = await createEducationPDF({
      title: data.result_type,
      content: data.content,
      patientName,
      companyName: "Clearpath Health",
    });

    console.log("PDF generated, size:", pdfBytes.length);

    // Sanitize patient name for filename
    const sanitizedName = patientName.replace(/[^a-zA-Z0-9-_]/g, "_");

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="handout-${sanitizedName}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
