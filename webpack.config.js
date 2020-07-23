const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TransformJson = require('transform-json-webpack-plugin');
var PACKAGE = require('./package.json');

const BUILD_FOLDER_NAME = 'build';
const DIST_FOLDER_NAME = 'dist';
const BUILD_PATH = `./${BUILD_FOLDER_NAME}`;
const DIST_PATH = `./${DIST_FOLDER_NAME}`;
const BUILT_CONTENT_SCRIPT = 'content-scripts/index.js';

module.exports = {
    mode: "production",
    entry: './src/content-scripts/index.js',
    output: {
        path: path.resolve(__dirname, BUILD_FOLDER_NAME),
        filename: BUILT_CONTENT_SCRIPT
    },
    plugins: [
        new CleanWebpackPlugin(),
        new TransformJson({
            filename: `manifest.json`,
            source: './src/chrome-specific/manifest.json',
            object: {
                version: PACKAGE.version,
                content_scripts: [
                    {
                        matches: [
                            "https://meet.google.com/*"
                        ],
                        js: [
                            BUILT_CONTENT_SCRIPT
                        ]
                    }
                ]
            }
        }),
        new CopyPlugin({
            patterns: [
                { from: './assets/icons', to: 'icons' }
            ],
            options: {
                concurrency: 100,
            },
        }),
    ],
};