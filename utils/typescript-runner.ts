import * as ts from 'typescript';

export class TypeScriptRunner {
  private originalConsoleLog: typeof console.log;
  private setOutput: (value: React.SetStateAction<string[]>) => void;

  constructor(setOutput: (value: React.SetStateAction<string[]>) => void) {
    this.originalConsoleLog = console.log;
    this.setOutput = setOutput;
  }

  private setupConsoleLog() {
    console.log = (...args) => {
      this.setOutput((prev) => [
        ...prev,
        args
          .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
          .join(' '),
      ]);
      this.originalConsoleLog(...args);
    };
  }

  private restoreConsoleLog() {
    console.log = this.originalConsoleLog;
  }

  public run(code: string) {
    // Clear previous output
    this.setOutput([]);

    // Setup console.log interceptor
    this.setupConsoleLog();

    try {
      // Compile TypeScript to JavaScript
      const result = ts.transpileModule(code, {
        compilerOptions: {
          module: ts.ModuleKind.None,
          target: ts.ScriptTarget.ES2015,
          strict: true,
        },
      });

      // Execute the compiled JavaScript code
      const executeCode = new Function(result.outputText);
      executeCode();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.setOutput((prev) => [...prev, `Error: ${error.message}`]);
      } else {
        this.setOutput((prev) => [...prev, 'An unknown error occurred']);
      }
    } finally {
      this.restoreConsoleLog();
    }
  }
}
