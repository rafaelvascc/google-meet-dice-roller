const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TransformJson = require('transform-json-webpack-plugin');
var PACKAGE = require('./package.json');

const BUILD_FOLDER_NAME = 'build';
const CONTENT_SCRIPTS_FOLDER_NAME = 'content-scripts'
const UI_FOLDER_NAME = 'ui'
const BUILD_UI_INDEX_HTML_FILE = 'index.html';
const BUILT_CONTENT_SCRIPT = 'index.js';
const BUILD_PATH = `./${BUILD_FOLDER_NAME}`;
const BUILD_CONTENT_SCRIPTS_PATH = `${BUILD_PATH}/${CONTENT_SCRIPTS_FOLDER_NAME}`;
const BUILD_UI_INDEX_HTML_FILE_RELATIVE_TO_MANIFEST = `${UI_FOLDER_NAME}/${BUILD_UI_INDEX_HTML_FILE}`;
const BUILT_CONTENT_SCRIPT_RELATIVE_TO_MANIFEST = `${CONTENT_SCRIPTS_FOLDER_NAME}/${BUILT_CONTENT_SCRIPT}`;

const contentScriptsConfig = {
    mode: 'production',
    entry: './src/content-scripts/index.js',
    output: {
        path: path.resolve(__dirname, BUILD_CONTENT_SCRIPTS_PATH),
        filename: BUILT_CONTENT_SCRIPT
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        //new WaitPlugin(BUILT_REACT_UI_JS_PATH),
        new TransformJson({
            filename: `../manifest.json`,
            source: './src/chrome-specific/manifest.json',
            object: {
                version: PACKAGE.version,
                action: {
                    default_icon: 'icons/128.png'
                },
                content_scripts: [
                    {
                        matches: [
                            'https://meet.google.com/*'
                        ],
                        js: [
                            BUILT_CONTENT_SCRIPT_RELATIVE_TO_MANIFEST,
                            "ui/index.js"
                        ]
                    }
                ]
            }
        }),
        new CopyPlugin({
            patterns: [
                { from: './assets/icons', to: '../icons' },
                { from: './src/chrome-specific/background.js', to: '../background.js' }
            ],
            options: {
                concurrency: 100,
            },
        }),
    ],
};

module.exports = [contentScriptsConfig]