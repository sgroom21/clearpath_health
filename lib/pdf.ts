/**
 * Document Generation Utility for Professional Healthcare PDF Export
 *
 * Generates semantically structured markdown for clinical documents optimized
 * for high-quality PDF rendering. Supports patient assessments, treatment plans,
 * SOAP notes, and patient education materials.
 *
 * All output follows professional healthcare documentation standards with
 * clean formatting, proper hierarchy, and accessibility compliance.
 *
 * PDF layout:
 *   - US Letter (8.5" × 11"), 72pt = 1 inch
 *   - Margins: 1" all sides
 *   - Header zone: top 0.5" (company name left, date right)
 *   - Footer zone: bottom 0.5" (patient name left, page number right)
 *   - Body line spacing: 1.6× font size (~1.5–2 range)
 *   - Paragraph spacing: 0.5× font size after each paragraph/block
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PatientInfo {
  id: number;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  provider: string;
  chief: string;
  meds: string[];
  allergies: string;
  substance: string;
  trauma?: string;
  priorTx?: string;
  support?: string;
}

export interface AssessmentScore {
  score: number;
  label: string;
  items?: number[];
  si?: number;
}

export interface DocumentOptions {
  includeDisclaimer?: boolean;
  includeDateGenerated?: boolean;
  fontSize?: "small" | "medium" | "large";
}

// ============================================================================
// DOCUMENT GENERATORS  (unchanged — markdown output only)
// ============================================================================

export function generateAssessmentSummary(
  patient: PatientInfo,
  phq9: AssessmentScore,
  gad7: AssessmentScore,
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true, includeDateGenerated = true } = options;
  const lines: string[] = [];

  lines.push(`# Clinical Assessment Summary`);
  lines.push("");
  lines.push("## Patient Information");
  lines.push("");
  lines.push(`**Name:** ${patient.name} | **MRN:** ${patient.mrn}`);
  lines.push(
    `**Age:** ${patient.age} | **Gender:** ${patient.gender} | **Provider:** ${patient.provider}`,
  );
  if (includeDateGenerated) lines.push(`**Date Generated:** ${formatDate(new Date())}`);
  lines.push("");
  lines.push("## Chief Complaint");
  lines.push("");
  lines.push(`${patient.chief}`);
  lines.push("");
  lines.push("## Symptom Assessment");
  lines.push("");
  lines.push(`**PHQ-9 (Depression):** ${phq9.score}/27 — ${phq9.label}`);
  lines.push(`**GAD-7 (Anxiety):** ${gad7.score}/21 — ${gad7.label}`);
  lines.push("");
  lines.push("## Clinical Background");
  lines.push("");
  lines.push("**Current Medications:**");
  lines.push(formatList(patient.meds));
  lines.push("");
  lines.push(`**Allergies:** ${patient.allergies}`);
  lines.push("");
  lines.push(`**Substance Use:** ${patient.substance}`);
  if (patient.trauma) { lines.push(""); lines.push(`**Trauma History:** ${patient.trauma}`); }
  lines.push("");
  if (patient.priorTx) { lines.push(`**Prior Treatment:** ${patient.priorTx}`); lines.push(""); }
  if (patient.support) { lines.push(`**Psychosocial Support:** ${patient.support}`); lines.push(""); }

  if (includeDisclaimer) {
    lines.push("## Disclaimer");
    lines.push("");
    lines.push(
      "This document is intended for clinical reference only and does not replace " +
        "direct clinical judgment or comprehensive patient evaluation. All clinical " +
        "decisions should be made in consultation with appropriate medical professionals.",
    );
  }

  return lines.join("\n");
}

export function generatePatientEducation(
  topic: string,
  content: string,
  recommendations?: string[],
  resources?: string[],
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true, includeDateGenerated = true } = options;
  const lines: string[] = [];

  lines.push(`# ${topic}`);
  lines.push("");
  if (includeDateGenerated) { lines.push(`*Created: ${formatDate(new Date())}*`); lines.push(""); }
  lines.push("## Overview");
  lines.push("");
  lines.push(content);
  lines.push("");

  if (recommendations && recommendations.length > 0) {
    lines.push("## Recommendations");
    lines.push("");
    recommendations.forEach((rec, i) => lines.push(`${i + 1}. ${rec}`));
    lines.push("");
  }

  if (resources && resources.length > 0) {
    lines.push("## Additional Resources");
    lines.push("");
    resources.forEach((r) => lines.push(`- ${r}`));
    lines.push("");
  }

  if (includeDisclaimer) {
    lines.push("## Important Note");
    lines.push("");
    lines.push(
      "This educational material is for informational purposes and does not replace " +
        "professional medical advice, diagnosis, or treatment. Always consult with " +
        "your healthcare provider about any health concerns.",
    );
  }

  return lines.join("\n");
}

export function generateTreatmentPlan(
  patient: PatientInfo,
  diagnosis: string,
  goals: string[],
  interventions: string[],
  levelOfCare: string,
  followUp: string,
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true, includeDateGenerated = true } = options;
  const lines: string[] = [];

  lines.push(`# Treatment Plan`);
  lines.push("");
  lines.push("## Patient Information");
  lines.push("");
  lines.push(`**Name:** ${patient.name} | **MRN:** ${patient.mrn}`);
  lines.push(`**Provider:** ${patient.provider}`);
  if (includeDateGenerated) lines.push(`**Date:** ${formatDate(new Date())}`);
  lines.push("");
  lines.push("## Clinical Diagnosis");
  lines.push("");
  lines.push(diagnosis);
  lines.push("");
  lines.push("## Recommended Level of Care");
  lines.push("");
  lines.push(levelOfCare);
  lines.push("");
  lines.push("## Treatment Goals");
  lines.push("");
  goals.forEach((g, i) => lines.push(`${i + 1}. ${g}`));
  lines.push("");
  lines.push("## Treatment Interventions");
  lines.push("");
  interventions.forEach((v, i) => lines.push(`${i + 1}. ${v}`));
  lines.push("");
  lines.push("## Follow-Up Plan");
  lines.push("");
  lines.push(followUp);
  lines.push("");

  if (includeDisclaimer) {
    lines.push("## Clinical Notes");
    lines.push("");
    lines.push(
      "This treatment plan is based on current clinical assessment and may be modified " +
        "based on patient progress and clinical judgment. Regular monitoring and " +
        "adjustment of interventions is recommended.",
    );
  }

  return lines.join("\n");
}

export function generateSOAPNote(
  patient: PatientInfo,
  subjective: string,
  objective: string,
  assessment: string,
  plan: string,
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true, includeDateGenerated = true } = options;
  const lines: string[] = [];

  lines.push(`# SOAP Note`);
  lines.push("");
  lines.push("## Patient Information");
  lines.push("");
  lines.push(`**Name:** ${patient.name} | **MRN:** ${patient.mrn}`);
  lines.push(`**Provider:** ${patient.provider}`);
  if (includeDateGenerated) lines.push(`**Date of Visit:** ${formatDate(new Date())}`);
  lines.push("");
  lines.push("## Subjective");
  lines.push("");
  lines.push(subjective);
  lines.push("");
  lines.push("## Objective");
  lines.push("");
  lines.push(objective);
  lines.push("");
  lines.push("## Assessment");
  lines.push("");
  lines.push(assessment);
  lines.push("");
  lines.push("## Plan");
  lines.push("");
  lines.push(plan);
  lines.push("");

  if (includeDisclaimer) {
    lines.push("## Documentation Standards");
    lines.push("");
    lines.push(
      "This SOAP note documents clinical assessment and treatment planning for the " +
        "date of service indicated. It is part of the medical record and is subject " +
        "to applicable privacy and confidentiality regulations.",
    );
  }

  return lines.join("\n");
}

export function generateAssessmentDetail(
  assessmentName: string,
  patientName: string,
  totalScore: number,
  maxScore: number,
  severity: string,
  items: Array<{ question: string; response: number; maxValue: number }>,
  interpretation?: string,
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true, includeDateGenerated = true } = options;
  const lines: string[] = [];

  lines.push(`# ${assessmentName} Assessment`);
  lines.push("");
  lines.push("## Assessment Summary");
  lines.push("");
  lines.push(`**Patient:** ${patientName}`);
  lines.push(`**Total Score:** ${totalScore}/${maxScore}`);
  lines.push(`**Severity Level:** ${severity}`);
  if (includeDateGenerated) lines.push(`**Date Completed:** ${formatDate(new Date())}`);
  lines.push("");

  if (interpretation) {
    lines.push("## Interpretation");
    lines.push("");
    lines.push(interpretation);
    lines.push("");
  }

  lines.push("## Detailed Item Responses");
  lines.push("");
  items.forEach((item, i) => {
    lines.push(`**${i + 1}. ${item.question}**`);
    lines.push(`Response: ${item.response}/${item.maxValue}`);
    lines.push("");
  });

  if (includeDisclaimer) {
    lines.push("## Clinical Note");
    lines.push("");
    lines.push(
      `Assessment scores provide standardized measurement of symptom severity. ` +
        `This data should be interpreted in the context of comprehensive clinical evaluation.`,
    );
  }

  return lines.join("\n");
}

export function generateClinicalHandout(
  conditionName: string,
  description: string,
  symptoms: string[],
  selfCareStrategies: string[],
  whenToSeekHelp: string,
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true } = options;
  const lines: string[] = [];

  lines.push(`# ${conditionName}`);
  lines.push("");
  lines.push("## What You Should Know");
  lines.push("");
  lines.push(description);
  lines.push("");
  lines.push("## Common Symptoms");
  lines.push("");
  symptoms.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push("## Self-Care Strategies");
  lines.push("");
  selfCareStrategies.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push("");
  lines.push("## When to Seek Professional Help");
  lines.push("");
  lines.push(whenToSeekHelp);
  lines.push("");

  if (includeDisclaimer) {
    lines.push("## Medical Disclaimer");
    lines.push("");
    lines.push(
      "This handout provides general health information. It is not a substitute for " +
        "professional medical advice, diagnosis, or treatment. If you have concerns " +
        "about your health, please contact your healthcare provider.",
    );
  }

  return lines.join("\n");
}

export function generateMedicationEducation(options: DocumentOptions = {}): string {
  const { includeDisclaimer = true } = options;
  const lines: string[] = [];

  lines.push("# When Medication Helps — What to Expect");
  lines.push("");
  lines.push("## What It Is");
  lines.push("");
  lines.push(
    "Depression and anxiety are real health conditions that affect how you think, feel, and function. Just like other medical conditions, they can be effectively treated with medication that helps balance brain chemistry and improve your overall well-being.",
  );
  lines.push("");
  lines.push(
    "Your healthcare provider has recommended medication to help you manage symptoms like persistent sadness, low energy, and difficulty concentrating. This is a positive step toward feeling better and regaining your sense of balance after experiencing challenging life changes.",
  );
  lines.push("");
  lines.push("## How It May Affect You");
  lines.push("");
  lines.push(
    "Starting medication is a personal journey. You might notice changes gradually — some people feel improvements within 2–4 weeks, while others take a bit longer. It's normal to experience mild side effects as your body adjusts, which typically improve with time.",
  );
  lines.push("");
  lines.push(
    "Everyone responds differently to medication. Some people experience significant symptom relief, while others might need adjustments to find the right treatment approach. Being patient and honest with yourself and your healthcare provider is key.",
  );
  lines.push("");
  lines.push("## What You Can Do");
  lines.push("");
  lines.push("1. Take your medication exactly as prescribed, at the same time each day");
  lines.push("2. Keep a simple journal tracking your mood, energy, and any side effects");
  lines.push("3. Maintain regular follow-up appointments with your healthcare provider");
  lines.push("4. Practice self-care: get enough sleep, eat balanced meals, and move your body");
  lines.push("5. Connect with supportive friends, family, or a support group");
  lines.push("");
  lines.push("## When to Contact Your Provider");
  lines.push("");
  lines.push("- If side effects are severe or don't improve after a few weeks");
  lines.push("- If you experience thoughts of harming yourself");
  lines.push("- If your symptoms worsen or don't seem to be improving");
  lines.push("- If you have any questions or concerns about your medication");
  lines.push("");
  lines.push("Remember: You're taking an important step toward feeling better. Be kind to yourself during this process.");
  lines.push("");

  if (includeDisclaimer) {
    lines.push("## Important Note");
    lines.push("");
    lines.push(
      "This educational material is for informational purposes and does not replace professional medical advice, diagnosis, or treatment. Always consult with your healthcare provider about any health concerns or questions about your medication.",
    );
  }

  return lines.join("\n");
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatList(items: string[]): string {
  if (!items || items.length === 0) return "- None reported";
  return items.map((item) => `- ${item}`).join("\n");
}

export function formatNumberedList(items: string[]): string {
  if (!items || items.length === 0) return "";
  return items.map((item, i) => `${i + 1}. ${item}`).join("\n");
}

export function truncateParagraph(text: string, maxLength = 300): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  return lastPeriod > maxLength * 0.8 ? truncated.substring(0, lastPeriod + 1) : truncated + "…";
}

export function getReadabilityMetrics(text: string) {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const charCount = words.join("").length;
  return { words: words.length, sentences: sentences.length, averageWordLength: charCount / words.length };
}

export function validateDocumentStructure(markdown: string): string[] {
  const warnings: string[] = [];
  const h1Count = (markdown.match(/^# /gm) || []).length;
  if (h1Count > 1) warnings.push("Multiple H1 headings detected. Use only one H1 per document.");
  const paragraphs = markdown.split(/\n\n+/);
  paragraphs.forEach((para, i) => {
    const words = para.split(/\s+/).length;
    if (words > 150) warnings.push(`Paragraph ${i + 1} is very long (${words} words). Consider breaking into smaller sections.`);
  });
  return warnings;
}

export function exportAsPlainText(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^- /gm, "• ")
    .replace(/^\d+\. /gm, "")
    .trim();
}

// ============================================================================
// PDF-LIB INTEGRATION — REWRITTEN FOR PROPER LAYOUT
// ============================================================================

interface PDFOptions {
  title: string;
  content: string;
  patientName?: string;
  companyName?: string;
}

interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

interface TableRow {
  cells: string[];
}

interface TableData {
  headers: string[];
  rows: TableRow[];
}

/**
 * Layout constants — US Letter at 72pt/inch
 *
 * Header band : top margin (0"–0.5") → y = pageHeight - 36  to  pageHeight - 72
 * Body        : y = pageHeight - 72  down to  72            (1" from top, 1" from bottom)
 * Footer band : bottom margin (0"–0.5") → y = 36  to  72
 */
