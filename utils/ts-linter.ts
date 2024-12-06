import * as ts from 'typescript';
import { linter } from '@codemirror/lint';

export function createTypeScriptLinter() {
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    lib: ['dom', 'dom.iterable', 'esnext'],
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
  };

  return linter((view) => {
    const text = view.state.doc.toString();
    const fileName = 'file.ts';
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);

    const customHost: ts.CompilerHost = {
      getSourceFile: (name, languageVersion) => {
        if (name === fileName) {
          return sourceFile;
        }
        const defaultHost = ts.createCompilerHost(compilerOptions);
        return defaultHost.getSourceFile(name, languageVersion);
      },
      getDefaultLibFileName: (options) => ts.getDefaultLibFileName(options),
      writeFile: () => {},
      getCurrentDirectory: () => '/',
      getCanonicalFileName: (fileName) => fileName,
      useCaseSensitiveFileNames: () => true,
      getNewLine: () => '\n',
      fileExists: (fileName) => fileName === 'file.ts',
      readFile: (fileName) => (fileName === 'file.ts' ? text : undefined),
      directoryExists: () => true,
      getDirectories: () => [],
    };

    const program = ts.createProgram([fileName], compilerOptions, customHost);
    const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile);

    return diagnostics.map((diagnostic) => {
      const start = diagnostic.start || 0;
      const length = diagnostic.length || 0;
      const end = start + length;

      return {
        from: start,
        to: end,
        severity: 'error',
        message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      };
    });
  });
}
