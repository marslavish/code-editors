import * as esbuild from 'esbuild-wasm';

export let isInitialized = false;

export async function initializeEsbuild() {
  // Return early if already initialized or currently initializing
  if (isInitialized) return;

  try {
    await esbuild.initialize({
      wasmURL: 'https://unpkg.com/esbuild-wasm@latest/esbuild.wasm',
    });
    isInitialized = true;
  } catch (error) {
    // If the error is about multiple initialization, just set isInitialized to true
    if (error instanceof Error && error.message.includes('initialize')) {
      isInitialized = true;
    } else {
      // Re-throw other errors
      throw error;
    }
  }
}