const PT = 72; // points per inch

const PAGE_W  = 8.5  * PT; // 612
const PAGE_H  = 11   * PT; // 792
const MARGIN  = 1    * PT; // 72  — body left/right/top/bottom
const HEADER_Y = PAGE_H - MARGIN / 2;   // 756 — centre of header band
const FOOTER_Y = MARGIN / 2;            // 36  — centre of footer band
const BODY_TOP    = PAGE_H - MARGIN;    // 720
const BODY_BOTTOM = MARGIN;             // 72
const BODY_W  = PAGE_W - 2 * MARGIN;   // 468

const BODY_FONT_SIZE   = 11;
const LINE_SPACING     = BODY_FONT_SIZE * 1.65;  // ~18pt ≈ 1.65× (sits between 1.5–2×)
const PARA_SPACING     = BODY_FONT_SIZE * 0.6;   // extra gap after paragraphs/bullets
const H1_SIZE          = 20;
const H2_SIZE          = 14;
const H3_SIZE          = 12;
const H1_SPACING_AFTER = H1_SIZE * 1.8;
const H2_SPACING_AFTER = H2_SIZE * 1.5;
const H3_SPACING_AFTER = H3_SIZE * 1.4;

// ── color palette ────────────────────────────────────────────────────────────
const COL_DARK  = rgb(0.15, 0.15, 0.15);
const COL_ACCENT= rgb(0.76, 0.09, 0.27);
const COL_MUTED = rgb(0.55, 0.55, 0.55);
const COL_RULE  = rgb(0.80, 0.80, 0.80);
const COL_WHITE = rgb(1, 1, 1);
const COL_THEAD_BG = rgb(0.20, 0.20, 0.20);

