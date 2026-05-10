import { COLORS } from "@/app/components/constants/colors";

export function scoreColor(
  score: number,
  type: "phq9" | "gad7" = "gad7",
): string {
  if (type === "phq9") {
    if (score <= 4) return COLORS.green;
    if (score <= 9) return "#84cc16";
    if (score <= 14) return COLORS.amber;
    if (score <= 19) return "#f97316";
    return COLORS.red;
  }

  // GAD7
  if (score <= 4) return COLORS.green;
  if (score <= 9) return "#84cc16";
  if (score <= 14) return COLORS.amber;
  return COLORS.red;
}

export function itemColor(value: number): string {
  return (
    [COLORS.green, "#84cc16", COLORS.amber, COLORS.red][value] || COLORS.red
  );
}
