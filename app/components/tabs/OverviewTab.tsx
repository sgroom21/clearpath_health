"use client";

import { COLORS } from "@/app/components/constants/colors";
import { StopCard } from "@/app/components/ui/StopCard";
import { AlertCard } from "@/app/components/ui/AlertCard";
import { Ring } from "@/app/components/ui/Ring";
import { scoreColor } from "@/lib/utils";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  chief: string;
  meds: string[];
  allergies: string;
  substance: string;
  trauma: string;
  priorTx: string;
  support: string;
  smi: string | null;
  phq9: { score: number; label: string; si: number };
  gad7: { score: number; label: string };
  hxAttempt: boolean;
  attemptDetail: string | null;
  activeSI: boolean;
  controlled: boolean;
  controlledDetail: string | null;
  hardStops: Array<{
    code: string;
    title: string;
    detail: string;
    action: string;
  }>;
  alerts: string[];
  ins: boolean;
}

interface OverviewTabProps {
  patient: Patient;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ patient }) => {
  const phqC = scoreColor(patient.phq9.score, "phq9");
  const gadC = scoreColor(patient.gad7.score, "gad7");
  const hasHS = patient.hardStops.length > 0;

  return (
    <div>
      {patient.hardStops.map((s, i) => (
        <StopCard key={i} stop={s} />
      ))}
      {patient.alerts.map((a, i) => (
        <AlertCard key={i} text={a} />
      ))}
      {!hasHS && !patient.alerts.length && (
        <div
          className="rounded-lg p-2.5 mb-4 flex gap-2"
          style={{
            background: COLORS.greenbg,
            border: `1px solid ${COLORS.green}44`,
          }}
        >
          <span>✅</span>
          <span style={{ fontSize: 12, color: COLORS.green }}>
            No hard stops or alerts. Patient appears appropriate for telehealth.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mt-3.5">
        {/* Chief Complaint */}
        <div
          className="lg:col-span-2 rounded-lg p-4 border"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{ fontSize: 8.5, color: COLORS.muted }}
            className="font-mono letter-spacing-wide mb-1.5 uppercase"
          >
            Chief Complaint
          </div>
          <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
            {patient.chief}
          </div>
        </div>

        {/* Assessment Scores */}
        <div
          className="rounded-lg p-4 border"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{ fontSize: 8.5, color: COLORS.muted }}
            className="font-mono letter-spacing-wide mb-3 uppercase"
          >
            Assessment Scores
          </div>
          <div className="flex justify-around">
            <Ring
              score={patient.phq9.score}
              max={27}
              color={phqC}
              label="PHQ-9"
              sub={patient.phq9.label}
            />
            <Ring
              score={patient.gad7.score}
              max={21}
              color={gadC}
              label="GAD-7"
              sub={patient.gad7.label}
            />
          </div>
        </div>

        {/* Clinical Flags */}
        <div
          className="rounded-lg p-4 border"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{ fontSize: 8.5, color: COLORS.muted }}
            className="font-mono letter-spacing-wide mb-2.5 uppercase"
          >
            Clinical Flags
          </div>
          {[
            [
              "Suicide Attempt Hx",
              patient.hxAttempt,
              patient.hxAttempt ? COLORS.red : COLORS.green,
              patient.attemptDetail,
            ] as const,
            [
              "Active SI",
              patient.activeSI,
              patient.activeSI ? COLORS.red : COLORS.green,
              null,
            ] as const,
            [
              "PHQ-9 Item 9",
              patient.phq9.si > 0,
              patient.phq9.si >= 2
                ? COLORS.red
                : patient.phq9.si === 1
                  ? COLORS.amber
                  : COLORS.green,
              `Score: ${patient.phq9.si}/3`,
            ] as const,
            [
              "Controlled Substance Req.",
              patient.controlled,
              patient.controlled ? COLORS.red : COLORS.green,
              patient.controlledDetail,
            ] as const,
            [
              "SMI Diagnosis",
              !!patient.smi,
              patient.smi ? COLORS.red : COLORS.green,
              patient.smi,
            ] as const,
            [
              "Insurance Verified",
              patient.ins,
              patient.ins ? COLORS.green : COLORS.red,
              null,
            ] as const,
          ].map(([lbl, flagged, col, detail]) => (
            <div
              key={String(lbl)}
              className="flex items-start gap-2 p-1 border-b"
              style={{ borderColor: `${COLORS.border}18` }}
            >
              <span style={{ fontSize: 12, marginTop: 1 }}>
                {!flagged || col === COLORS.green ? "✅" : "🔴"}
              </span>
              <div className="flex-1">
                <div style={{ fontSize: 11, color: COLORS.text }}>{lbl}</div>
                {detail && (
                  <div
                    style={{ fontSize: 10, color: col as string, marginTop: 1 }}
                  >
                    {detail}
                  </div>
                )}
              </div>
              <span
                style={{ fontSize: 10, color: col as string, fontWeight: 600 }}
                className="font-mono"
              >
                {flagged ? "YES" : "NO"}
              </span>
            </div>
          ))}
        </div>

        {/* Intake Summary */}
        <div
          className="rounded-lg p-4 border"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{ fontSize: 8.5, color: COLORS.muted }}
            className="font-mono letter-spacing-wide mb-2.5 uppercase"
          >
            Intake Summary
          </div>
          {[
            ["Medications", patient.meds.join(", ")],
            ["Allergies", patient.allergies],
            ["Substance Use", patient.substance],
            ["Trauma Hx", patient.trauma],
            ["Prior Treatment", patient.priorTx],
            ["Social Support", patient.support],
          ].map(([k, v]) => (
            <div
              key={String(k)}
              className="grid gap-2 p-1 border-b"
              style={{
                gridTemplateColumns: "110px 1fr",
                borderColor: `${COLORS.border}18`,
              }}
            >
              <div
                style={{ fontSize: 10, color: COLORS.muted }}
                className="font-mono"
              >
                {k}
              </div>
              <div
                style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.4 }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
