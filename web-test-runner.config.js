import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  browsers: [playwrightLauncher({ product: 'chromium' })],
  files: 'src/test/**/*.test.js',
  nodeResolve: true,
  testFramework: {
    config: {
      ui: 'bdd',
    },
  },
  coverage: true,
  plugins: [
    {
      name: 'mock-css-inline',
      resolveImport({ source }) {
        if (source.endsWith('.css?inline')) {
          return 'data:text/javascript,export default ""';
        }
      }
    },
    {
      name: 'mock-assets',
      resolveImport({ source }) {
        if (source.endsWith('.css?inline') || source.endsWith('.svg?raw')) {
          return 'data:text/javascript,export default ""';
        }
      }
    }
  ]
};