import React from "react";
import { useState } from "react";

const AiGen = () => {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const prompts = {
    summary: "patient-summary",
    soap: "soap-note",
    differential: "differential-diagnosis",
    treatment_plan: "treatment-plan",
    med_recs: "medication-recommendations",
    lab_recs: "lab-recommendations",
    topic_helper: "session-topics",
    loc: "level-of-care",
    education: "education-handout",
  };

  async function HandlePrompt(instruction: string, id: string) {
    if (!input) return;
    setActiveId(id);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, instruction }),
    });

    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
    setActiveId(null);
  }
  return (
    <main className="flex flex-col h-screen p-4 gap-4">
      <div>
        {Object.entries(prompts).map(([key, instruction]) => {
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          return (
            <button
              key={key}
              onClick={() => HandlePrompt(instruction, key)}
              disabled={loading}
            >
              {loading && activeId === key ? "Generating..." : label}
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default AiGen;
