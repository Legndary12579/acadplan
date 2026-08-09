// Lightweight markdown-to-JSX renderer (no external dependency).
// Handles headers, bullets, numbered lists, dividers, and inline
// bold/italic/code — enough for AI-generated responses without
// pulling in a full markdown library.

export function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      elements.push(<div key={key++} className="h-2" />);
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold mt-6 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-base font-semibold mt-4 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C7D2FE" }}>
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 py-0.5">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#4F46E5" }} />
          <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}
            dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[-*] /, "")) }} />
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={key++} className="flex items-start gap-3 py-0.5">
          <span className="flex-shrink-0 w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center mt-0.5"
            style={{ background: "rgba(79,70,229,0.2)", color: "#818CF8" }}>
            {num}
          </span>
          <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}
            dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^\d+\.\s/, "")) }} />
        </div>
      );
    } else if (line.startsWith("---")) {
      elements.push(<div key={key++} className="my-4" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />);
    } else {
      elements.push(
        <p key={key++} className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}
          dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

export function InlineMarkdown({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return <span className={className} style={style} dangerouslySetInnerHTML={{ __html: formatInline(text) }} />;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#E2E8F0;font-weight:600">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#C7D2FE">$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(79,70,229,0.15);color:#C7D2FE;padding:1px 6px;border-radius:4px;font-size:0.8em">$1</code>');
}
