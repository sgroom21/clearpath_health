import { COLORS } from "@/app/components/constants/colors";

interface RingProps {
  score: number;
  max: number;
  color: string;
  label: string;
  sub: string;
}

export const Ring: React.FC<RingProps> = ({
  score,
  max,
  color,
  label,
  sub,
}) => {
  const r = 32;
  const ci = 2 * Math.PI * r;
  const d = (score / max) * ci;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg
          width="78"
          height="78"
          viewBox="0 0 78 78"
          className="rotate-[-90deg]"
        >
          <circle
            cx="39"
            cy="39"
            r={r}
            fill="none"
            stroke={COLORS.border}
            strokeWidth="6"
          />
          <circle
            cx="39"
            cy="39"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${d} ${ci}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            style={{ color, fontSize: 18, fontWeight: 700 }}
            className="font-mono leading-none"
          >
            {score}
          </span>
          <span style={{ fontSize: 9, color: COLORS.muted }}>/{max}</span>
        </div>
      </div>
      <div className="text-center">
        <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.text }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color }}>{sub}</div>
      </div>
    </div>
  );
};
