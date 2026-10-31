import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, Rocket, AlertCircle, CheckCircle } from 'lucide-react';

interface JavaCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  starterCode?: string;
  onRun?: () => void;
  onSubmit?: () => void;
  isExecuting?: boolean;
  errorLine?: number | null;
  errorMessage?: string | null;
}

export const JavaCodeEditor: React.FC<JavaCodeEditorProps> = ({
  value,
  onChange,
  starterCode,
  onRun,
  onSubmit,
  isExecuting = false,
  errorLine = null,
  errorMessage = null,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Custom Dark Cyber Space Theme
    monaco.editor.defineTheme('codevoyage-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '00F0FF', fontStyle: 'bold' },
        { token: 'string', foreground: '10B981' },
        { token: 'number', foreground: 'F59E0B' },
        { token: 'type', foreground: '8B5CF6', fontStyle: 'bold' },
        { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#030712',
        'editor.foreground': '#F8FAFC',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#00F0FF',
        'editor.selectionBackground': '#1E293B80',
        'editor.inactiveSelectionBackground': '#0F172A60',
        'editorCursor.foreground': '#00F0FF',
        'editorGutter.background': '#030712',
        'editor.lineHighlightBackground': '#0F172A40',
      },
    });

    monaco.editor.setTheme('codevoyage-dark');

    // Keyboard Shortcuts:
    // Ctrl+Enter / Cmd+Enter => Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun && !isExecuting) {
        onRun();
      }
    });

    // Ctrl+Shift+Enter / Cmd+Shift+Enter => Submit Mission
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        if (onSubmit && !isExecuting) {
          onSubmit();
        }
      }
    );

    // Register Java autocomplete snippets
    monaco.languages.registerCompletionItemProvider('java', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
          {
            label: 'sout',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'System.out.println(${1:\"\"});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Print string or variable to terminal with newline',
            range,
          },
          {
            label: 'souf',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'System.out.printf(\"${1:%s}\", ${2});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Print formatted string to console',
            range,
          },
          {
            label: 'main',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'public static void main(String[] args) {\n\t${1}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Standard JVM main method entrypoint',
            range,
          },
        ];

        return { suggestions };
      },
    });
  };

  // Synchronize error highlighting markers whenever errorLine changes
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const monaco = monacoRef.current;
    const model = editorRef.current.getModel();
    if (!model) return;

    if (errorLine && errorLine > 0) {
      monaco.editor.setModelMarkers(model, 'compiler', [
        {
          startLineNumber: errorLine,
          startColumn: 1,
          endLineNumber: errorLine,
          endColumn: model.getLineLength(errorLine) + 1,
          message: errorMessage || 'Compilation / Syntax Discrepancy',
          severity: monaco.MarkerSeverity.Error,
        },
      ]);
      editorRef.current.revealLineInCenter(errorLine);
    } else {
      monaco.editor.setModelMarkers(model, 'compiler', []);
    }
  }, [errorLine, errorMessage]);

  const handleResetCode = () => {
    if (starterCode) {
      onChange(starterCode);
    } else {
      onChange(
        `public class Solution {\n    public static void main(String[] args) {\n        // Mission initialization\n        \n    }\n}`
      );
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-cyber-cyan/30 bg-space-950 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      {/* Editor top action bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-space-900/90 border-b border-space-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-glow-rose"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-glow-amber"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-glow-emerald"></span>
          </div>
          <Terminal className="w-4 h-4 text-cyber-cyan" />
          <span className="text-xs font-mono text-slate-200 font-bold tracking-wider uppercase">
            Solution.java
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-space-800 text-cyber-cyan font-mono border border-space-700">
            JDK 21
          </span>
        </div>

        {/* Action Controls: Reset, Run Code, and Submit */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={handleResetCode}
            disabled={isExecuting}
            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-space-800 rounded-lg border border-transparent hover:border-space-700 transition-all flex items-center space-x-1.5 disabled:opacity-50"
            title="Reset to challenge starter code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Code</span>
          </button>

          {onRun && (
            <button
              onClick={onRun}
              disabled={isExecuting}
              className="px-3.5 py-1.5 font-bold text-slate-200 hover:text-white bg-space-800 hover:bg-space-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-space-700 flex items-center space-x-1.5 transition-all shadow-sm"
              title="Run code against sample test cases (Ctrl + Enter)"
            >
              <Play className="w-3.5 h-3.5 fill-current text-cyber-cyan" />
              <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
              <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 rounded bg-space-950 text-[10px] text-slate-400 border border-space-800">
                ^↵
              </kbd>
            </button>
          )}

          {onSubmit && (
            <button
              onClick={onSubmit}
              disabled={isExecuting}
              className="px-4 py-1.5 font-bold text-space-950 bg-cyber-cyan hover:bg-cyan-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center space-x-1.5 shadow-glow-cyan transition-all"
              title="Submit code for full flight grading (Ctrl + Shift + Enter)"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>{isExecuting ? 'Transmitting...' : 'Submit Mission'}</span>
              <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 rounded bg-space-950/20 text-[10px] text-space-950 font-mono">
                ⇧^↵
              </kbd>
            </button>
          )}
        </div>
      </div>

      {/* Monaco Container */}
      <div className="flex-1 min-h-[360px] relative">
        <Editor
          height="100%"
          defaultLanguage="java"
          language="java"
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 14, bottom: 14 },
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            contextmenu: true,
          }}
        />
      </div>

      {/* Error Callout Banner if compiler error exists */}
      {errorLine && errorMessage && (
        <div className="px-4 py-2.5 bg-rose-950/80 border-t border-rose-500/40 flex items-start space-x-2.5 text-xs font-mono text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-rose-400 mr-2">Line {errorLine}:</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
