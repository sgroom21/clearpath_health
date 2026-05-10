import { patients } from "@/app/components/constants/patients";

type Patient = (typeof patients)[number];

const buildBase = (patient: Patient) =>
  [
    `Patient:       ${patient.name}, ${patient.age}, ${patient.gender}`,
    `Chief:         ${patient.chief}`,
    `PHQ-9:         ${patient.phq9.score}/27 (${patient.phq9.label}) — SI Item: ${patient.phq9.si}/3`,
    `GAD-7:         ${patient.gad7.score}/21 (${patient.gad7.label})`,
    `Medications:   ${patient.meds.join(", ")}`,
    `Allergies:     ${patient.allergies}`,
    `Substance Use: ${patient.substance}`,
    `Trauma Hx:     ${patient.trauma}`,
    `Prior Tx:      ${patient.priorTx}`,
    `Support:       ${patient.support}`,
    `SMI Dx:        ${patient.smi ?? "None"}`,
    `Attempt Hx:    ${patient.hxAttempt ? patient.attemptDetail : "None"}`,
    `Active SI:     ${patient.activeSI ? "Yes" : "No"}`,
    `Hard Stops:    ${patient.hardStops.length ? patient.hardStops.map((h) => h.code).join(", ") : "None"}`,
  ].join("\n");

export const buildPrompts = (patientId: number, extra: string) => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    throw new Error(`Patient with ID ${patientId} not found`);
  }
  const base = buildBase(patient);

  return {
    summary: `You are a clinical documentation assistant for a telehealth behavioral health practice. Generate a comprehensive patient summary for a new clinician. Include: Presenting Concerns, Assessment Scores & Interpretation, Relevant History, Risk Factors, Protective Factors, and Clinical Impressions. Be thorough but concise.\n\n${base}\n\nWrite the patient summary only.`,

    soap: `You are a clinical documentation assistant. Generate a psychiatric SOAP note pre-populated from intake data. Use standard format (S/O/A/P). Mark visit-dependent items [CLINICIAN TO COMPLETE]. Clinician will review, edit, and sign.\n\n${base}\n\nGenerate the SOAP note only.`,

    differential: `You are a psychiatric clinical decision support tool. Based on this patient's data, generate a differential diagnosis list (3–5 diagnoses) with DSM-5 codes, clinical rationale for each, and recommended next steps. Format each diagnosis clearly.\n\n${base}\n\nProvide the differential diagnosis only.`,

    treatment_plan: `You are a behavioral health treatment planning assistant. Generate an evidence-based treatment plan including: Presenting Problems, Short-Term Goals (4–6 weeks), Long-Term Goals (3–6 months), Recommended Therapeutic Modality, Session Frequency, and Measurable Outcomes. Use professional clinical language.\n\n${base}\n\nGenerate the treatment plan only.`,

    med_recs: `You are a psychiatric prescribing decision support tool for a PMHNP in a telehealth behavioral health practice. Based on this patient's presentation, provide evidence-based medication recommendations. For each recommendation include: Medication, Starting Dose, Titration, Mechanism, EBP Rationale (cite CANMAT, APA, or FDA guidelines where applicable), Contraindications to Check, Monitoring Parameters, and Required Labs Before Starting. Flag DEA schedules. Note: all recommendations require PMHNP clinical judgment.\n\n${base}\n\nProvide medication recommendations only. Do not recommend controlled substances if hard stop CONTROLLED_ codes are present.`,

    lab_recs: `You are a clinical decision support tool for a behavioral health telehealth practice. Based on this patient's presentation, history, and medications, recommend appropriate laboratory workup. For each lab specify: Lab Name, Rationale, Frequency, and Clinical Significance. Include baseline labs for any new medications, monitoring labs for existing medications, and clinically indicated screening labs.\n\n${base}\n\nProvide lab recommendations only.`,

    topic_helper: `You are a clinical session planning assistant for a behavioral health telehealth provider. Based on this patient's scores, chief complaint, and history, suggest 5–7 specific, actionable session topics tailored to this individual. For each topic include: Topic Name, Clinical Rationale, Suggested Therapeutic Approach, and 2–3 specific talking points or questions to use in session.\n\n${base}\n\nProvide session topics only.`,

    loc: `You are a clinical decision support tool. Based on this data, recommend the appropriate level of care (Telehealth Outpatient / In-Person Outpatient / IOP / PHP / Inpatient) with 3–4 sentence rationale.\n\n${base}\n\nProvide recommendation and rationale only.`,

    education: `You are a patient education specialist for a behavioral health practice. Generate a clear, compassionate, jargon-free patient education handout on: "${extra}". Tailor it to this patient's situation. Include: What It Is (1–2 paragraphs), How It May Affect You (1–2 paragraphs), What You Can Do (4–5 actionable steps), and When to Contact Your Provider. Write at a 7th–8th grade reading level with clear headers.\n\nPatient context: ${patient.chief}\nAssessments: PHQ-9 ${patient.phq9.score} (${patient.phq9.label}), GAD-7 ${patient.gad7.score} (${patient.gad7.label})\n\nGenerate the handout only.`,
  };
};
