'use client';

import Editor from '@monaco-editor/react';
import { useRef } from 'react';
import { initializeMonacoTheme } from '@/utils/monaco-theme';

interface CodeEditorProps {
  value?: string;
  defaultValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  onRun?: (code: string) => Promise<void>;
  onCompile?: (code: string) => Promise<void>;
  readOnly?: boolean;
  options?: Record<string, any>;
}

export const MonacoEditor = function MonacoEditor({
  value,
  defaultValue = '// Start coding here...',
  language = 'typescript',
  onChange,
  onRun,
  onCompile,
  readOnly = false,
  options = {},
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    initializeMonacoTheme(monaco);
  }

  const handleRunClick = async () => {
    if (editorRef.current && onRun) {
      const code = editorRef.current.getValue();
      await onRun(code);
    }
  };

  const handleCompileClick = async () => {
    if (editorRef.current && onCompile) {
      const code = editorRef.current.getValue();
      await onCompile(code);
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      {!readOnly && (onRun || onCompile) && (
        <div className='flex justify-end gap-2'>
          {onCompile && (
            <button
              onClick={handleCompileClick}
              className='px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors shadow-sm'
            >
              Compile
            </button>
          )}
          {onRun && (
            <button
              onClick={handleRunClick}
              className='px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors shadow-sm'
            >
              Run
            </button>
          )}
        </div>
      )}
      <div className='h-[600px] rounded-lg overflow-hidden'>
        <Editor
          loading={<div>Loading editor, please wait...</div>}
          language={language}
          value={value ?? defaultValue}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            fixedOverflowWidgets: true,
            readOnly,
            ...options,
          }}
        />
      </div>
    </div>
  );
};
