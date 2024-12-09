'use client';

import MonacoEditor from '@/components/MonacoEditor';
import Editor from '@monaco-editor/react';
import { useState, useCallback } from 'react';
import { TypeScriptRunner } from '@/utils/typescript-runner';
import { DEFAULT_TYPESCRIPT_CODE } from '@/utils/code-examples';
import { TabButton } from '@/components/TabButton';

export default function Monaco() {
  const [output, setOutput] = useState<string[]>([]);
  const [compiledJS, setCompiledJS] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'log' | 'compiled'>('log');

  const handleCodeChange = (value: string | undefined) => {
    // console.log('Code changed:', value);
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
            defaultValue={DEFAULT_TYPESCRIPT_CODE}
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
          <div className='h-[500px] border-2 border-gray-300 rounded-lg bg-white overflow-auto'>
            {activeTab === 'log' ? (
              <Editor
                defaultLanguage='javascript'
                value={formattedOutput}
                options={{
                  readOnly: true,
                  domReadOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  lineNumbers: 'off',
                  hover: { enabled: false },
                  quickSuggestions: false,
                  parameterHints: { enabled: false },
                  suggestOnTriggerCharacters: false,
                  acceptSuggestionOnEnter: 'off',
                  tabCompletion: 'off',
                  wordBasedSuggestions: 'off',
                }}
              />
            ) : (
              <Editor
                defaultLanguage='javascript'
                value={compiledJS}
                options={{
                  readOnly: true,
                  domReadOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
