import { COLORS } from "@/app/components/constants/colors";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.65 }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 style={{ fontSize: 15, fontWeight: 700, color: COLORS.teallt, marginBottom: 8, marginTop: 12 }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: 13, fontWeight: 600, color: COLORS.teallt, marginBottom: 6, marginTop: 10 }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: 12, fontWeight: 600, color: "#C4B5FD", marginBottom: 4, marginTop: 8 }}>{children}</h3>,
                p:  ({ children }) => <p style={{ marginBottom: 8, marginTop: 0 }}>{children}</p>,
                ul: ({ children }) => <ul style={{ paddingLeft: 18, marginBottom: 8, marginTop: 4 }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: 18, marginBottom: 8, marginTop: 4 }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: 3 }}>{children}</li>,
                strong: ({ children }) => <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{children}</strong>,
                hr: () => <hr style={{ borderColor: COLORS.border, margin: "10px 0" }} />,
                code: ({ children }) => <code style={{ background: "#0A1A2E", padding: "1px 5px", borderRadius: 3, fontSize: 11, color: COLORS.teallt }}>{children}</code>,
                table: ({ children }) => (
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8, fontSize: 11 }}>{children}</table>
                ),
                th: ({ children }) => (
                  <th style={{ textAlign: "left", padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.teallt, fontWeight: 600 }}>{children}</th>
                ),
                td: ({ children }) => (
                  <td style={{ padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}44`, color: COLORS.text, verticalAlign: "top" }}>{children}</td>
                ),
                tr: ({ children }) => <tr>{children}</tr>,
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
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
