"use client";

import { COLORS } from "@/app/components/constants/colors";
import { AIBlock } from "@/app/components/ui/AIBlock";

interface AIToolkitTabProps {
  results: Record<string, string | undefined>;
  loading: Record<string, boolean>;
  onGenerate: (type: string) => void;
  isNP: boolean;
  onShowToast: (msg: string, color: string) => void;
}

export const AIToolkitTab: React.FC<AIToolkitTabProps> = ({
  results,
  loading,
  onGenerate,
  isNP,
  onShowToast,
}) => {
  return (
    <div>
      <div
        className="rounded-lg p-2.5 mb-5 flex gap-2"
        style={{
          background: "#0A1A2E",
          border: `1px solid ${COLORS.purple}33`,
        }}
      >
        <span style={{ fontSize: 14 }}>✦</span>
        <div>
          <div
            style={{ fontSize: 12, fontWeight: 600, color: "#C4B5FD" }}
            className="mb-0.5"
          >
            AI Clinical Toolkit
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted }}>
            Documentation and decision support tools. All require clinician
            review. Medication recommendations available to PMHNP role only.
          </div>
        </div>
      </div>

      <AIBlock
        label="Patient Summary"
        result={results["summary"]}
        loading={loading["summary"] || false}
        onGenerate={() => onGenerate("summary")}
      />

      <AIBlock
        label="SOAP Note (Pre-populated)"
        result={results["soap"]}
        loading={loading["soap"] || false}
        onGenerate={() => onGenerate("soap")}
      />

      <AIBlock
        label="Medication Recommendations — Evidence-Based"
        result={results["med_recs"]}
        loading={loading["med_recs"] || false}
        onGenerate={() => onGenerate("med_recs")}
        disabled={!isNP}
        note="Available to PMHNP role only"
        badge={
          isNP
            ? {
                text: "PMHNP",
                bg: "#1A2E4A",
                fg: COLORS.teallt,
              }
            : undefined
        }
      />

      {isNP && results["med_recs"] && (
        <div className="mt-[-2.5rem] mb-4.5 flex gap-2">
          <button
            onClick={() =>
              onShowToast("Opening eScript integration…", COLORS.teal)
            }
            className="rounded p-1.5 border"
            style={{
              background: "#0A2035",
              borderColor: COLORS.teal,
              color: COLORS.teallt,
              fontSize: 11,
              fontFamily: "monospace",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            💊 Open eScript
          </button>
          <button
            onClick={() =>
              onShowToast("eScript queued for review", COLORS.green)
            }
            className="rounded p-1.5 border"
            style={{
              background: COLORS.greenbg,
              borderColor: COLORS.green,
              color: COLORS.green,
              fontSize: 11,
              fontFamily: "monospace",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            ✓ Queue for Signing
          </button>
        </div>
      )}

      <AIBlock
        label="Lab Recommendations"
        result={results["lab_recs"]}
        loading={loading["lab_recs"] || false}
        onGenerate={() => onGenerate("lab_recs")}
        badge={
          isNP
            ? {
                text: "ORDER LABS",
                bg: "#1A2E1A",
                fg: COLORS.green,
              }
            : undefined
        }
      />

      {results["lab_recs"] && (
        <div className="mt-[-2.5rem] mb-4.5">
          <button
            onClick={() =>
              onShowToast("Lab orders sent to integration", COLORS.green)
            }
            className="rounded p-1.5 border"
            style={{
              background: COLORS.greenbg,
              borderColor: COLORS.green,
              color: COLORS.green,
              fontSize: 11,
              fontFamily: "monospace",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            🧪 Send Lab Orders
          </button>
        </div>
      )}

      <AIBlock
        label="Session Topic Helper"
        result={results["topic_helper"]}
        loading={loading["topic_helper"] || false}
        onGenerate={() => onGenerate("topic_helper")}
      />
    </div>
  );
};
