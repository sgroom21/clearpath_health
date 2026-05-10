import { COLORS } from "@/app/components/constants/colors";

interface Badge {
  bg: string;
  fg: string;
  text: string;
}

interface AIBlockProps {
  label: string;
  result: string | undefined;
  loading: boolean;
  onGenerate: () => void;
  disabled?: boolean;
  note?: string;
  badge?: Badge;
}

export const AIBlock: React.FC<AIBlockProps> = ({
  label,
  result,
  loading,
  onGenerate,
  disabled = false,
  note,
  badge,
}) => {
  return (
    <div className="mb-4.5">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div
            style={{ fontSize: 10, color: COLORS.muted }}
            className="font-mono letter-spacing-wide uppercase"
          >
            {label}
          </div>
          {badge && (
            <span
              style={{
                background: badge.bg,
                color: badge.fg,
                fontSize: 8,
                padding: "1px 6px",
                borderRadius: 3,
                fontWeight: 600,
              }}
              className="font-mono"
            >
              {badge.text}
            </span>
          )}
        </div>
        {disabled ? (
          <span
            style={{ fontSize: 10, color: COLORS.muted }}
            className="italic"
          >
            {note}
          </span>
        ) : (
          <button
            onClick={onGenerate}
            disabled={loading}
            style={{
              background: loading ? COLORS.surf : COLORS.teal,
              border: "none",
              borderRadius: 5,
              padding: "5px 12px",
              color: "#fff",
              fontSize: 11,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.65 : 1,
            }}
            className="font-mono"
          >
            {loading ? "⟳ Generating…" : "✦ Generate"}
          </button>
        )}
      </div>

      {result ? (
        <div
          className="rounded-lg p-3.5 border"
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
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
      ) : (
        <div
          className="rounded-lg p-4 text-center border-2"
          style={{
            background: COLORS.surf,
            borderColor: COLORS.border,
            borderStyle: "dashed",
            color: COLORS.muted,
            fontSize: 12,
          }}
        >
          {disabled
            ? "Feature not available for this role"
            : "Click Generate to produce AI-assisted output"}
        </div>
      )}
    </div>
  );
};
