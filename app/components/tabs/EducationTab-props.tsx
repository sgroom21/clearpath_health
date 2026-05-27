"use client";
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
