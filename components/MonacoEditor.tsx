'use client';

import Editor from '@monaco-editor/react';
import { useRef } from 'react';

interface CodeEditorProps {
  defaultValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  onRun?: (code: string) => void;
}

export default function MonacoEditor({
  defaultValue = '// Start coding here...',
  language = 'typescript',
  onChange,
  onRun,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  const handleRunClick = () => {
    if (editorRef.current && onRun) {
      const code = editorRef.current.getValue();
      onRun(code);
    }
  };

  return (
    <div className='relative h-full'>
      <button
        onClick={handleRunClick}
        className='absolute top-2 right-2 z-10 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
      >
        Run
      </button>
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
  );
}