/**
 * Measure real character width using pdf-lib's font metrics.
 * Falling back to the approximation only when the font is unavailable.
 */
function measureText(text: string, font: any, size: number): number {
  try {
    return font.widthOfTextAtSize(text, size);
  } catch {
    return text.length * size * 0.5;
  }
}

/**
 * Wrap a run of styled segments into screen-width lines.
 * Returns an array of lines; each line is an array of segments.
 */
function wrapSegments(
  segments: TextSegment[],
  maxWidth: number,
  fontSize: number,
  fonts: { regular: any; bold: any; italic: any; boldItalic: any },
): TextSegment[][] {
  const lines: TextSegment[][] = [];
  let currentLine: TextSegment[] = [];
  let lineWidth = 0;

  const pickFont = (seg: TextSegment) => {
    if (seg.bold && seg.italic) return fonts.boldItalic;
    if (seg.bold)  return fonts.bold;
    if (seg.italic) return fonts.italic;
    return fonts.regular;
  };

  for (const seg of segments) {
    const words = seg.text.split(" ");
    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      const spaceW = lineWidth > 0 ? measureText(" ", pickFont(seg), fontSize) : 0;
      const wordW  = measureText(word, pickFont(seg), fontSize);

      if (lineWidth + spaceW + wordW > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [];
        lineWidth = 0;
      }

      const prefix = lineWidth > 0 ? " " : "";
      currentLine.push({ text: prefix + word, bold: seg.bold, italic: seg.italic, underline: seg.underline });
      lineWidth += spaceW + wordW;
    }
  }

  if (currentLine.length > 0) lines.push(currentLine);
  return lines.length > 0 ? lines : [[]];
}

