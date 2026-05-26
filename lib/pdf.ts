/**
 * Document Generation Utility for Professional Healthcare PDF Export
 *
 * Generates semantically structured markdown for clinical documents optimized
 * for high-quality PDF rendering. Supports patient assessments, treatment plans,
 * SOAP notes, and patient education materials.
 *
 * All output follows professional healthcare documentation standards with
 * clean formatting, proper hierarchy, and accessibility compliance.
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
// DOCUMENT GENERATORS
// ============================================================================

/**
 * Generate a clinical assessment summary document
 * Suitable for clinician review and treatment planning
 */
export function generateAssessmentSummary(
  patient: PatientInfo,
  phq9: AssessmentScore,
  gad7: AssessmentScore,
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true, includeDateGenerated = true } = options;

  const lines: string[] = [];

  // Header
  lines.push(`# Clinical Assessment Summary`);
  lines.push("");

  // Meta information
  lines.push("## Patient Information");
  lines.push("");
  lines.push(`**Name:** ${patient.name} | **MRN:** ${patient.mrn}`);
  lines.push(
    `**Age:** ${patient.age} | **Gender:** ${patient.gender} | **Provider:** ${patient.provider}`,
  );
  if (includeDateGenerated) {
    lines.push(`**Date Generated:** ${formatDate(new Date())}`);
  }
  lines.push("");

  // Chief complaint
  lines.push("## Chief Complaint");
  lines.push("");
  lines.push(`${patient.chief}`);
  lines.push("");

  // Assessment scores
  lines.push("## Symptom Assessment");
  lines.push("");
  lines.push(`**PHQ-9 (Depression):** ${phq9.score}/27 — ${phq9.label}`);
  lines.push(`**GAD-7 (Anxiety):** ${gad7.score}/21 — ${gad7.label}`);
  lines.push("");

  // Clinical background
  lines.push("## Clinical Background");
  lines.push("");
  lines.push("**Current Medications:**");
  lines.push(formatList(patient.meds));
  lines.push("");
  lines.push(`**Allergies:** ${patient.allergies}`);
  lines.push("");
  lines.push(`**Substance Use:** ${patient.substance}`);
  if (patient.trauma) {
    lines.push("");
    lines.push(`**Trauma History:** ${patient.trauma}`);
  }
  lines.push("");
  if (patient.priorTx) {
    lines.push(`**Prior Treatment:** ${patient.priorTx}`);
    lines.push("");
  }
  if (patient.support) {
    lines.push(`**Psychosocial Support:** ${patient.support}`);
    lines.push("");
  }

  // Disclaimer
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

/**
 * Generate a patient education handout document
 * Suitable for patient distribution with clear, accessible language
 */
export function generatePatientEducation(
  topic: string,
  content: string,
  recommendations?: string[],
  resources?: string[],
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true, includeDateGenerated = true } = options;

  const lines: string[] = [];

  // Header
  lines.push(`# ${topic}`);
  lines.push("");

  if (includeDateGenerated) {
    lines.push(`*Created: ${formatDate(new Date())}*`);
    lines.push("");
  }

  // Overview
  lines.push("## Overview");
  lines.push("");
  lines.push(content);
  lines.push("");

  // Recommendations
  if (recommendations && recommendations.length > 0) {
    lines.push("## Recommendations");
    lines.push("");
    recommendations.forEach((rec, index) => {
      lines.push(`${index + 1}. ${rec}`);
    });
    lines.push("");
  }

  // Resources
  if (resources && resources.length > 0) {
    lines.push("## Additional Resources");
    lines.push("");
    resources.forEach((resource) => {
      lines.push(`- ${resource}`);
    });
    lines.push("");
  }

  // Disclaimer
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

