'use client';

import { useEffect, useRef, useState } from 'react';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { EditorState } from '@codemirror/state';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';

interface CodeMirrorProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  onRun?: (code: string) => void;
}

export default function CodeMirror({ defaultValue, onChange, onRun }: CodeMirrorProps) {
  const editor = useRef<EditorView>();
  const editorContainer = useRef<HTMLDivElement>(null);
  const [currentCode, setCurrentCode] = useState(defaultValue);

  const handleRunClick = () => {
    if (onRun) {
      onRun(currentCode);
    }
  };

  useEffect(() => {
    if (!editorContainer.current) return;

    const startState = EditorState.create({
      doc: defaultValue,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
          // { key: 'Ctrl-Shift-m', run: openLintPanel },
        ]),
        javascript({ typescript: true }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newCode = update.state.doc.toString();
            setCurrentCode(newCode);
            if (onChange) {
              onChange(newCode);
            }
          }
        }),
        // createTypeScriptLinter(),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorContainer.current,
    });

    editor.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div className='relative h-full'>
      <button
        onClick={handleRunClick}
        className='absolute top-2 right-2 px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors z-50 bg-white shadow-sm'
      >
        Run
      </button>
      <div ref={editorContainer} className='h-full w-full overflow-hidden' />
    </div>
  );
}
