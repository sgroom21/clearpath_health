import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D1B2A",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              letterSpacing: 3,
              color: "#4DD9AC",
              marginBottom: 4,
            }}
          >
            CLEARPATH HEALTH
          </div>
          <div style={{ fontSize: 13, color: "#64748B" }}>
            Clinical Dashboard · Behavioral Health
          </div>
        </div>
        <SignIn />
      </div>
    </main>
  );
}