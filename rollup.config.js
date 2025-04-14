import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/audio-stream-visualizer.js',
  output: {
    file: 'dist/audio-stream-visualizer.js',
    format: 'es',
    name: 'StarCompass',
    exports: 'default',
  },
  plugins: [terser()],
}