/**
 * Create a professional PDF document from markdown content.
 *
 * Layout rules:
 *  • 1" margins body area
 *  • Header: company name (left) + date (right) centred in top half-inch band
 *  • Footer: patient name (left) + page N (right) centred in bottom half-inch band
 *  • Body text 11pt Helvetica, line spacing 1.65× (~18pt)
 *  • H1 20pt red, H2 14pt red, H3 12pt dark bold
 *  • Bullet / numbered lists indented 20pt
 *  • Table with dark header row, alternating subtle borders
 */
export async function createEducationPDF(options: PDFOptions): Promise<Uint8Array> {
  const {
    title,
    content,
    patientName = "Patient",
    companyName = "Clearpath Health",
  } = options;

  const pdfDoc = await PDFDocument.create();

  // ── embed fonts ─────────────────────────────────────────────────────────
  const fRegular    = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fBold       = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fItalic     = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  const fontSet = { regular: fRegular, bold: fBold, italic: fItalic, boldItalic: fBoldItalic };

  // ── state ────────────────────────────────────────────────────────────────
  let pageNum   = 0;
  let page: any = null;
  let y         = 0;

  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // ── page factory ─────────────────────────────────────────────────────────
  const newPage = () => {
    pageNum++;
    page = pdfDoc.addPage([PAGE_W, PAGE_H]);

    // ── header ──
    page.drawText(companyName.toUpperCase(), {
      x: MARGIN,
      y: HEADER_Y - 4,
      size: 9,
      font: fBold,
      color: COL_MUTED,
    });

    const dateW = measureText(dateStr, fRegular, 9);
    page.drawText(dateStr, {
      x: PAGE_W - MARGIN - dateW,
      y: HEADER_Y - 4,
      size: 9,
      font: fRegular,
      color: COL_MUTED,
    });

    // thin rule below header
    page.drawLine({
      start: { x: MARGIN, y: BODY_TOP },
      end:   { x: PAGE_W - MARGIN, y: BODY_TOP },
      thickness: 0.5,
      color: COL_RULE,
    });

    // ── footer ──
    const patLabel = `Patient: ${patientName}`;
    page.drawText(patLabel, {
      x: MARGIN,
      y: FOOTER_Y - 4,
      size: 9,
      font: fRegular,
      color: COL_MUTED,
    });

    const pgStr = `Page ${pageNum}`;
    const pgW   = measureText(pgStr, fRegular, 9);
    page.drawText(pgStr, {
      x: PAGE_W - MARGIN - pgW,
      y: FOOTER_Y - 4,
      size: 9,
      font: fRegular,
      color: COL_MUTED,
    });

    // thin rule above footer
    page.drawLine({
      start: { x: MARGIN, y: BODY_BOTTOM },
      end:   { x: PAGE_W - MARGIN, y: BODY_BOTTOM },
      thickness: 0.5,
      color: COL_RULE,
    });

    y = BODY_TOP - LINE_SPACING * 0.5;  // small top gap inside body
  };

  // ── overflow guard ───────────────────────────────────────────────────────
  const ensureSpace = (needed: number) => {
    if (y - needed < BODY_BOTTOM) newPage();
  };

  // ── draw one wrapped line of segments ────────────────────────────────────
  const drawSegmentLine = (
    segs: TextSegment[],
    xStart: number,
    size: number = BODY_FONT_SIZE,
  ) => {
    let x = xStart;
    for (const seg of segs) {
      if (!seg.text) continue;
      const font = seg.bold && seg.italic ? fBoldItalic
                 : seg.bold               ? fBold
                 : seg.italic             ? fItalic
                 :                         fRegular;
      page.drawText(seg.text, { x, y, size, font, color: COL_DARK });
      if (seg.underline) {
        const w = measureText(seg.text, font, size);
        page.drawLine({ start: { x, y: y - 1.5 }, end: { x: x + w, y: y - 1.5 }, thickness: 0.5, color: COL_DARK });
      }
      x += measureText(seg.text, font, size);
    }
  };

  // ── parse & render ────────────────────────────────────────────────────────
  newPage();

  // Title (drawn first, before sections to keep it at top)
  const titleWrapped = wrapSegments([{ text: title, bold: true }], BODY_W, H1_SIZE, fontSet);
  for (const line of titleWrapped) {
    ensureSpace(H1_SPACING_AFTER);
    drawSegmentLine(line, MARGIN, H1_SIZE);
    // accent underline on title line
    page.drawLine({ start: { x: MARGIN, y: y - 3 }, end: { x: PAGE_W - MARGIN, y: y - 3 }, thickness: 1.5, color: COL_ACCENT });
    y -= H1_SPACING_AFTER;
  }
  y -= PARA_SPACING;

  const sections = parseMarkdown(content);
  let numberedIdx = 0;

  for (const sec of sections) {
    switch (sec.type) {

      case "h1": {
        y -= PARA_SPACING;
        const lines = wrapSegments([{ text: sec.text!, bold: true }], BODY_W, H1_SIZE, fontSet);
        for (const line of lines) {
          ensureSpace(H1_SPACING_AFTER);
          drawSegmentLine(line, MARGIN, H1_SIZE);
          // colour accent bar
          page.drawLine({ start: { x: MARGIN, y: y - 3 }, end: { x: PAGE_W - MARGIN, y: y - 3 }, thickness: 1.5, color: COL_ACCENT });
          y -= H1_SPACING_AFTER;
        }
        break;
      }

      case "h2": {
        numberedIdx = 0;
        y -= PARA_SPACING * 1.5;
        ensureSpace(H2_SPACING_AFTER);
        const h2text = sec.text!;
        page.drawText(h2text, { x: MARGIN, y, size: H2_SIZE, font: fBold, color: COL_ACCENT });
        y -= H2_SPACING_AFTER;
        break;
      }

      case "h3": {
        y -= PARA_SPACING;
        ensureSpace(H3_SPACING_AFTER);
        page.drawText(sec.text!, { x: MARGIN, y, size: H3_SIZE, font: fBold, color: COL_DARK });
        y -= H3_SPACING_AFTER;
        break;
      }

      case "hr": {
        ensureSpace(LINE_SPACING);
        page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: COL_RULE });
        y -= LINE_SPACING;
        break;
      }

      case "bullet": {
        const segs = sec.segments || [{ text: sec.text! }];
        const wrapped = wrapSegments(segs, BODY_W - 20, BODY_FONT_SIZE, fontSet);
        for (let li = 0; li < wrapped.length; li++) {
          ensureSpace(LINE_SPACING);
          if (li === 0) {
            page.drawText("•", { x: MARGIN + 4, y, size: BODY_FONT_SIZE, font: fRegular, color: COL_DARK });
          }
          drawSegmentLine(wrapped[li], MARGIN + 20);
          y -= LINE_SPACING;
        }
        y -= PARA_SPACING * 0.4;
        break;
      }

      case "number": {
        const segs = sec.segments || [{ text: sec.text! }];
        const wrapped = wrapSegments(segs, BODY_W - 28, BODY_FONT_SIZE, fontSet);
        for (let li = 0; li < wrapped.length; li++) {
          ensureSpace(LINE_SPACING);
          if (li === 0) {
            const numStr = `${sec.index}.`;
            page.drawText(numStr, { x: MARGIN + 4, y, size: BODY_FONT_SIZE, font: fRegular, color: COL_DARK });
          }
          drawSegmentLine(wrapped[li], MARGIN + 28);
          y -= LINE_SPACING;
        }
        y -= PARA_SPACING * 0.4;
        break;
      }

      case "table": {
        const table = sec.table!;
        const colCount = table.headers.length;
        const colW     = BODY_W / colCount;
        const tFontSz  = 9.5;
        const cellPad  = 5;
        const rowH     = tFontSz * 1.9;

        // Header row
        ensureSpace(rowH * 1.5);
        page.drawRectangle({ x: MARGIN, y: y - rowH + tFontSz * 0.3, width: BODY_W, height: rowH, color: COL_THEAD_BG });
        for (let ci = 0; ci < table.headers.length; ci++) {
          const hdr = table.headers[ci];
          const clipped = hdr.length > 25 ? hdr.substring(0, 24) + "…" : hdr;
          page.drawText(clipped, { x: MARGIN + ci * colW + cellPad, y: y - tFontSz * 0.1, size: tFontSz, font: fBold, color: COL_WHITE });
        }
        y -= rowH;

        for (const row of table.rows) {
          ensureSpace(rowH);
          for (let ci = 0; ci < row.cells.length && ci < colCount; ci++) {
            const cell = row.cells[ci] || "";
            const clipped = cell.length > 30 ? cell.substring(0, 29) + "…" : cell;
            if (ci > 0) {
              page.drawLine({ start: { x: MARGIN + ci * colW, y: y + tFontSz * 0.8 }, end: { x: MARGIN + ci * colW, y: y - rowH + tFontSz * 0.3 }, thickness: 0.4, color: COL_RULE });
            }
            page.drawText(clipped, { x: MARGIN + ci * colW + cellPad, y: y - tFontSz * 0.1, size: tFontSz, font: fRegular, color: COL_DARK });
          }
          page.drawLine({ start: { x: MARGIN, y: y - rowH + tFontSz * 0.3 }, end: { x: MARGIN + BODY_W, y: y - rowH + tFontSz * 0.3 }, thickness: 0.4, color: COL_RULE });
          y -= rowH;
        }
        y -= PARA_SPACING;
        break;
      }

      case "paragraph":
      default: {
        const segs = sec.segments || [{ text: sec.text! }];
        if (!segs.length || (segs.length === 1 && !segs[0].text.trim())) break;
        const wrapped = wrapSegments(segs, BODY_W, BODY_FONT_SIZE, fontSet);
        for (const line of wrapped) {
          ensureSpace(LINE_SPACING);
          drawSegmentLine(line, MARGIN);
          y -= LINE_SPACING;
        }
        y -= PARA_SPACING;
        break;
      }
    }
  }

  return pdfDoc.save();
}

