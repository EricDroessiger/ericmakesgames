module.exports = {
  input: './scripts/index.js',
  plugins: [
    require('rollup-plugin-node-resolve')(),
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-babel')({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    require('rollup-plugin-uglify')(),
  ],
  output: {
    file: './dist/scripts/index.js',
    format: 'iife',
    sourcemap: true,
  }
};
