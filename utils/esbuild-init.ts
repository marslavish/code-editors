import * as esbuild from 'esbuild-wasm';

let initialized = false;

export async function initializeEsbuild() {
  if (!initialized) {
    await esbuild.initialize({
      wasmURL: 'https://unpkg.com/esbuild-wasm@latest/esbuild.wasm',
    });
    initialized = true;
  }
}
