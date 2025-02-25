/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";

export const PolicyEditor = ({
  onChange,
  defaultValue,
}: {
  onChange?: (value: string | null | undefined) => void;
  defaultValue?: string;
}) => {
  const { theme } = useTheme();
  const editorRef = useRef(null);

  const parent = useRef<HTMLDivElement | null>(null);

  function handleEditorOnMount(editor: any, _monaco: any) {
    editorRef.current = editor;
    const handler = editor.onDidChangeModelDecorations((_: any) => {
      handler.dispose();
      editor.getAction("editor.action.formatDocument").run();
    });
  }

  return (
    <div ref={parent} className="w-full">
      <Editor
        className="flex items-center justify-center bg-red-500"
        // beforeMount={(m) => {
        //   // vercel thing, basename type gets widened when building prod
        //   //m.editor.defineTheme("night-owl", nightOwlTheme as any);
        // }}
        onMount={handleEditorOnMount}
        height={"200px"}
        theme={
          theme === "dark" ? "vs-dark" : theme === "light" ? "light" : "vs-dark"
        }
        defaultValue={defaultValue ?? ""}
        //language="json"
        defaultLanguage="json"
        onChange={(v) => onChange?.(v)}
        //value={defaultValue ?? ""}
        options={{
          minimap: { enabled: false },
          lineNumbers: "on",
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
        }}
      />
    </div>
  );
};
