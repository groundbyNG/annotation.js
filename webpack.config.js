const path = require('path');
const config = require('./package.json');

require('dotenv').config();

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    let plugins = [];
    isProduction ? plugins.push(new UglifyJsPlugin({})) : '';

    return {
        entry: path.resolve(__dirname, config.main),
        output: {
            library: process.env.NAME,
            libraryTarget: process.env.TARGET,
            path: __dirname,
            filename: isProduction ? 'dist/annotation.min.js' : 'dist/annotation.js'
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                { test: /\.ts/, loader: "awesome-typescript-loader" },
                { test: /\.js$/, loader: "source-map-loader" }
            ]
        },
        plugins: plugins
    }
};
