import { COLORS } from "@/app/components/constants/colors";

interface ItemRowProps {
  label: string;
  value: number;
  last?: boolean;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  label,
  value,
  last = false,
}) => {
  const colors = [COLORS.green, "#84cc16", COLORS.amber, COLORS.red];

  return (
    <div
      className="grid gap-2 items-center"
      style={{
        gridTemplateColumns: "1fr 30px 90px",
        padding: "6px 0",
        borderBottom: last ? "none" : `1px solid ${COLORS.border}18`,
      }}
    >
      <div style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.3 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 11,
          color: colors[value],
          fontWeight: 600,
          textAlign: "center",
        }}
        className="font-mono"
      >
        {value}
      </div>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= value ? colors[value] : COLORS.border,
            }}
          />
        ))}
      </div>
    </div>
  );
};
