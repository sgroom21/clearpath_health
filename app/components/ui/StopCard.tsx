import { COLORS } from "@/app/components/constants/colors";

interface Stop {
  code: string;
  title: string;
  detail: string;
  action: string;
}

interface StopCardProps {
  stop: Stop;
}

export const StopCard: React.FC<StopCardProps> = ({ stop }) => {
  return (
    <div
      className="rounded-lg p-3 mb-2.5 border-l-4"
      style={{
        background: COLORS.redbg,
        border: `1px solid ${COLORS.red}`,
        borderLeftColor: COLORS.red,
        borderLeftWidth: 4,
      }}
    >
      <div
        style={{ fontSize: 9, color: COLORS.red }}
        className="font-mono letter-spacing-wide mb-0.75"
      >
        🛑 HARD STOP — {stop.code}
      </div>
      <div
        style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}
        className="mb-1.25"
      >
        {stop.title}
      </div>
      <div
        style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.5 }}
        className="mb-2"
      >
        {stop.detail}
      </div>
      <div
        className="rounded p-2.5"
        style={{ background: "rgba(220,38,38,.1)" }}
      >
        <div
          style={{ fontSize: 9, color: COLORS.red }}
          className="font-mono mb-0.5"
        >
          REQUIRED ACTION
        </div>
        <div style={{ fontSize: 12, color: "#fecaca", fontWeight: 500 }}>
          {stop.action}
        </div>
      </div>
    </div>
  );
};
