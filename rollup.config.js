import resolve from 'rollup-plugin-node-resolve';
    
const pkg = require('./package.json');
    
export default {
        input: "src/index.js",
        output: [
            { file: pkg.module, 'format': 'en' },
            { file: pkg.main, 'format': 'umd', name: 'Name' }
        ],
        plugins: [
            resolve()
        ],
};