/**
 * Generate a treatment plan document
 * Includes diagnosis, goals, and intervention strategy
 */
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

  // Header
  lines.push(`# Treatment Plan`);
  lines.push("");

  // Patient info
  lines.push("## Patient Information");
  lines.push("");
  lines.push(`**Name:** ${patient.name} | **MRN:** ${patient.mrn}`);
  lines.push(`**Provider:** ${patient.provider}`);
  if (includeDateGenerated) {
    lines.push(`**Date:** ${formatDate(new Date())}`);
  }
  lines.push("");

  // Diagnosis
  lines.push("## Clinical Diagnosis");
  lines.push("");
  lines.push(diagnosis);
  lines.push("");

  // Level of care
  lines.push("## Recommended Level of Care");
  lines.push("");
  lines.push(levelOfCare);
  lines.push("");

  // Treatment goals
  lines.push("## Treatment Goals");
  lines.push("");
  goals.forEach((goal, index) => {
    lines.push(`${index + 1}. ${goal}`);
  });
  lines.push("");

  // Interventions
  lines.push("## Treatment Interventions");
  lines.push("");
  interventions.forEach((intervention, index) => {
    lines.push(`${index + 1}. ${intervention}`);
  });
  lines.push("");

  // Follow-up
  lines.push("## Follow-Up Plan");
  lines.push("");
  lines.push(followUp);
  lines.push("");

  // Disclaimer
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

/**
 * Generate a SOAP note document
 * Structured clinical documentation for patient encounters
 */
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

  // Header
  lines.push(`# SOAP Note`);
  lines.push("");

  // Patient info
  lines.push("## Patient Information");
  lines.push("");
  lines.push(`**Name:** ${patient.name} | **MRN:** ${patient.mrn}`);
  lines.push(`**Provider:** ${patient.provider}`);
  if (includeDateGenerated) {
    lines.push(`**Date of Visit:** ${formatDate(new Date())}`);
  }
  lines.push("");

  // Subjective
  lines.push("## Subjective");
  lines.push("");
  lines.push(subjective);
  lines.push("");

  // Objective
  lines.push("## Objective");
  lines.push("");
  lines.push(objective);
  lines.push("");

  // Assessment
  lines.push("## Assessment");
  lines.push("");
  lines.push(assessment);
  lines.push("");

  // Plan
  lines.push("## Plan");
  lines.push("");
  lines.push(plan);
  lines.push("");

  // Disclaimer
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

/**
 * Generate an assessment detail document with item-level breakdown
 * Shows individual questions and responses for review
 */
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

  // Header
  lines.push(`# ${assessmentName} Assessment`);
  lines.push("");

  // Summary
  lines.push("## Assessment Summary");
  lines.push("");
  lines.push(`**Patient:** ${patientName}`);
  lines.push(`**Total Score:** ${totalScore}/${maxScore}`);
  lines.push(`**Severity Level:** ${severity}`);
  if (includeDateGenerated) {
    lines.push(`**Date Completed:** ${formatDate(new Date())}`);
  }
  lines.push("");

  // Interpretation
  if (interpretation) {
    lines.push("## Interpretation");
    lines.push("");
    lines.push(interpretation);
    lines.push("");
  }

  // Item responses
  lines.push("## Detailed Item Responses");
  lines.push("");
  items.forEach((item, index) => {
    lines.push(`**${index + 1}. ${item.question}**`);
    lines.push(`Response: ${item.response}/${item.maxValue}`);
    lines.push("");
  });

  // Disclaimer
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

/**
 * Generate a clinical handout for patient education
 * Combines condition information with self-care strategies
 */
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

  // Header
  lines.push(`# ${conditionName}`);
  lines.push("");

  // Description
  lines.push("## What You Should Know");
  lines.push("");
  lines.push(description);
  lines.push("");

  // Common symptoms
  lines.push("## Common Symptoms");
  lines.push("");
  symptoms.forEach((symptom) => {
    lines.push(`- ${symptom}`);
  });
  lines.push("");

  // Self-care strategies
  lines.push("## Self-Care Strategies");
  lines.push("");
  selfCareStrategies.forEach((strategy, index) => {
    lines.push(`${index + 1}. ${strategy}`);
  });
  lines.push("");

  // When to seek help
  lines.push("## When to Seek Professional Help");
  lines.push("");
  lines.push(whenToSeekHelp);
  lines.push("");

  // Disclaimer
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

