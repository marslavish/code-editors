'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

// Dynamically import AceEditor to avoid SSR issues
const AceEditorComponent = dynamic(
  async () => {
    const ace = await import('react-ace');
    await import('ace-builds/src-noconflict/mode-typescript');
    await import('ace-builds/src-noconflict/theme-tomorrow');
    return ace;
  },
  { ssr: false }
);

interface AceEditorProps {
  defaultValue?: string;
  language?: string;
  onChange?: (value: string) => void;
  onRun?: (code: string) => void;
}

export default function AceEditor({
  defaultValue = '// Start coding here...',
  language = 'typescript',
  onChange,
  onRun,
}: AceEditorProps) {
  const [code, setCode] = useState(defaultValue);

  const handleChange = (newValue: string) => {
    setCode(newValue);
    onChange?.(newValue);
  };

  const handleRunClick = () => {
    if (onRun) {
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
      <AceEditorComponent
        mode={language}
        theme='tomorrow'
        onChange={handleChange}
        value={code}
        name='ace-editor'
        editorProps={{ $blockScrolling: true }}
        width='100%'
        height='100%'
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
