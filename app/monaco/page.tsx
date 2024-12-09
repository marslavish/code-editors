'use client';

import { MonacoEditor } from '@/components/MonacoEditor';
import { useState, useCallback, useEffect } from 'react';
import { TypeScriptRunner } from '@/utils/typescript-runner';
import { DEFAULT_TYPESCRIPT_CODE } from '@/utils/code-examples';
import { TabButton } from '@/components/TabButton';
import { cn } from '@/lib/utils';

export default function Monaco() {
  const [code, setCode] = useState(DEFAULT_TYPESCRIPT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [compiledJS, setCompiledJS] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'log' | 'compiled'>('log');

  useEffect(() => {
    TypeScriptRunner.initialize();
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const runCode = useCallback(async (code: string) => {
    setActiveTab('log');
    const runner = new TypeScriptRunner(setOutput);
    await runner.run(code);
  }, []);

  const compileCode = useCallback(async (code: string) => {
    setActiveTab('compiled');
    const runner = new TypeScriptRunner(setOutput);
    const compiled = await runner.compile(code);
    setCompiledJS(compiled || 'Compilation failed');
  }, []);

  const formattedOutput = output.join('\n');

  return (
    <main className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>TypeScript Editor</h1>
      <div className='flex gap-4'>
        <div className='flex-1'>
          <MonacoEditor
            value={code}
            onChange={handleCodeChange}
            onRun={runCode}
            onCompile={compileCode}
          />
        </div>
        <div className='flex-1'>
          <div className='flex justify-center gap-2 mb-2'>
            <TabButton
              label='JS'
              tabId='compiled'
              activeTab={activeTab}
              onClick={() => setActiveTab('compiled')}
            />
            <TabButton
              label='Log'
              tabId='log'
              activeTab={activeTab}
              onClick={() => setActiveTab('log')}
            />
          </div>
          <div
            className={cn(
              'h-[600px] rounded-lg overflow-hidden',
              activeTab === 'log' && 'border-2 border-gray-300 bg-white'
            )}
          >
            <div className={activeTab === 'log' ? 'block' : 'hidden'}>
              <pre className='p-4 font-mono text-sm whitespace-pre-wrap'>{formattedOutput}</pre>
            </div>
            <div className={activeTab === 'compiled' ? 'block' : 'hidden'}>
              <MonacoEditor value={compiledJS} language='javascript' readOnly={true} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
