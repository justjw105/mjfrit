import type { ReactNode } from "react";
import { Fragment } from "react";
import Image from "next/image";

/**
 * A small, dependency-free renderer for the simple Markdown subset the blog
 * admin editor supports: headings (#, ##, ###), **bold**, *italic*, links
 * [text](url), images ![alt](url), unordered lists (- item), and
 * blank-line-separated paragraphs. Intentionally not a full CommonMark
 * implementation — just enough for studio-journal-style posts without
 * adding a new dependency to the build.
 */

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Order matters: images before links (both use [..](..)), then bold, then italic.
  const pattern = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      // Inline image: ![alt](url)
      nodes.push(
        <img
          key={`${keyPrefix}-${i++}`}
          src={match[2]}
          alt={match[1] || ""}
          className="inline-block max-h-96 rounded-md my-2 align-middle"
        />
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <a
          key={`${keyPrefix}-${i++}`}
          href={match[4]}
          className="text-accent underline hover:no-underline"
          target={match[4].startsWith("http") ? "_blank" : undefined}
          rel={match[4].startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {match[3]}
        </a>
      );
    } else if (match[5] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[5]}</strong>);
    } else if (match[6] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-${i++}`}>{match[6]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export function renderMarkdown(source: string): ReactNode {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let blockIndex = 0;

  function flushParagraph() {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(" ");
      blocks.push(
        <p key={`p-${blockIndex++}`} className="text-lg leading-relaxed text-foreground/90 mb-6">
          {renderInline(text, `p-${blockIndex}`)}
        </p>
      );
      paragraphBuffer = [];
    }
  }

  function flushList() {
    if (listBuffer.length > 0) {
      blocks.push(
        <ul key={`ul-${blockIndex++}`} className="list-disc pl-6 space-y-2 mb-6 text-lg text-foreground/90">
          {listBuffer.map((item, idx) => (
            <li key={idx}>{renderInline(item, `li-${blockIndex}-${idx}`)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    // A line that is ONLY an image gets full-width figure treatment
    // (as opposed to an image referenced mid-sentence, handled inline).
    const soloImageMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line.trim());
    if (soloImageMatch) {
      flushParagraph();
      flushList();
      const alt = soloImageMatch[1];
      const url = soloImageMatch[2];
      blocks.push(
        <figure key={`img-${blockIndex++}`} className="my-8">
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-md">
            <Image src={url} alt={alt || "Blog post image"} fill className="object-cover" />
          </div>
          {alt && (
            <figcaption className="text-sm text-center text-muted-foreground mt-2">{alt}</figcaption>
          )}
        </figure>
      );
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const content = renderInline(headingMatch[2], `h-${blockIndex}`);
      if (level === 1) {
        blocks.push(
          <h2 key={`h-${blockIndex++}`} className="text-3xl font-bold font-headline text-primary mt-10 mb-4">
            {content}
          </h2>
        );
      } else if (level === 2) {
        blocks.push(
          <h3 key={`h-${blockIndex++}`} className="text-2xl font-bold font-headline text-primary mt-8 mb-3">
            {content}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={`h-${blockIndex++}`} className="text-xl font-bold font-headline text-primary mt-6 mb-2">
            {content}
          </h4>
        );
      }
      continue;
    }

    const listMatch = /^[-*]\s+(.*)$/.exec(line);
    if (listMatch) {
      flushParagraph();
      listBuffer.push(listMatch[1]);
      continue;
    }

    paragraphBuffer.push(line.trim());
  }

  flushParagraph();
  flushList();

  return <Fragment>{blocks}</Fragment>;
}
