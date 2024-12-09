import nightOwl from 'monaco-themes/themes/Night Owl.json';

let isThemeInitialized = false;

export function initializeMonacoTheme(monaco: any) {
  if (!isThemeInitialized) {
    monaco.editor.defineTheme('nightOwl', nightOwl);
    isThemeInitialized = true;
  }
  monaco.editor.setTheme('nightOwl');
}
