import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import uglify from 'rollup-plugin-uglify-es';


export default [
	{
		input: 'src/manto.js',
		output: {
			name: 'rjql',
			file: 'dist/rjql.manto.min.js',
			format: 'umd',
			exports: 'named'
		},
		plugins: [
			resolve(), 
			commonjs(),
			uglify()
		]
	},
	{
		input: 'src/sahir.js',
		output: {
			name: 'rjql',
			file: 'dist/rjql.sahir.min.js',
			format: 'umd',
			exports: 'named'
		},
		plugins: [
			resolve(), 
			commonjs(),
			uglify()
		]
	},
	{
		input: 'src/sahir.js',
		output: {
			name: 'rjql',
			file: 'dist/rjql.js',
			format: 'umd',
			exports: 'named'
		},
		plugins: [
			resolve(), 
			commonjs(),
			uglify()
		]
	},
	{
		input: 'src/sahir.js',
		output: {
			name: 'rjql',
			file: 'dist/rjql.min.js',
			format: 'umd',
			exports: 'named'
		},
		plugins: [
			resolve(), 
			commonjs(),
			uglify()
		]
	}
];
