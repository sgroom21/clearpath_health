"use client";

import { COLORS } from "@/app/components/constants/colors";
import { EDU_LIBRARY } from "@/app/components/constants/edu-lib";
import { useState } from "react";

interface EducationTabProps {
  patientName: string;
  result: string | undefined;
  loading: boolean;
  onGenerate: (topic: string) => void;
  noteItems: string[];
  sentItems: string[];
  onAddToNote: (topic: string) => void;
  onSendToPatient: (topic: string) => void;
  onDownloadPDF: () => void;
  onShowToast: (msg: string, color: string) => void;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  patientName,
  result,
  loading,
  onGenerate,
  noteItems,
  sentItems,
  onAddToNote,
  onSendToPatient,
  onDownloadPDF,
  onShowToast,
}) => {
  const [eduCat, setEduCat] = useState("Depression");
  const [eduTopic, setEduTopic] = useState<string | null>(null);

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div
            style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}
            className="mb-0.75"
          >
            Patient Education Library
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted }}>
            Select a category and topic to generate a personalized patient
            handout.
          </div>
        </div>
        {noteItems.length > 0 && (
          <div
            className="rounded-lg p-2 text-right"
            style={{
              background: COLORS.greenbg,
              border: `1px solid ${COLORS.green}`,
            }}
          >
            <div
              style={{ fontSize: 10, color: COLORS.green }}
              className="font-mono mb-0.5"
            >
              ATTACHED TO NOTE
            </div>
            <div style={{ fontSize: 11, color: COLORS.text }}>
              {noteItems.length} item{noteItems.length > 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4.5">
        {Object.keys(EDU_LIBRARY).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setEduCat(cat);
              setEduTopic(null);
            }}
            style={{
              background: eduCat === cat ? COLORS.teal : COLORS.card,
              border: `1px solid ${eduCat === cat ? COLORS.teal : COLORS.border}`,
              color: eduCat === cat ? "#fff" : COLORS.muted,
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 20,
              cursor: "pointer",
              fontFamily: "sans-serif",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        {/* Topic List */}
        <div
          className="rounded-lg p-3 border"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{ fontSize: 8.5, color: COLORS.muted }}
            className="font-mono letter-spacing-wide mb-2 uppercase"
          >
            {eduCat.toUpperCase()} — TOPICS
          </div>
          {EDU_LIBRARY[eduCat as keyof typeof EDU_LIBRARY].map((topic) => (
            <div
              key={topic}
              onClick={() => setEduTopic(topic)}
              style={{
                padding: "9px 10px",
                borderRadius: 6,
                cursor: "pointer",
                marginBottom: 3,
                background:
                  eduTopic === topic ? `${COLORS.teal}22` : COLORS.surf,
                border: `1px solid ${eduTopic === topic ? COLORS.teal : COLORS.border}44`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: eduTopic === topic ? COLORS.teal : COLORS.border,
                }}
              >
                →
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: eduTopic === topic ? COLORS.text : COLORS.light,
                  lineHeight: 1.3,
                }}
              >
                {topic}
              </span>
            </div>
          ))}
        </div>

        {/* Handout Area */}
        <div
          className="rounded-lg p-4 border"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {!eduTopic ? (
            <div
              className="flex flex-col items-center justify-center h-64 text-center"
              style={{ color: COLORS.muted, fontSize: 13 }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div>Select a topic to generate a patient handout</div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3.5">
                <div>
                  <div
                    style={{ fontSize: 8.5, color: COLORS.muted }}
                    className="font-mono letter-spacing-wide mb-1"
                  >
                    PATIENT EDUCATION HANDOUT
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.text,
                    }}
                  >
                    {eduTopic}
                  </div>
                  <div
                    style={{ fontSize: 11, color: COLORS.muted }}
                    className="mt-0.5"
                  >
                    For: {patientName}
                  </div>
                </div>
                <button
                  onClick={() => onGenerate(eduTopic)}
                  disabled={loading}
                  style={{
                    background: loading ? COLORS.surf : COLORS.purple,
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 14px",
                    color: "#fff",
                    fontSize: 11,
                    fontFamily: "monospace",
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.65 : 1,
                  }}
                >
                  {loading ? "⟳ Generating…" : "✦ Generate Handout"}
                </button>
              </div>

              {result ? (
                <>
                  <div
                    className="rounded-lg p-3.5 mb-3 border"
                    style={{
                      background: COLORS.surf,
                      border: `1px solid ${COLORS.border}`,
                      maxHeight: 280,
                      overflowY: "auto",
                    }}
                  >
                    <pre
                      style={{
                        fontSize: 12,
                        color: COLORS.text,
                        lineHeight: 1.65,
                        whiteSpace: "pre-wrap",
                        margin: 0,
                      }}
                      className="font-sans"
                    >
                      {result}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!noteItems.includes(eduTopic)) {
                          onAddToNote(eduTopic);
                          onShowToast(
                            `"${eduTopic}" added to note`,
                            COLORS.teal,
                          );
                        } else {
                          onShowToast("Already attached to note", COLORS.amber);
                        }
                      }}
                      style={{
                        background: "#0A2035",
                        border: `1px solid ${COLORS.teal}`,
                        color: COLORS.teallt,
                        fontSize: 11,
                        fontFamily: "monospace",
                        padding: "7px 14px",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                    >
                      📎 Add to Note
                    </button>
                    <button
                      onClick={() => {
                        onSendToPatient(eduTopic);
                        onShowToast(
                          `Handout sent to ${patientName}`,
                          COLORS.green,
                        );
                      }}
                      style={{
                        background: COLORS.greenbg,
                        border: `1px solid ${COLORS.green}`,
                        color: COLORS.green,
                        fontSize: 11,
                        fontFamily: "monospace",
                        padding: "7px 14px",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                    >
                      📤 Send to Patient
                    </button>
                    <button
                      onClick={() => {
                        onDownloadPDF();
                        onShowToast("Handout downloaded as PDF", COLORS.purple);
                      }}
                      style={{
                        background: COLORS.purplebg,
                        border: `1px solid ${COLORS.purple}`,
                        color: "#C4B5FD",
                        fontSize: 11,
                        fontFamily: "monospace",
                        padding: "7px 14px",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                    >
                      ⬇ Download PDF
                    </button>
                  </div>

                  {sentItems.includes(eduTopic) && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 10,
                        color: COLORS.green,
                      }}
                      className="font-mono"
                    >
                      ✓ Sent to {patientName}
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="rounded-lg p-6 text-center border-2"
                  style={{
                    background: COLORS.surf,
                    borderColor: COLORS.border,
                    borderStyle: "dashed",
                    color: COLORS.muted,
                    fontSize: 12,
                  }}
                >
                  Click Generate to create a personalized handout for{" "}
                  {patientName}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
