"use client";

import {
  useEditor,
  useEditorState,
  EditorContent,
  Editor as TiptapEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import SaveStatus from "./SaveStatus";
import { useReport } from "@/contexts/ReportContext";
import { useCallback, useEffect, useState, useRef } from "react";
import { editorEvents } from '@/lib/editorEvents';

function ToolbarButton({
  onClick,
  active,
  children,
}: Readonly<{
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  isSaving = false,
  hasError = false,
  isSaved = true,
}: Readonly<{
  editor: TiptapEditor;
  isSaving?: boolean;
  hasError?: boolean;
  isSaved?: boolean;
}>) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: e }: { editor: TiptapEditor }) => ({
      isBold: e.isActive("bold"),
      isItalic: e.isActive("italic"),
      isStrike: e.isActive("strike"),
      isCode: e.isActive("code"),
      isH1: e.isActive("heading", { level: 1 }),
      isH2: e.isActive("heading", { level: 2 }),
      isH3: e.isActive("heading", { level: 3 }),
      isBulletList: e.isActive("bulletList"),
      isOrderedList: e.isActive("orderedList"),
      isBlockquote: e.isActive("blockquote"),
      isCodeBlock: e.isActive("codeBlock"),
    }),
  });

  return (
    <div className="flex flex-wrap justify-between items-center gap-1 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
      <div className="flex flex-wrap gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editorState.isBold}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editorState.isItalic}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editorState.isStrike}
        >
          S
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editorState.isCode}
        >
          Code
        </ToolbarButton>

        <div className="mx-1 w-px bg-zinc-200 dark:bg-zinc-700" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editorState.isH1}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editorState.isH2}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editorState.isH3}
        >
          H3
        </ToolbarButton>

        <div className="mx-1 w-px bg-zinc-200 dark:bg-zinc-700" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editorState.isBulletList}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editorState.isOrderedList}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editorState.isBlockquote}
        >
          Quote
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editorState.isCodeBlock}
        >
          Code Block
        </ToolbarButton>

        <div className="mx-1 w-px bg-zinc-200 dark:bg-zinc-700" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </ToolbarButton>
      </div>
      <div>
        <SaveStatus isSaving={isSaving} hasError={hasError} isSaved={isSaved} />
      </div>
    </div>
  );
}

// debounce 
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function Editor() {
  const report = useReport();
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaveError, setHasSaveError] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const editorRef = useRef<TiptapEditor | null>(null);
  const isFirstRender = useRef(true);

  const editor = useEditor({
    editable: !report?.isVerified,
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
    ],
    content: report?.content || {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Start writing your medical report here...",
            },
          ],
        },
      ],
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc max-w-none min-h-[300px] focus:outline-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      // handle editor updates
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      
      setIsSaved(false);
      const content = editor.getJSON();
      debouncedSave(content);
    },
  });

  useEffect(() => {
  if (!editor) return;
  
  const unsubscribe = editorEvents.listenForCorrection((correctionText) => {
    // add the correction as a paragraph at the end of text
    editor.commands.focus();
    editor.commands.insertContent({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: correctionText,
        },
      ],
    });
    // add empty paragraph after
    editor.commands.insertContent({
      type: 'paragraph',
      content: [],
    });
  });
  
  return unsubscribe;
  }, [editor]);

  // store editor reference
  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);

  // save 
  const saveContent = useCallback(async (content: any) => {
    if (!report?.reportId) {
      console.log('No reportId, skipping save');
      return;
    }
    
    setIsSaving(true);
    setHasSaveError(false);
    
    try {
      const response = await fetch(`/api/reports/${report.reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      setIsSaved(true);
      setHasSaveError(false);
    } catch (error) {
      console.error('Autosave failed:', error);
      setHasSaveError(true);
      setIsSaved(false);
    } finally {
      setIsSaving(false);
    }
  }, [report?.reportId]);

  // debounced save function
  const debouncedSave = useCallback(
    debounce((content: any) => {
      saveContent(content);
    }, 1500),
    [saveContent]
  );

  // update editor content when report changes
  useEffect(() => {
    if (editor && report?.content) {
      const currentContent = editor.getJSON();
      // update only if content is different
      if (JSON.stringify(currentContent) !== JSON.stringify(report.content)) {
        editor.commands.setContent(report.content);
        setIsSaved(true);
      }
    }
  }, [editor, report?.content]);

  if (!editor) {
    return <div className="text-center py-8">Loading editor...</div>;
  }

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      {report?.isVerified && (
        <div className="bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800 p-3 rounded-t-lg">
          <p className="text-sm text-green-700 dark:text-green-300 text-center">
            ✓ This report is verified and cannot be edited.
          </p>
        </div>
      )}
      <Toolbar 
        editor={editor} 
        isSaving={isSaving}
        hasError={hasSaveError}
        isSaved={isSaved}
      />
      <EditorContent editor={editor} />
    </div>
  );
}