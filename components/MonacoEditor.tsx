'use client';

import Editor from '@monaco-editor/react';
import { useRef } from 'react';

interface CodeEditorProps {
  defaultValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  onRun?: (code: string) => Promise<void>;
  onCompile?: (code: string) => Promise<void>;
}

export default function MonacoEditor({
  defaultValue = '// Start coding here...',
  language = 'typescript',
  onChange,
  onRun,
  onCompile,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
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
    <div className='flex flex-col gap-2'>
      <div className='flex justify-end gap-2'>
        <button
          onClick={handleCompileClick}
          className='px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors shadow-sm'
        >
          Compile
        </button>
        <button
          onClick={handleRunClick}
          className='px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors shadow-sm'
        >
          Run
        </button>
      </div>
      <div className='h-[500px] border border-gray-300 rounded-lg'>
        <Editor
          height='500px'
          loading={<div>Loading editor, please wait...</div>}
          defaultLanguage={language}
          defaultValue={defaultValue}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
