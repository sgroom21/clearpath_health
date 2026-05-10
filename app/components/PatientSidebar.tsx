import React from "react";
import { COLORS } from "@/app/components/constants/colors";

interface Patient {
  id: number;
  name: string;
  init: string;
  time: string;
  type: string;
  hardStops: Array<{ code: string }>;
  alerts: string[];
}

interface PatientSidebarProps {
  patients: Patient[];
  selectedId: number;
  onSelectPatient: (id: number) => void;
  onSelectTab: (tab: string) => void;
  role: string;
  onRoleChange: (role: string) => void;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({
  patients,
  selectedId,
  onSelectPatient,
  onSelectTab,
  role,
  onRoleChange,
}) => {
  const statCount = (pred: (p: Patient) => boolean) =>
    patients.filter(pred).length;

  return (
    <div
      className="flex flex-col shrink-0"
      style={{
        width: 260,
        background: COLORS.side,
        borderRight: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "14px",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: COLORS.teal,
            letterSpacing: 2,
            marginBottom: 3,
          }}
        >
          CLEARPATH HEALTH
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
          Clinical Dashboard
        </div>
        <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>
          Behavioral Health · Telehealth
        </div>
      </div>

      {/* Role Toggle */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: COLORS.muted,
            letterSpacing: 1.5,
            marginBottom: 6,
          }}
        >
          ACTIVE ROLE
        </div>
        <div
          style={{
            display: "flex",
            background: COLORS.surf,
            borderRadius: 7,
            padding: 3,
            gap: 3,
          }}
        >
          {["PMHNP", "Therapist"].map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 5,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                background: role === r ? COLORS.teal : "transparent",
                color: role === r ? "#fff" : COLORS.muted,
                transition: "all .15s",
              }}
            >
              {r}
            </button>
          ))}
        </div>
        {role !== "PMHNP" && (
          <div
            style={{
              fontSize: 9,
              color: COLORS.muted,
              marginTop: 5,
              fontStyle: "italic",
            }}
          >
            Prescribing features hidden
          </div>
        )}
      </div>

      {/* Stats */}
      <div
        className="flex gap-1.5"
        style={{
          padding: "8px 14px",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {[
          ["QUEUE", statCount(() => true), COLORS.blue] as const,
          [
            "STOPS",
            statCount((p) => p.hardStops.length > 0),
            COLORS.red,
          ] as const,
          [
            "ALERTS",
            statCount((p) => p.alerts.length > 0 && p.hardStops.length === 0),
            COLORS.amber,
          ] as const,
        ].map(([l, n, col]) => (
          <div
            key={String(l)}
            style={{
              flex: 1,
              textAlign: "center",
              background: COLORS.card,
              borderRadius: 5,
              padding: "5px 2px",
            }}
          >
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                fontFamily: "monospace",
                color: col as string,
              }}
            >
              {n}
            </div>
            <div
              style={{
                fontSize: 7.5,
                fontFamily: "monospace",
                color: COLORS.muted,
                letterSpacing: 0.5,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Patient List */}
      <div style={{ overflowY: "auto", flex: 1, padding: "6px" }}>
        <div
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: COLORS.muted,
            letterSpacing: 1.5,
            padding: "4px 8px 6px",
          }}
        >
          TODAY'S SCHEDULE
        </div>
        {patients.map((p) => {
          const hs = p.hardStops.length > 0;
          const al = p.alerts.length > 0 && !hs;
          return (
            <div
              key={p.id}
              onClick={() => {
                onSelectPatient(p.id);
                onSelectTab("overview");
              }}
              style={{
                padding: "9px 10px",
                marginBottom: 3,
                borderRadius: 7,
                cursor: "pointer",
                background: p.id === selectedId ? COLORS.surf : "transparent",
                border: `1px solid ${p.id === selectedId ? COLORS.border : "transparent"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: hs ? COLORS.redbg : "#0A2035",
                    border: `1px solid ${hs ? COLORS.red : COLORS.blue}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: hs ? COLORS.red : COLORS.teallt,
                    fontFamily: "monospace",
                  }}
                >
                  {p.init}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: COLORS.muted,
                      fontFamily: "monospace",
                    }}
                  >
                    {p.time}
                  </div>
                </div>
                {hs && (
                  <span
                    style={{
                      background: COLORS.red,
                      color: "#fff",
                      fontSize: 8,
                      fontFamily: "monospace",
                      padding: "1px 5px",
                      borderRadius: 3,
                    }}
                  >
                    STOP
                  </span>
                )}
                {al && (
                  <span
                    style={{
                      background: COLORS.amber,
                      color: "#000",
                      fontSize: 8,
                      fontFamily: "monospace",
                      padding: "1px 5px",
                      borderRadius: 3,
                    }}
                  >
                    ALERT
                  </span>
                )}
                {!hs && !al && (
                  <span
                    style={{
                      background: COLORS.greenbg,
                      color: COLORS.green,
                      border: `1px solid ${COLORS.green}33`,
                      fontSize: 8,
                      fontFamily: "monospace",
                      padding: "1px 5px",
                      borderRadius: 3,
                    }}
                  >
                    OK
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 9.5,
                  color: COLORS.muted,
                  paddingLeft: 35,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.type}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 14px",
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ fontSize: 9, color: COLORS.muted, lineHeight: 1.4 }}>
          ✦ AI outputs require clinician review & sign-off
        </div>
      </div>
    </div>
  );
};

export default PatientSidebar;
