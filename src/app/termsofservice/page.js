import fs from "fs";
import path from "path";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Terms of Use | Giigs",
  description: "The terms that govern your use of Giigs.",
};

// Inline formatting: **bold**, [label](url), `code`
function renderInline(text, keyPrefix) {
  const nodes = [];
  const regex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      nodes.push(
        <a
          key={`${keyPrefix}-l-${i++}`}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words text-blue-400 underline hover:text-blue-300"
        >
          {match[4]}
        </a>
      );
    } else if (match[6]) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i++}`}
          className="break-words rounded bg-gray-800 px-1 py-0.5 text-sm text-purple-300"
        >
          {match[7]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let key = 0;

  lines.forEach((line) => {
    if (!line.trim()) return;

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const inner = renderInline(heading[2], `h-${key}`);
      if (level === 1) {
        blocks.push(
          <h1 key={key++} className="mb-4 mt-2 text-4xl font-bold text-white">
            {inner}
          </h1>
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={key++} className="mb-3 mt-10 text-2xl font-bold text-white">
            {inner}
          </h2>
        );
      } else if (level === 3) {
        blocks.push(
          <h3 key={key++} className="mb-2 mt-6 text-xl font-bold text-white">
            {inner}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={key++} className="mb-2 mt-4 text-lg font-semibold text-white">
            {inner}
          </h4>
        );
      }
      return;
    }

    const bullet = line.match(/^(\s*)-\s+(.*)$/);
    if (bullet) {
      const indentSpaces = bullet[1].replace(/\t/g, "  ").length;
      const indentLevel = Math.floor(indentSpaces / 2);
      blocks.push(
        <div
          key={key++}
          className="mb-2 flex leading-relaxed text-[#ADB7BE]"
          style={{ marginLeft: 8 + indentLevel * 20 }}
        >
          <span className="mr-2 select-none">&bull;</span>
          <span className="flex-1">{renderInline(bullet[2], `li-${key}`)}</span>
        </div>
      );
      return;
    }

    blocks.push(
      <p key={key++} className="mb-3 leading-relaxed text-[#ADB7BE]">
        {renderInline(line.trim(), `p-${key}`)}
      </p>
    );
  });

  return blocks;
}

const TermsOfService = () => {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "src/app/termsofservice/termsofservice.md"),
    "utf8"
  );
  const content = renderMarkdown(markdown);

  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-12">
        <article className="max-w-none">{content}</article>
      </div>
      <Footer />
    </main>
  );
};

export default TermsOfService;
