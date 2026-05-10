"use client";

import { COLORS } from "@/app/components/constants/colors";
import { PHQ9_Q } from "@/app/components/constants/phq9-q";
import { GAD7_Q } from "@/app/components/constants/gad7-q";
import { ItemRow } from "@/app/components/ui/ItemRow";
import { scoreColor } from "@/lib/utils";

interface Patient {
  phq9: { score: number; label: string; si: number; items: number[] };
  gad7: { score: number; label: string; items: number[] };
}

interface AssessmentsTabProps {
  patient: Patient;
}

export const AssessmentsTab: React.FC<AssessmentsTabProps> = ({ patient }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[
        {
          title: "PHQ-9 — PATIENT HEALTH QUESTIONNAIRE",
          score: patient.phq9.score,
          max: 27,
          label: patient.phq9.label,
          items: patient.phq9.items,
          qs: PHQ9_Q,
          color: scoreColor(patient.phq9.score, "phq9"),
          type: "phq9",
        },
        {
          title: "GAD-7 — GENERALIZED ANXIETY DISORDER",
          score: patient.gad7.score,
          max: 21,
          label: patient.gad7.label,
          items: patient.gad7.items,
          qs: GAD7_Q,
          color: scoreColor(patient.gad7.score, "gad7"),
          type: "gad7",
        },
      ].map(({ title, score, max, label, items, qs, color }) => (
        <div
          key={title}
          className="rounded-lg p-4 border"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{ fontSize: 8.5, color: COLORS.muted }}
            className="font-mono letter-spacing-wide mb-1.25 uppercase"
          >
            {title}
          </div>
          <div className="flex items-baseline gap-1.75 mb-3.5">
            <span
              style={{ fontSize: 26, fontWeight: 700, color }}
              className="font-mono"
            >
              {score}
            </span>
            <span style={{ fontSize: 11, color: COLORS.muted }}>
              /{max} · {label}
            </span>
          </div>
          {qs.map((q, i) => (
            <ItemRow
              key={i}
              label={q}
              value={items[i]}
              last={i === qs.length - 1}
            />
          ))}
          {title.includes("PHQ") && (
            <div
              className="mt-2.5 p-1.75 rounded"
              style={{
                background: patient.phq9.si > 0 ? COLORS.redbg : COLORS.greenbg,
                border: `1px solid ${patient.phq9.si > 0 ? COLORS.red : COLORS.green}44`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: patient.phq9.si > 0 ? COLORS.red : COLORS.green,
                }}
                className="font-mono"
              >
                Item 9 (Suicidality): {patient.phq9.si}/3 —{" "}
                {
                  [
                    "Denied",
                    "Passive ideation",
                    "Active, no plan",
                    "Active with plan or intent",
                  ][patient.phq9.si]
                }
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