/**
 * Generate a medication education handout
 * Specialized document for patients starting psychiatric medication
 * Covers expectations, what to do, and when to contact provider
 */
export function generateMedicationEducation(
  options: DocumentOptions = {},
): string {
  const { includeDisclaimer = true } = options;

  const lines: string[] = [];

  // Main title
  lines.push("# When Medication Helps — What to Expect");
  lines.push("");

  // What It Is section
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

  // How It May Affect You section
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

  // What You Can Do section
  lines.push("## What You Can Do");
  lines.push("");
  lines.push(
    "1. Take your medication exactly as prescribed, at the same time each day",
  );
  lines.push(
    "2. Keep a simple journal tracking your mood, energy, and any side effects",
  );
  lines.push(
    "3. Maintain regular follow-up appointments with your healthcare provider",
  );
  lines.push(
    "4. Practice self-care: get enough sleep, eat balanced meals, and move your body",
  );
  lines.push("5. Connect with supportive friends, family, or a support group");
  lines.push("");

  // When to Contact Your Provider section
  lines.push("## When to Contact Your Provider");
  lines.push("");
  lines.push("- If side effects are severe or don't improve after a few weeks");
  lines.push("- If you experience thoughts of harming yourself");
  lines.push("- If your symptoms worsen or don't seem to be improving");
  lines.push("- If you have any questions or concerns about your medication");
  lines.push("");

  // Closing message
  lines.push(
    "Remember: You're taking an important step toward feeling better. Be kind to yourself during this process.",
  );
  lines.push("");

  // Disclaimer
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

/**
 * Format a date in a professional clinical format
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format an array of items as a bullet list
 * Returns markdown-formatted list
 */
function formatList(items: string[]): string {
  if (!items || items.length === 0) {
    return "- None reported";
  }
  return items.map((item) => `- ${item}`).join("\n");
}

/**
 * Format a numbered list with proper spacing
 */
export function formatNumberedList(items: string[]): string {
  if (!items || items.length === 0) {
    return "";
  }
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

/**
 * Truncate long paragraphs to maintain readability
 * Ideal for PDF export optimization
 */
export function truncateParagraph(
  text: string,
  maxLength: number = 300,
): string {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  return lastPeriod > maxLength * 0.8
    ? truncated.substring(0, lastPeriod + 1)
    : truncated + "…";
}

/**
 * Calculate readability score (approximate sentence/word count)
 * Useful for validating document complexity
 */
export function getReadabilityMetrics(text: string): {
  words: number;
  sentences: number;
  averageWordLength: number;
} {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const charCount = words.join("").length;

  return {
    words: words.length,
    sentences: sentences.length,
    averageWordLength: charCount / words.length,
  };
}

/**
 * Validate document structure for PDF optimization
 * Returns warnings for potential formatting issues
 */
export function validateDocumentStructure(markdown: string): string[] {
  const warnings: string[] = [];

  // Check for multiple H1 headings
  const h1Count = (markdown.match(/^# /gm) || []).length;
  if (h1Count > 1) {
    warnings.push(
      "Multiple H1 headings detected. Use only one H1 per document.",
    );
  }

  // Check for excessive paragraph length
  const paragraphs = markdown.split(/\n\n+/);
  paragraphs.forEach((para, index) => {
    const words = para.split(/\s+/).length;
    if (words > 150) {
      warnings.push(
        `Paragraph ${index + 1} is very long (${words} words). Consider breaking into smaller sections.`,
      );
    }
  });

  // Check for line length (for readability)
  const lines = markdown.split("\n");
  lines.forEach((line, index) => {
    if (line.length > 100 && !line.startsWith("#") && !line.startsWith("-")) {
      if (
        !warnings.some(
          (w) => w.includes("line length") && w.includes(`line ${index + 1}`),
        )
      ) {
        // Only warn once per issue type
      }
    }
  });

  return warnings;
}

/**
 * Export document as plain text (stripped of markdown formatting)
 * Useful for accessibility or alternative format needs
 */
export function exportAsPlainText(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s+/gm, "") // Remove headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italics
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
    .replace(/^- /gm, "• ") // Convert bullet points
    .replace(/^\d+\. /gm, "") // Keep numbered lists as-is but remove numbers for plain text
    .trim();
}
// ============================================================================
// PDF-LIB INTEGRATION
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
 * Create a professional PDF document from markdown content
 * Uses pdf-lib to generate high-quality PDF files for direct download
 * Supports full markdown formatting with proper headers/footers
 * 1 inch margins with page numbers, patient name, company, and date
 */
export async function createEducationPDF(
  options: PDFOptions,
): Promise<Uint8Array> {
  const {
    title,
    content,
    patientName = "Patient",
    companyName = "Clearpath Health",
  } = options;

  const pdfDoc = await PDFDocument.create();

  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique,
  );
  const helveticaBoldOblique = await pdfDoc.embedFont(
    StandardFonts.HelveticaBoldOblique,
  );

  // Colors
  const darkGray = rgb(0.2, 0.2, 0.2);
  const accentRed = rgb(0.8, 0.1, 0.3);
  const lightGray = rgb(0.7, 0.7, 0.7);

  // 1 inch margins (72 points per inch at 72 DPI)
  const INCH = 72;
  const marginTop = 1 * INCH;
  const marginBottom = 1 * INCH;
  const marginLeft = 1 * INCH;
  const marginRight = 1 * INCH;

  const pageHeight = 792; // Letter height
  const pageWidth = 612; // Letter width
  const contentWidth = pageWidth - marginLeft - marginRight;
  const contentHeight = pageHeight - marginTop - marginBottom;

  const fontSize = 11;
  const lineHeight = fontSize * 1.35;

  // Parse content into sections
  const sections = parseMarkdown(content);
  let pageNumber = 0;
  let pages: any[] = [];
  let currentPage: any = null;
  let yPosition = 0;

  // Helper function to add new page with header/footer
  const addNewPage = () => {
    pageNumber++;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    pages.push(page);

    // Header
    page.drawText(companyName.toUpperCase(), {
      x: marginLeft,
      y: pageHeight - marginTop / 2,
      size: 10,
      font: helveticaBold,
      color: darkGray,
    });

    const dateText = new Date().toLocaleDateString("en-US");
    const dateWidth = dateText.length * 3; // Approximate
    page.drawText(dateText, {
      x: pageWidth - marginRight - dateWidth,
      y: pageHeight - marginTop / 2,
      size: 9,
      font: helvetica,
      color: lightGray,
    });

    // Footer
    page.drawText(`Patient: ${patientName}`, {
      x: marginLeft,
      y: marginBottom / 2,
      size: 9,
      font: helvetica,
      color: lightGray,
    });

    const pageText = `Page ${pageNumber}`;
    const pageWidth_text = pageText.length * 3;
    page.drawText(pageText, {
      x: pageWidth - marginRight - pageWidth_text,
      y: marginBottom / 2,
      size: 9,
      font: helvetica,
      color: lightGray,
    });

    return page;
  };

  currentPage = addNewPage();
  yPosition = pageHeight - marginTop - 24;

  // Draw title
  const titleSize = 18;
  const titleFont = helveticaBold;
  const titleLines = wrapTextSimple(title, titleSize, contentWidth);

  for (const line of titleLines) {
    if (yPosition - lineHeight * 1.5 < marginBottom) {
      currentPage = addNewPage();
      yPosition = pageHeight - marginTop - 24;
    }
    currentPage.drawText(line, {
      x: marginLeft,
      y: yPosition,
      size: titleSize,
      font: titleFont,
      color: accentRed,
    });
    yPosition -= lineHeight * 1.5;
  }

  yPosition -= 12;

  // Process sections
  for (const section of sections) {
    if (section.type === "h1") {
      // H1
      if (yPosition - lineHeight < marginBottom) {
        currentPage = addNewPage();
        yPosition = pageHeight - marginTop - 24;
      }
      currentPage.drawText(section.text, {
        x: marginLeft,
        y: yPosition,
        size: 16,
        font: helveticaBold,
        color: accentRed,
      });
      yPosition -= lineHeight + 4;
    } else if (section.type === "h2") {
      // H2
      if (yPosition - lineHeight < marginBottom) {
        currentPage = addNewPage();
        yPosition = pageHeight - marginTop - 24;
      }
      currentPage.drawText(section.text, {
        x: marginLeft,
        y: yPosition,
        size: 14,
        font: helveticaBold,
        color: accentRed,
      });
      yPosition -= lineHeight + 2;
    } else if (section.type === "h3") {
      // H3
      if (yPosition - lineHeight < marginBottom) {
        currentPage = addNewPage();
        yPosition = pageHeight - marginTop - 24;
      }
      currentPage.drawText(section.text, {
        x: marginLeft,
        y: yPosition,
        size: 12,
        font: helveticaBold,
        color: darkGray,
      });
      yPosition -= lineHeight;
    } else if (section.type === "hr") {
      // Horizontal rule
      if (yPosition - 8 < marginBottom) {
        currentPage = addNewPage();
        yPosition = pageHeight - marginTop - 24;
      }
      currentPage.drawLine({
        start: { x: marginLeft, y: yPosition - 4 },
        end: { x: pageWidth - marginRight, y: yPosition - 4 },
        thickness: 1,
        color: lightGray,
      });
      yPosition -= 12;
    } else if (section.type === "bullet") {
      // Bullet point
      const bulletContent = section.segments || [{ text: section.text }];
      const wrappedLines = wrapFormattedText(
        bulletContent,
        fontSize,
        contentWidth - 20,
        helvetica,
        helveticaBold,
        helveticaOblique,
        helveticaBoldOblique,
      );

      for (const line of wrappedLines) {
        if (yPosition - lineHeight < marginBottom) {
          currentPage = addNewPage();
          yPosition = pageHeight - marginTop - 24;
        }

        // Draw bullet
        currentPage.drawText("•", {
          x: marginLeft + 5,
          y: yPosition,
          size: fontSize,
          font: helvetica,
          color: darkGray,
        });

        // Draw line content
        let xPos = marginLeft + 20;
        for (const segment of line) {
          const font = getFont(
            segment.bold,
            segment.italic,
            helvetica,
            helveticaBold,
            helveticaOblique,
            helveticaBoldOblique,
          );

          currentPage.drawText(segment.text, {
            x: xPos,
            y: yPosition,
            size: fontSize,
            font: font,
            color: darkGray,
          });

          if (segment.underline) {
            const textWidth = segment.text.length * (fontSize * 0.5);
            currentPage.drawLine({
              start: { x: xPos, y: yPosition - 2 },
              end: { x: xPos + textWidth, y: yPosition - 2 },
              thickness: 0.5,
              color: darkGray,
            });
          }

          xPos += segment.text.length * (fontSize * 0.5);
        }

        yPosition -= lineHeight;
      }
    } else if (section.type === "number") {
      // Numbered list
      const bulletContent = section.segments || [{ text: section.text }];
      const wrappedLines = wrapFormattedText(
        bulletContent,
        fontSize,
        contentWidth - 30,
        helvetica,
        helveticaBold,
        helveticaOblique,
        helveticaBoldOblique,
      );

      for (const line of wrappedLines) {
        if (yPosition - lineHeight < marginBottom) {
          currentPage = addNewPage();
          yPosition = pageHeight - marginTop - 24;
        }

        // Draw number
        currentPage.drawText(`${section.index}. `, {
          x: marginLeft + 5,
          y: yPosition,
          size: fontSize,
          font: helvetica,
          color: darkGray,
        });

        // Draw line content
        let xPos = marginLeft + 30;
        for (const segment of line) {
          const font = getFont(
            segment.bold,
            segment.italic,
            helvetica,
            helveticaBold,
            helveticaOblique,
            helveticaBoldOblique,
          );

          currentPage.drawText(segment.text, {
            x: xPos,
            y: yPosition,
            size: fontSize,
            font: font,
            color: darkGray,
          });

          if (segment.underline) {
            const textWidth = segment.text.length * (fontSize * 0.5);
            currentPage.drawLine({
              start: { x: xPos, y: yPosition - 2 },
              end: { x: xPos + textWidth, y: yPosition - 2 },
              thickness: 0.5,
              color: darkGray,
            });
          }

          xPos += segment.text.length * (fontSize * 0.5);
        }

        yPosition -= lineHeight;
      }
    } else if (section.type === "table") {
      // Table rendering
      const table: TableData = section.table;
      if (!table) continue;

      const tableFontSize = 10;
      const tableLineHeight = tableFontSize * 1.3;
      const cellPadding = 4;
      const colCount = table.headers.length;
      const colWidth = contentWidth / colCount;

      // Check page space
      const requiredHeight = (table.rows.length + 2) * tableLineHeight + 8;
      if (yPosition - requiredHeight < marginBottom) {
        currentPage = addNewPage();
        yPosition = pageHeight - marginTop - 24;
      }

      const tableStartY = yPosition;
      let tableX = marginLeft;

      // Draw header row background
      currentPage.drawRectangle({
        x: marginLeft,
        y: yPosition - tableLineHeight - cellPadding * 2,
        width: contentWidth,
        height: tableLineHeight + cellPadding * 2,
        color: lightGray,
      });

      // Draw header cells
      for (let i = 0; i < table.headers.length; i++) {
        currentPage.drawText(table.headers[i], {
          x: marginLeft + i * colWidth + cellPadding,
          y: yPosition - tableLineHeight / 2,
          size: tableFontSize,
          font: helveticaBold,
          color: rgb(1, 1, 1), // White text on gray background
        });
      }

      yPosition -= tableLineHeight + cellPadding * 2;

      // Draw border under header
      currentPage.drawLine({
        start: { x: marginLeft, y: yPosition },
        end: { x: marginLeft + contentWidth, y: yPosition },
        thickness: 1,
        color: darkGray,
      });

      yPosition -= 4;

      // Draw data rows
      for (const row of table.rows) {
        // Check if we need new page for next row
        if (yPosition - tableLineHeight < marginBottom) {
          currentPage = addNewPage();
          yPosition = pageHeight - marginTop - 24;

          // Redraw header on new page
          currentPage.drawRectangle({
            x: marginLeft,
            y: yPosition - tableLineHeight - cellPadding * 2,
            width: contentWidth,
            height: tableLineHeight + cellPadding * 2,
            color: lightGray,
          });

          for (let i = 0; i < table.headers.length; i++) {
            currentPage.drawText(table.headers[i], {
              x: marginLeft + i * colWidth + cellPadding,
              y: yPosition - tableLineHeight / 2,
              size: tableFontSize,
              font: helveticaBold,
              color: rgb(1, 1, 1),
            });
          }

          yPosition -= tableLineHeight + cellPadding * 2;
          currentPage.drawLine({
            start: { x: marginLeft, y: yPosition },
            end: { x: marginLeft + contentWidth, y: yPosition },
            thickness: 1,
            color: darkGray,
          });
          yPosition -= 4;
        }

        // Draw cell borders and content
        for (let i = 0; i < row.cells.length; i++) {
          const cellContent = row.cells[i] || "";

          // Vertical border
          if (i > 0) {
            currentPage.drawLine({
              start: { x: marginLeft + i * colWidth, y: yPosition },
              end: {
                x: marginLeft + i * colWidth,
                y: yPosition - tableLineHeight - cellPadding * 2,
              },
              thickness: 0.5,
              color: lightGray,
            });
          }

          // Cell text
          currentPage.drawText(cellContent, {
            x: marginLeft + i * colWidth + cellPadding,
            y: yPosition - tableLineHeight / 2,
            size: tableFontSize,
            font: helvetica,
            color: darkGray,
          });
        }

        // Bottom border of cell
        currentPage.drawLine({
          start: {
            x: marginLeft,
            y: yPosition - tableLineHeight - cellPadding * 2,
          },
          end: {
            x: marginLeft + contentWidth,
            y: yPosition - tableLineHeight - cellPadding * 2,
          },
          thickness: 0.5,
          color: lightGray,
        });

        yPosition -= tableLineHeight + cellPadding * 2;
      }

      yPosition -= 8;
    } else if (section.type === "paragraph") {
      // Regular paragraph with formatting
      const segments = section.segments || [{ text: section.text }];
      const wrappedLines = wrapFormattedText(
        segments,
        fontSize,
        contentWidth,
        helvetica,
        helveticaBold,
        helveticaOblique,
        helveticaBoldOblique,
      );

      for (const line of wrappedLines) {
        if (yPosition - lineHeight < marginBottom) {
          currentPage = addNewPage();
          yPosition = pageHeight - marginTop - 24;
        }

        let xPos = marginLeft;
        for (const segment of line) {
          const font = getFont(
            segment.bold,
            segment.italic,
            helvetica,
            helveticaBold,
            helveticaOblique,
            helveticaBoldOblique,
          );

          currentPage.drawText(segment.text, {
            x: xPos,
            y: yPosition,
            size: fontSize,
            font: font,
            color: darkGray,
          });

          if (segment.underline) {
            const textWidth = segment.text.length * (fontSize * 0.5);
            currentPage.drawLine({
              start: { x: xPos, y: yPosition - 2 },
              end: { x: xPos + textWidth, y: yPosition - 2 },
              thickness: 0.5,
              color: darkGray,
            });
          }

          xPos += segment.text.length * (fontSize * 0.5);
        }

        yPosition -= lineHeight;
      }

      yPosition -= 4;
    }
  }

  return await pdfDoc.save();
}

/**
 * Parse markdown into structured sections
 */
function parseMarkdown(content: string): Array<{
  type: string;
  text?: string;
  segments?: TextSegment[];
  index?: number;
  table?: TableData;
}> {
  const sections: any[] = [];
  const lines = content.split("\n");
  let numberIndex = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // Check for table (markdown table pattern)
    if (line.startsWith("|") && line.endsWith("|")) {
      // Look ahead to check if next line is separator
      if (
        i + 1 < lines.length &&
        lines[i + 1].trim().match(/^\|[\s\-|:]+\|$/)
      ) {
        // This is a table
        const table = parseTable(lines, i);
        sections.push({
          type: "table",
          table: table.data,
        });
        i = table.endLine + 1;
        continue;
      }
    }

    if (line.startsWith("# ")) {
      sections.push({
        type: "h1",
        text: line.replace(/^# +/, ""),
        segments: parseFormatting(line.replace(/^# +/, "")),
      });
    } else if (line.startsWith("## ")) {
      numberIndex = 0;
      sections.push({
        type: "h2",
        text: line.replace(/^## +/, ""),
        segments: parseFormatting(line.replace(/^## +/, "")),
      });
    } else if (line.startsWith("### ")) {
      sections.push({
        type: "h3",
        text: line.replace(/^### +/, ""),
        segments: parseFormatting(line.replace(/^### +/, "")),
      });
    } else if (/^(---|___|\*\*\*)$/.test(line)) {
      sections.push({ type: "hr" });
    } else if (line.startsWith("- ")) {
      const bulletText = line.replace(/^- +/, "");
      sections.push({
        type: "bullet",
        text: bulletText,
        segments: parseFormatting(bulletText),
      });
    } else if (/^\d+\. /.test(line)) {
      numberIndex++;
      const numberText = line.replace(/^\d+\. +/, "");
      sections.push({
        type: "number",
        text: numberText,
        segments: parseFormatting(numberText),
        index: numberIndex,
      });
    } else {
      sections.push({
        type: "paragraph",
        text: line,
        segments: parseFormatting(line),
      });
    }

    i++;
  }

  return sections;
}

/**
 * Parse markdown formatting within text
 * Supports: **bold**, *italic*, __underline__
 */
function parseFormatting(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let remaining = text;
  let index = 0;

  while (index < remaining.length) {
    // Check for bold
    const boldMatch = remaining.slice(index).match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index === 0) {
      if (index > 0) {
        segments.push({ text: remaining.slice(0, index) });
      }
      segments.push({ text: boldMatch[1], bold: true });
      index += boldMatch[0].length;
      remaining = remaining.slice(boldMatch[0].length);
      index = 0;
      continue;
    }

    // Check for italic
    const italicMatch = remaining.slice(index).match(/\*(.+?)\*/);
    if (italicMatch && italicMatch.index === 0) {
      if (index > 0) {
        segments.push({ text: remaining.slice(0, index) });
      }
      segments.push({ text: italicMatch[1], italic: true });
      index += italicMatch[0].length;
      remaining = remaining.slice(italicMatch[0].length);
      index = 0;
      continue;
    }

    // Check for underline
    const underlineMatch = remaining.slice(index).match(/__(.+?)__/);
    if (underlineMatch && underlineMatch.index === 0) {
      if (index > 0) {
        segments.push({ text: remaining.slice(0, index) });
      }
      segments.push({ text: underlineMatch[1], underline: true });
      index += underlineMatch[0].length;
      remaining = remaining.slice(underlineMatch[0].length);
      index = 0;
      continue;
    }

    index++;
  }

  if (remaining) {
    segments.push({ text: remaining });
  }

  return segments.length > 0 ? segments : [{ text: text }];
}

/**
 * Parse a markdown table
 * Supports standard markdown table format:
 * | Header 1 | Header 2 |
 * |----------|----------|
 * | Cell 1   | Cell 2   |
 */
function parseTable(
  lines: string[],
  startIndex: number,
): { data: TableData; endLine: number } {
  const headerLine = lines[startIndex].trim();
  const headers = headerLine
    .split("|")
    .map((h) => h.trim())
    .filter((h) => h);

  const rows: TableRow[] = [];
  let endLine = startIndex + 1;

  // Skip separator line
  if (
    endLine < lines.length &&
    lines[endLine].trim().match(/^\|[\s\-|:]+\|$/)
  ) {
    endLine++;
  }

  // Parse data rows
  while (endLine < lines.length) {
    const line = lines[endLine].trim();

    // Stop if we hit an empty line or non-table content
    if (!line || !line.startsWith("|")) {
      break;
    }

    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c);

    if (cells.length > 0) {
      rows.push({ cells });
    }

    endLine++;
  }

  return {
    data: { headers, rows },
    endLine: endLine - 1,
  };
}

/**
 * Select appropriate font based on formatting
 */
function getFont(
  bold?: boolean,
  italic?: boolean,
  helvetica?: any,
  helveticaBold?: any,
  helveticaOblique?: any,
  helveticaBoldOblique?: any,
): any {
  if (bold && italic) return helveticaBoldOblique;
  if (bold) return helveticaBold;
  if (italic) return helveticaOblique;
  return helvetica;
}

/**
 * Wrap formatted text to fit within max width
 */
function wrapFormattedText(
  segments: TextSegment[],
  fontSize: number,
  maxWidth: number,
  helvetica: any,
  helveticaBold: any,
  helveticaOblique: any,
  helveticaBoldOblique: any,
): TextSegment[][] {
  const lines: TextSegment[][] = [];
  let currentLine: TextSegment[] = [];
  let currentLineWidth = 0;
  const charWidth = fontSize * 0.5; // Approximate

  for (const segment of segments) {
    const words = segment.text.split(" ");

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordWidth = word.length * charWidth;
      const space = i > 0 ? charWidth : 0;

      if (
        currentLineWidth + wordWidth + space > maxWidth &&
        currentLine.length > 0
      ) {
        lines.push(currentLine);
        currentLine = [];
        currentLineWidth = 0;
      }

      if (currentLine.length === 0) {
        currentLine.push({
          text: word,
          bold: segment.bold,
          italic: segment.italic,
          underline: segment.underline,
        });
      } else {
        currentLine.push({
          text: ` ${word}`,
          bold: segment.bold,
          italic: segment.italic,
          underline: segment.underline,
        });
      }

      currentLineWidth += wordWidth + space;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Simple text wrapping helper for plain text
 */
function wrapTextSimple(
  text: string,
  fontSize: number,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  const charWidth = fontSize * 0.5; // Approximate

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = testLine.length * charWidth;

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
