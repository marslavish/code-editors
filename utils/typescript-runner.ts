import * as esbuild from 'esbuild-wasm';
import { initializeEsbuild, isInitialized } from './esbuild-init';

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

  public static async initialize() {
    if (!isInitialized) {
      await initializeEsbuild();
    }
  }

  public async run(code: string) {
    // Clear previous output
    this.setOutput([]);

    // Setup console.log interceptor
    this.setupConsoleLog();

    try {
      // Compile TypeScript to JavaScript using esbuild with enhanced options
      const result = await esbuild.transform(code, {
        loader: 'ts',
        target: 'es2022',
        format: 'iife',
        sourcemap: true,
        minify: false,
        minifyIdentifiers: false,
        minifySyntax: false,
        minifyWhitespace: false,
        platform: 'neutral',
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
      const result = await esbuild.transform(code, {
        loader: 'ts',
        target: 'es2022',
        format: 'esm',
        sourcemap: true,
        minify: false,
        minifyIdentifiers: false,
        minifySyntax: false,
        minifyWhitespace: false,
        treeShaking: false,
        platform: 'neutral',
        logLevel: 'info',
      });

      return result.code;
    } catch (error) {
      console.error('Compilation error:', error);
      return '';
    }
  }
}
