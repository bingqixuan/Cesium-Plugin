import {terser} from 'rollup-plugin-terser'
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss';

const output = (file, plugins) => ({
    input: 'src/index.ts',
    external: ['cesium'],
    output: {
        globals: {'cesium': 'Cesium'},
        name: 'CesiumPlugin',
        format: 'umd',
        indent: false,
        file
    },
    plugins
});

export default [
    output('dist/cesium-plugin.js', [postcss({
        extensions: ['.css']
      }),resolve(), commonjs(), typescript({tsconfig: './tsconfig.json', declaration: false}), peerDepsExternal()]),
    output('dist/cesium-plugin.min.js', [postcss({
        extensions: ['.css']
      }),resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json', declaration: false }), peerDepsExternal(), terser()])
];