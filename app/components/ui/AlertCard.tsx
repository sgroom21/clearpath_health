import { COLORS } from "@/app/components/constants/colors";

interface AlertCardProps {
  text: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({ text }) => {
  return (
    <div
      className="rounded p-2 mb-1.5 flex gap-2 border-l-4"
      style={{
        background: COLORS.amberbg,
        border: `1px solid ${COLORS.amber}44`,
        borderLeftColor: COLORS.amber,
        borderLeftWidth: 3,
      }}
    >
      <span style={{ fontSize: 12 }}>⚠</span>
      <span style={{ fontSize: 12, color: "#fde68a", lineHeight: 1.4 }}>
        {text}
      </span>
    </div>
  );
};
