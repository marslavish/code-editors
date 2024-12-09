'use client';

import AceEditor from '@/components/AceEditor';
import { useState, useCallback } from 'react';
import { TypeScriptRunner } from '@/utils/typescript-runner';
import { DEFAULT_TYPESCRIPT_CODE } from '@/utils/code-examples';

export default function AcePage() {
  const [output, setOutput] = useState<string[]>([]);

  const handleCodeChange = (value: string) => {
    // console.log('Code changed:', value);
  };

  const runCode = useCallback((code: string) => {
    const runner = new TypeScriptRunner(setOutput);
    runner.run(code);
  }, []);

  return (
    <main className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>TypeScript Editor</h1>
      <div className='flex gap-4'>
        <div className='flex-1'>
          <div className='h-[600px] border border-gray-300 rounded-lg'>
            <AceEditor
              defaultValue={DEFAULT_TYPESCRIPT_CODE}
              onChange={handleCodeChange}
              onRun={runCode}
            />
          </div>
        </div>
        <div className='flex-1 h-[600px] border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto'>
          <h2 className='text-lg font-semibold mb-2'>Output:</h2>
          {output.map((line, index) => (
            <div key={index} className='font-mono whitespace-pre-wrap'>
              {line}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