// ============================================================================
// MARKDOWN PARSER  (unchanged logic, slightly cleaned)
// ============================================================================

function parseMarkdown(content: string): Array<{
  type: string;
  text?: string;
  segments?: TextSegment[];
  index?: number;
  table?: TableData;
}> {
  const sections: any[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // table detection
    if (line.startsWith("|") && line.endsWith("|") && i + 1 < lines.length && lines[i + 1].trim().match(/^\|[\s\-|:]+\|$/)) {
      const tbl = parseTable(lines, i);
      sections.push({ type: "table", table: tbl.data });
      i = tbl.endLine + 1;
      continue;
    }

    if      (line.startsWith("# "))   { sections.push({ type: "h1", text: line.replace(/^# +/, ""),   segments: parseFormatting(line.replace(/^# +/, "")) }); }
    else if (line.startsWith("## "))  { sections.push({ type: "h2", text: line.replace(/^## +/, ""),  segments: parseFormatting(line.replace(/^## +/, "")) }); }
    else if (line.startsWith("### ")) { sections.push({ type: "h3", text: line.replace(/^### +/, ""), segments: parseFormatting(line.replace(/^### +/, "")) }); }
    else if (/^(---|___|\*\*\*)$/.test(line)) { sections.push({ type: "hr" }); }
    else if (line.startsWith("- ")) {
      const t = line.replace(/^- +/, "");
      sections.push({ type: "bullet", text: t, segments: parseFormatting(t) });
    }
    else if (/^\d+\. /.test(line)) {
      const idx = parseInt(line.match(/^(\d+)\./)?.[1] ?? "1", 10);
      const t   = line.replace(/^\d+\. +/, "");
      sections.push({ type: "number", text: t, segments: parseFormatting(t), index: idx });
    }
    else {
      sections.push({ type: "paragraph", text: line, segments: parseFormatting(line) });
    }

    i++;
  }

  return sections;
}

function parseFormatting(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // bold italic
    const biMatch = remaining.match(/^\*\*\*(.+?)\*\*\*/);
    if (biMatch) { segments.push({ text: biMatch[1], bold: true, italic: true }); remaining = remaining.slice(biMatch[0].length); continue; }

    // bold
    const bMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (bMatch) { segments.push({ text: bMatch[1], bold: true }); remaining = remaining.slice(bMatch[0].length); continue; }

    // italic
    const iMatch = remaining.match(/^\*(.+?)\*/);
    if (iMatch) { segments.push({ text: iMatch[1], italic: true }); remaining = remaining.slice(iMatch[0].length); continue; }

    // underline
    const uMatch = remaining.match(/^__(.+?)__/);
    if (uMatch) { segments.push({ text: uMatch[1], underline: true }); remaining = remaining.slice(uMatch[0].length); continue; }

    // plain char(s) — advance to next potential token
    const nextSpecial = remaining.search(/\*\*\*|\*\*|\*|__/);
    if (nextSpecial === -1) { segments.push({ text: remaining }); break; }
    if (nextSpecial > 0)    segments.push({ text: remaining.slice(0, nextSpecial) });
    remaining = remaining.slice(nextSpecial);

    // safety: if we didn't consume anything, eat one char
    if (remaining.length > 0 && !/^(\*\*\*|\*\*|\*|__)/.test(remaining)) {
      segments.push({ text: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return segments.length > 0 ? segments : [{ text: text }];
}

function parseTable(lines: string[], startIndex: number): { data: TableData; endLine: number } {
  const headers = lines[startIndex].trim().split("|").map((h) => h.trim()).filter(Boolean);
  const rows: TableRow[] = [];
  let end = startIndex + 1;

  if (end < lines.length && lines[end].trim().match(/^\|[\s\-|:]+\|$/)) end++;

  while (end < lines.length) {
    const line = lines[end].trim();
    if (!line || !line.startsWith("|")) break;
    const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length > 0) rows.push({ cells });
    end++;
  }

  return { data: { headers, rows }, endLine: end - 1 };
}