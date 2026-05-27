"use client";

/**
 * MarkdownEditor — Obsidian-style inline editor for generated handout content.
 *
 * Usage:
 *   <MarkdownEditor
 *     value={markdownString}
 *     onChange={setMarkdownString}
 *     readOnly={false}
 *   />
 *
 * Features
 *  • Toggle between Edit (raw markdown) and Preview (rendered HTML) modes
 *  • Toolbar: bold, italic, H2, H3, bullet list, numbered list, horizontal rule
 *  • Keyboard shortcuts: Ctrl/Cmd + B (bold), I (italic), K (link)
 *  • Preview renders markdown to styled HTML — matching how the PDF will look
 *  • Dark-mode aware via CSS variables (Clearpath colour palette)
 */

import { useState, useRef, useCallback, KeyboardEvent } from "react";

// ── types ────────────────────────────────────────────────────────────────────
interface Props {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  minHeight?: number;   // px, default 420
}

// ── tiny markdown → HTML renderer (no dependencies) ─────────────────────────
function renderMarkdown(md: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const inlineFormat = (s: string) =>
    s
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g,     "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g,         "<em>$1</em>")
      .replace(/__(.+?)__/g,         "<u>$1</u>")
      .replace(/`(.+?)`/g,           "<code>$1</code>");

  const lines = md.split("\n");
  const out: string[] = [];
  let inUL = false, inOL = false, inTable = false, tableHdr = false;

  const closeList = () => {
    if (inUL) { out.push("</ul>"); inUL = false; }
    if (inOL) { out.push("</ol>"); inOL = false; }
  };
  const closeTable = () => {
    if (inTable) { out.push("</tbody></table>"); inTable = false; tableHdr = false; }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw  = lines[i];
    const line = raw.trim();

    // blank line
    if (!line) {
      closeList();
      closeTable();
      out.push("<p style='margin:0;height:.6em'></p>");
      continue;
    }

    // headings
    if (line.startsWith("# "))   { closeList(); closeTable(); out.push(`<h1>${inlineFormat(escape(line.slice(2)))}</h1>`); continue; }
    if (line.startsWith("## "))  { closeList(); closeTable(); out.push(`<h2>${inlineFormat(escape(line.slice(3)))}</h2>`); continue; }
    if (line.startsWith("### ")) { closeList(); closeTable(); out.push(`<h3>${inlineFormat(escape(line.slice(4)))}</h3>`); continue; }

    // horizontal rule
    if (/^(---|___|\*\*\*)$/.test(line)) { closeList(); closeTable(); out.push("<hr/>"); continue; }

    // table
    if (line.startsWith("|") && line.endsWith("|")) {
      closeList();
      const cells = line.split("|").map(c => c.trim()).filter(Boolean);
      // separator row?
      if (cells.every(c => /^[-:]+$/.test(c))) {
        tableHdr = false; // separator consumed — next rows are body
        continue;
      }
      if (!inTable) {
        inTable = true; tableHdr = true;
        out.push('<table><thead><tr>');
        cells.forEach(c => out.push(`<th>${inlineFormat(escape(c))}</th>`));
        out.push('</tr></thead>');
        continue;
      }
      if (tableHdr) {
        // this shouldn't normally happen, but handle gracefully
        out.push('<tbody>');
        tableHdr = false;
      }
      out.push('<tr>');
      cells.forEach(c => out.push(`<td>${inlineFormat(escape(c))}</td>`));
      out.push('</tr>');
      continue;
    }

    closeTable();

    // bullet
    if (line.startsWith("- ")) {
      if (inOL) { out.push("</ol>"); inOL = false; }
      if (!inUL) { out.push("<ul>"); inUL = true; }
      out.push(`<li>${inlineFormat(escape(line.slice(2)))}</li>`);
      continue;
    }

    // numbered list
    if (/^\d+\. /.test(line)) {
      if (inUL) { out.push("</ul>"); inUL = false; }
      if (!inOL) { out.push("<ol>"); inOL = true; }
      out.push(`<li>${inlineFormat(escape(line.replace(/^\d+\. /, "")))}</li>`);
      continue;
    }

    closeList();
    out.push(`<p>${inlineFormat(escape(line))}</p>`);
  }

  closeList();
  closeTable();
  return out.join("\n");
}

