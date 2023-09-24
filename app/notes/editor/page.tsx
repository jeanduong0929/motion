"use client";
import Ace from "@/components/notes/ace-editor";
import EditorDropdown from "@/components/notes/editor-dropdown";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
import { ScrollArea } from "@/components/ui/scroll-area";

const Editor = () => {
  const [value, setValue] = React.useState<string>("");

  return (
    <>
      <nav className="bg-zinc-800 px-5 py-3 flex justify-end">
        <EditorDropdown />
      </nav>

      <div className="flex w-full h-full mb-10">
        <Ace setValue={setValue} />

        <ScrollArea className="h-[100vh] w-1/2">
          <ReactMarkdown
            className="markdown-body prose"
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={gruvboxDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {value}
          </ReactMarkdown>
        </ScrollArea>
      </div>
    </>
  );
};

export default Editor;
