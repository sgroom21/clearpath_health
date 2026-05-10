"use client";

import { COLORS } from "@/app/components/constants/colors";
import { AIBlock } from "@/app/components/ui/AIBlock";

interface ClinicalPlanTabProps {
  results: Record<string, string | undefined>;
  loading: Record<string, boolean>;
  onGenerate: (type: string) => void;
}

export const ClinicalPlanTab: React.FC<ClinicalPlanTabProps> = ({
  results,
  loading,
  onGenerate,
}) => {
  return (
    <div>
      <div
        className="rounded-lg p-2.5 mb-5 flex gap-2"
        style={{
          background: "#0A1A2E",
          border: `1px solid ${COLORS.teal}33`,
        }}
      >
        <span style={{ fontSize: 14 }}>✦</span>
        <div>
          <div
            style={{ fontSize: 12, fontWeight: 600, color: COLORS.teallt }}
            className="mb-0.5"
          >
            AI Clinical Decision Support
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted }}>
            All outputs are AI-generated clinical suggestions. Review, modify,
            and sign off before any clinical use. AI does not replace clinical
            judgment.
          </div>
        </div>
      </div>

      <AIBlock
        label="Differential Diagnosis"
        result={results["differential"]}
        loading={loading["differential"] || false}
        onGenerate={() => onGenerate("differential")}
      />
      <AIBlock
        label="Treatment Plan"
        result={results["treatment_plan"]}
        loading={loading["treatment_plan"] || false}
        onGenerate={() => onGenerate("treatment_plan")}
      />
      <AIBlock
        label="Level of Care Recommendation"
        result={results["loc"]}
        loading={loading["loc"] || false}
        onGenerate={() => onGenerate("loc")}
      />
    </div>
  );
};
