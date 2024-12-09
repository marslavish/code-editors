import * as esbuild from 'esbuild-wasm';
import { initializeEsbuild } from './esbuild-init';

export class TypeScriptRunner {
  private originalConsoleLog: typeof console.log;
  private setOutput: (value: React.SetStateAction<string[]>) => void;

  constructor(setOutput: (value: React.SetStateAction<string[]>) => void) {
    this.originalConsoleLog = console.log;
    this.setOutput = setOutput;
  }

  private customStringify(obj: any): string {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (typeof obj === 'string') return `'${obj}'`;
    if (typeof obj !== 'object') return String(obj);

    if (Array.isArray(obj)) {
      const items = obj.map((item) => this.customStringify(item)).join(', ');
      return `[${items}]`;
    }

    const entries = Object.entries(obj).map(([key, value]) => {
      const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      return `${formattedKey}: ${this.customStringify(value)}`;
    });

    return `{ ${entries.join(', ')} }`;
  }

  private setupConsoleLog() {
    console.log = (...args) => {
      this.setOutput((prev) => [
        ...prev,
        args
          .map((arg) => (typeof arg === 'object' ? this.customStringify(arg) : String(arg)))
          .join(' '),
      ]);
      this.originalConsoleLog(...args);
    };
  }

  private restoreConsoleLog() {
    console.log = this.originalConsoleLog;
  }

  public async run(code: string) {
    await initializeEsbuild();

    // Clear previous output
    this.setOutput([]);

    // Setup console.log interceptor
    this.setupConsoleLog();

    try {
      // Compile TypeScript to JavaScript using esbuild
      const result = await esbuild.transform(code, {
        loader: 'ts',
        target: 'es2015',
        format: 'iife',
      });

      // Execute the compiled JavaScript code
      const executeCode = new Function(result.code);
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

  async compile(code: string): Promise<string> {
    try {
      await initializeEsbuild();

      const result = await esbuild.transform(code, {
        loader: 'ts',
        target: 'es2015',
        format: 'esm',
        minify: false,
        treeShaking: false,
      });

      return result.code;
    } catch (error) {
      console.error('Compilation error:', error);
      return '';
    }
  }
}
