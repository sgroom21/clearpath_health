import React from "react";
import { patients } from "./constants/patients";
import { COLORS } from "./constants/colors";
import { scoreColor } from "@/lib/utils";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  time: string;
  type: string;
  provider: string;
  ins: boolean;
  phq9: { score: number; label: string };
  gad7: { score: number; label: string };
}

interface PatientHeaderProps {
  patient: Patient;
  phqC: string;
  gadC: string;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({
  patient,
  phqC,
  gadC,
}) => {
  return (
    <div
      style={{
        padding: "12px 22px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.side,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 3,
            }}
          >
            <div style={{ fontSize: 19, fontWeight: 700, color: COLORS.text }}>
              {patient.name}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: COLORS.muted,
                background: COLORS.card,
                padding: "2px 7px",
                borderRadius: 4,
              }}
            >
              MRN: {patient.mrn}
            </div>
            {!patient.ins && (
              <span
                style={{
                  background: COLORS.redbg,
                  color: COLORS.red,
                  border: `1px solid ${COLORS.red}`,
                  fontSize: 9,
                  fontFamily: "monospace",
                  padding: "2px 6px",
                  borderRadius: 3,
                }}
              >
                INS NOT VERIFIED
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 11,
              color: COLORS.muted,
              display: "flex",
              gap: 10,
            }}
          >
            <span>
              {patient.age}
              {patient.gender} · DOB
            </span>
            <span>·</span>
            <span>
              {patient.time} · {patient.type}
            </span>
            <span>·</span>
            <span>{patient.provider}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {[
            [
              patient.phq9.score,
              27,
              patient.phq9.label,
              "PHQ-9",
              phqC,
            ] as const,
            [
              patient.gad7.score,
              21,
              patient.gad7.label,
              "GAD-7",
              gadC,
            ] as const,
          ].map(([s, mx, lb, nm, col]) => (
            <div
              key={String(nm)}
              style={{
                textAlign: "center",
                background: COLORS.card,
                border: `1px solid ${col}33`,
                borderRadius: 7,
                padding: "6px 12px",
                minWidth: 66,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: COLORS.muted,
                  fontFamily: "monospace",
                  marginBottom: 1,
                }}
              >
                {nm}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: col as string,
                  lineHeight: 1,
                }}
              >
                {s}
              </div>
              <div
                style={{ fontSize: 8.5, color: col as string, marginTop: 1 }}
              >
                {lb}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
