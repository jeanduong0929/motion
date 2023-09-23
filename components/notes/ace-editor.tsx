"use client";
import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/keybinding-vim";
import ace from "ace-builds/src-noconflict/ace";

const Ace = () => {
  return (
    <>
      <AceEditor
        style={{ width: "50%", height: "100vh" }}
        className="font-mono"
        mode="markdown"
        theme="one_dark"
        name="markdown_editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          fontSize: "16px",
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          keyboardHandler: "ace/keyboard/vim",
        }}
        onLoad={(editor) => {
          ace.config.loadModule("ace/keyboard/vim", function (m: any) {
            const Vim = m.Vim;
            // Insert mode
            Vim && Vim.map("jj", "<Esc>", "insert");
            Vim && Vim.map("dw", "<C-w>", "insert");

            // Normal mode
            Vim && Vim.map("E", "$", "normal");
            Vim && Vim.map("B", "0", "normal");
            Vim && Vim.map("dw", 've"_d', "normal");
            Vim && Vim.map("J", "5j", "normal");
            Vim && Vim.map("K", "5k", "normal");
            Vim && Vim.map("D", 'V"_d', "normal");

            // Visual mode
            Vim && Vim.map("E", "$", "visual");
            Vim && Vim.map("B", "0", "visual");
            Vim && Vim.map("J", "5j", "visual");
            Vim && Vim.map("K", "5k", "visula");
          });
        }}
      />
    </>
  );
};

export default Ace;