// ── preview styles ────────────────────────────────────────────────────────────
const PREVIEW_CSS = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  line-height: 1.7;
  color: #e0e0e0;
  padding: 0;

  h1 { font-size: 1.55em; font-weight: 700; color: #e05577; margin: .9em 0 .15em;
       border-bottom: 1.5px solid #e05577; padding-bottom: .15em; }
  h2 { font-size: 1.15em; font-weight: 700; color: #cc3355; margin: 1.1em 0 .2em; }
  h3 { font-size: 1em; font-weight: 700; color: #d4d4d4; margin: .9em 0 .15em; }
  p  { margin: .35em 0; }
  ul, ol { padding-left: 1.4em; margin: .4em 0; }
  li { margin: .18em 0; }
  hr { border: none; border-top: 1px solid #444; margin: 1em 0; }
  strong { color: #fff; }
  code   { background: #2a2a2a; border-radius: 3px; padding: 1px 4px; font-size: .9em; }
  u      { text-decoration-color: #888; }
  table  { border-collapse: collapse; width: 100%; margin: .6em 0; font-size: .92em; }
  th     { background: #303030; color: #fff; font-weight: 700; text-align: left;
           padding: 5px 8px; border: 1px solid #444; }
  td     { padding: 4px 8px; border: 1px solid #333; }
  tr:nth-child(even) td { background: #1e1e1e; }
`;

// ── toolbar button ────────────────────────────────────────────────────────────
function TBtn({
  label,
  title,
  onClick,
  active,
}: {
  label: string;
  title: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: active ? "#333" : "none",
        border: "none",
        borderRadius: 4,
        color: active ? "#e05577" : "#aaa",
        cursor: "pointer",
        fontSize: 12,
        fontFamily: "monospace",
        fontWeight: 600,
        padding: "3px 7px",
        minWidth: 28,
        transition: "color .15s, background .15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = active ? "#e05577" : "#aaa"; }}
    >
      {label}
    </button>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function MarkdownEditor({ value, onChange, readOnly = false, minHeight = 420 }: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("preview");
  const taRef = useRef<HTMLTextAreaElement>(null);

  // ── wrap selection with prefix/suffix ──────────────────────────────────────
  const wrapSelection = useCallback(
    (prefix: string, suffix: string, placeholder = "text") => {
      const ta = taRef.current;
      if (!ta) return;
      const { selectionStart: ss, selectionEnd: se } = ta;
      const selected = value.slice(ss, se) || placeholder;
      const next = value.slice(0, ss) + prefix + selected + suffix + value.slice(se);
      onChange(next);
      // restore selection after React re-render
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(ss + prefix.length, ss + prefix.length + selected.length);
      }, 0);
    },
    [value, onChange],
  );

  // ── insert at cursor or line start ─────────────────────────────────────────
  const insertLinePrefix = useCallback(
    (prefix: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const pos = ta.selectionStart;
      const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
      const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
      onChange(next);
      setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + prefix.length, pos + prefix.length); }, 0);
    },
    [value, onChange],
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const pos = ta.selectionStart;
      const next = value.slice(0, pos) + text + value.slice(pos);
      onChange(next);
      setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + text.length, pos + text.length); }, 0);
    },
    [value, onChange],
  );

  // ── keyboard shortcuts ─────────────────────────────────────────────────────
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === "b") { e.preventDefault(); wrapSelection("**", "**"); }
    if (mod && e.key === "i") { e.preventDefault(); wrapSelection("*", "*"); }
    if (mod && e.key === "k") { e.preventDefault(); wrapSelection("[", "](url)"); }

    // Tab → 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      insertAtCursor("  ");
    }
  };

  const toolbar = !readOnly && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "4px 8px",
        borderBottom: "1px solid #2d2d2d",
        flexWrap: "wrap",
      }}
    >
      <TBtn label="B"  title="Bold (Ctrl+B)"  onClick={() => wrapSelection("**", "**")} />
      <TBtn label="I"  title="Italic (Ctrl+I)" onClick={() => wrapSelection("*", "*")} />
      <TBtn label="U"  title="Underline"       onClick={() => wrapSelection("__", "__")} />

      <span style={{ width: 1, height: 18, background: "#333", margin: "0 4px" }} />

      <TBtn label="H2" title="Heading 2" onClick={() => insertLinePrefix("## ")} />
      <TBtn label="H3" title="Heading 3" onClick={() => insertLinePrefix("### ")} />

      <span style={{ width: 1, height: 18, background: "#333", margin: "0 4px" }} />

      <TBtn label="•"  title="Bullet list"   onClick={() => insertLinePrefix("- ")} />
      <TBtn label="1." title="Ordered list"  onClick={() => insertLinePrefix("1. ")} />
      <TBtn label="—"  title="Horizontal rule" onClick={() => insertAtCursor("\n---\n")} />

      <span style={{ width: 1, height: 18, background: "#333", margin: "0 4px" }} />

      <TBtn label="`" title="Inline code" onClick={() => wrapSelection("`", "`")} />
    </div>
  );

  const tabBar = (
    <div
      style={{
        display: "flex",
        gap: 0,
        padding: "0 10px",
        borderBottom: "1px solid #2d2d2d",
        background: "#161616",
      }}
    >
      {(["preview", "edit"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          style={{
            background: "none",
            border: "none",
            borderBottom: `2px solid ${mode === m ? "#e05577" : "transparent"}`,
            color: mode === m ? "#e05577" : "#666",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            padding: "7px 12px",
            textTransform: "capitalize",
            letterSpacing: "0.04em",
            transition: "color .15s",
          }}
        >
          {m === "edit" ? "✎ Edit" : "👁 Preview"}
        </button>
      ))}

      {!readOnly && (
        <span
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", fontSize: 10, color: "#555", paddingRight: 4 }}
        >
          Ctrl+B · Ctrl+I · Ctrl+K
        </span>
      )}
    </div>
  );

  return (
    <div
      style={{
        border: "1px solid #2d2d2d",
        borderRadius: 8,
        overflow: "hidden",
        background: "#141414",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {tabBar}
      {mode === "edit" && toolbar}

      {mode === "edit" ? (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          readOnly={readOnly}
          spellCheck
          style={{
            background: "#141414",
            color: "#d4d4d4",
            border: "none",
            outline: "none",
            padding: "14px 16px",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', monospace",
            fontSize: 12.5,
            lineHeight: 1.75,
            resize: "vertical",
            minHeight,
            width: "100%",
            boxSizing: "border-box",
            tabSize: 2,
            caretColor: "#e05577",
          }}
        />
      ) : (
        <div
          style={{ padding: "16px 20px", minHeight, overflowY: "auto" }}
          // Rendered markdown is generated internally from user-entered text
          // (no external HTML injection) — this is safe.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `<style>
              .md-preview { ${PREVIEW_CSS} }
              .md-preview h1, .md-preview h2, .md-preview h3,
              .md-preview p, .md-preview ul, .md-preview ol,
              .md-preview table, .md-preview hr { all: revert; }
              .md-preview { ${PREVIEW_CSS} }
            </style><div class="md-preview">${renderMarkdown(value)}</div>`,
          }}
        />
      )}
    </div>
  );
}
