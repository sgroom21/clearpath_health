"use client";

import { useState } from "react";
import { patients } from "@/app/components/constants/patients";
import { COLORS } from "@/app/components/constants/colors";
import { buildPrompts } from "@/lib/instructions";
import { OverviewTab } from "@/app/components/tabs/OverviewTab";
import { AssessmentsTab } from "@/app/components/tabs/AssessmentsTab";
import { ClinicalPlanTab } from "@/app/components/tabs/ClinicalPlanTab";
import { AIToolkitTab } from "@/app/components/tabs/AIToolkitTab";
import { EducationTab } from "@/app/components/tabs/EducationTab";
import { scoreColor } from "@/lib/utils";
import PatientHeader from "@/app/components/Header";
import PatientSidebar from "@/app/components/PatientSidebar";

export default function Dashboard() {
  const [selId, setSelId] = useState(1);
  const [tab, setTab] = useState("overview");
  const [role, setRole] = useState("PMHNP");
  const [aiR, setAiR] = useState<Record<string, string>>({});
  const [ldg, setLdg] = useState<Record<string, boolean>>({});
  const [eduCat, setEduCat] = useState("Depression");
  const [noteItems, setNoteItems] = useState<string[]>([]);
  const [sentItems, setSentItems] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(
    null,
  );

  const pat = patients.find((p) => p.id === selId)!;
  const phqC = scoreColor(pat.phq9.score, "phq9");
  const gadC = scoreColor(pat.gad7.score, "gad7");
  const hasHS = pat.hardStops.length > 0;

  const showToast = (msg: string, color: string = COLORS.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const callAI = async (type: string, extra: string = "") => {
    const key = `${pat.id}-${type}`;
    setLdg((p) => ({ ...p, [type]: true }));

    const prompt = buildPrompts(pat.id, extra);
    const promptText = prompt[type as keyof typeof prompt];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "", instruction: promptText }),
      });

      const data = await res.json();
      setAiR((p) => ({ ...p, [key]: data.reply || "No response generated." }));
    } catch (error) {
      setAiR((p) => ({ ...p, [key]: "Error connecting to AI service." }));
    } finally {
      setLdg((p) => ({ ...p, [type]: false }));
    }
  };

  const getR = (type: string) => aiR[`${pat.id}-${type}`];
  const isNP = role === "PMHNP";

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "assessments", label: "Assessments" },
    { key: "clinical_plan", label: "Clinical Plan" },
    { key: "ai_toolkit", label: "✦ AI Toolkit" },
    { key: "education", label: "Education Library" },
  ];

  return (
    <>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            background: toast.color,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "0 4px 20px rgba(0,0,0,.4)",
          }}
          className="font-mono"
        >
          {toast.msg}
        </div>
      )}

      <div
        className="flex h-screen overflow-hidden"
        style={{ background: COLORS.bg, color: COLORS.text }}
      >
        {/* SIDEBAR */}
        <PatientSidebar
          patients={patients}
          selectedId={selId}
          onSelectPatient={setSelId}
          onSelectTab={setTab}
          role={role}
          onRoleChange={setRole}
        />

        {/* MAIN */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Patient Header */}
          <PatientHeader patient={pat} phqC={phqC} gadC={gadC} />

          {/* Hard Stop Banner */}
          {hasHS && (
            <div
              className="flex items-center gap-2 px-5.5 py-2 shrink-0"
              style={{
                background: "#160606",
                borderBottom: `2px solid ${COLORS.red}`,
              }}
            >
              <span>🛑</span>
              <span
                style={{ fontSize: 11, color: COLORS.red, fontWeight: 700 }}
                className="font-mono letter-spacing-wide"
              >
                {pat.hardStops.length} HARD STOP
                {pat.hardStops.length > 1 ? "S" : ""} ACTIVE — TELEHEALTH VISIT
                CANNOT PROCEED
              </span>
            </div>
          )}

          {/* Tabs */}
          <div
            className="flex border-b shrink-0 px-5.5"
            style={{ borderColor: COLORS.border }}
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "11px 16px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 500,
                  color: tab === t.key ? COLORS.teallt : COLORS.muted,
                  borderBottom: `2px solid ${tab === t.key ? COLORS.teal : "transparent"}`,
                  marginBottom: -1,
                }}
              >
                {t.label}
                {t.key === "education" && noteItems.length > 0 && (
                  <span
                    style={{
                      marginLeft: 5,
                      background: COLORS.teal,
                      color: "#fff",
                      fontSize: 8.5,
                      borderRadius: 10,
                      padding: "1px 5px",
                      fontFamily: "monospace",
                    }}
                  >
                    {noteItems.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5.5">
            {tab === "overview" && <OverviewTab patient={pat} />}
            {tab === "assessments" && <AssessmentsTab patient={pat} />}
            {tab === "clinical_plan" && (
              <ClinicalPlanTab
                results={aiR}
                loading={ldg}
                onGenerate={callAI}
              />
            )}
            {tab === "ai_toolkit" && (
              <AIToolkitTab
                results={aiR}
                loading={ldg}
                onGenerate={callAI}
                isNP={isNP}
                onShowToast={showToast}
              />
            )}
            {tab === "education" && (
              <EducationTab
                patientName={pat.name}
                result={getR("education")}
                loading={ldg["education"] || false}
                onGenerate={(topic) => callAI("education", topic)}
                noteItems={noteItems}
                sentItems={sentItems}
                onAddToNote={(topic) => setNoteItems((p) => [...p, topic])}
                onSendToPatient={(topic) => setSentItems((p) => [...p, topic])}
                onDownloadPDF={() =>
                  showToast("Handout downloaded as PDF", COLORS.purple)
                }
                onShowToast={showToast}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
