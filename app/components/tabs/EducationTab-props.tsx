"use client";

/**
 * EducationTab.tsx — updated props + MarkdownEditor wiring.
 *
 * Changes vs original:
 *  - Accepts editedContent / onEditedContentChange from Dashboard
 *    (Dashboard owns the state so it survives tab switches)
 *  - onDownloadPDF signature extended to (id?: number, content?: string)
 *  - Replaces any static result display with <MarkdownEditor />
 *
 * Everything else (generate button, add-to-note, send-to-patient, etc.)
 * is unchanged — slot it in where your existing JSX lives.
 */

import MarkdownEditor from "@/app/components/MarkdownEditor"; // adjust path if needed

// ── Updated prop types ────────────────────────────────────────────────────────
interface EducationTabProps {
  patientName:            string;
  result?:                string;           // raw AI output (read-only source)
  resultId?:              number;
  loading:                boolean;
  onGenerate:             (topic: string) => void;
  noteItems:              string[];
  sentItems:              string[];
  onAddToNote:            (topic: string) => void;
  onSendToPatient:        (topic: string) => void;
  // ── new props ──────────────────────────────────────────────────────────────
  editedContent:          string;           // user-editable copy, owned by Dashboard
  onEditedContentChange:  (v: string) => void;
  onDownloadPDF:          (id?: number, content?: string) => void;
  onShowToast:            (msg: string, color?: string) => void;
}

// ── Inside your EducationTab component, replace the result display block ─────
//
// BEFORE — something like:
//   {result && (
//     <div style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#ccc" }}>
//       {result}
//     </div>
//   )}
//
// AFTER:
function ResultSection({
  result,
  editedContent,
  onEditedContentChange,
  resultId,
  onDownloadPDF,
}: Pick<EducationTabProps, "result" | "editedContent" | "onEditedContentChange" | "resultId" | "onDownloadPDF">) {
  if (!result) return null;

  return (
    <div style={{ marginTop: 16 }}>
      {/* Label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: "0.06em" }}>
          GENERATED HANDOUT — EDIT BEFORE DOWNLOADING
        </span>

        <button
          onClick={() => onDownloadPDF(resultId, editedContent)}
          style={{
            background: "#7c3aed",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            padding: "5px 12px",
            letterSpacing: "0.04em",
          }}
        >
          ↓ Download PDF
        </button>
      </div>

      {/* Editable / previewable markdown */}
      <MarkdownEditor
        value={editedContent}
        onChange={onEditedContentChange}
        minHeight={460}
      />
    </div>
  );
}

// ── Export the updated prop type so Dashboard stays in sync ──────────────────
export type { EducationTabProps };
export { ResultSection };
