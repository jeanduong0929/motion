"use client";
import Ace from "@/components/notes/ace-editor";
import EditorDropdown from "@/components/notes/editor-dropdown";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import "github-markdown-css";

const Editor = () => {
  const [value, setValue] = React.useState<string>("");

  return (
    <>
      <nav className="bg-zinc-800 px-5 py-3 flex justify-between items-center">
        <EditorDropdown />
      </nav>
      <div className="flex w-full h-full">
        <Ace setValue={setValue} />
        <div className="w-1/2 h-screen bg-zinc-900 flex flex-col gap-5">
          <ReactMarkdown
            children={value}
            className="markdown-body prose"
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <Prism
                    {...props}
                    children={String(children).replace(/\n$/, "")}
                    style={dark}
                    language={match[1]}
                    PreTag="div"
                  />
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          ></ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default Editor;
