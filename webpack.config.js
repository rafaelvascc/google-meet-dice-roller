const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TransformJson = require('transform-json-webpack-plugin');
var PACKAGE = require('./package.json');
const postcssNormalize = require('postcss-normalize');

const BUILD_FOLDER_NAME = 'build';
const CONTENT_SCRIPTS_FOLDER_NAME = 'content-scripts'
const UI_FOLDER_NAME = 'ui'
const BUILD_UI_INDEX_HTML_FILE = 'index.html';
const BUILT_CONTENT_SCRIPT = 'index.js';
const BUILT_REACT_UI_JS = `index.js`;
const BUILD_PATH = `./${BUILD_FOLDER_NAME}`;
const BUILD_CONTENT_SCRIPTS_PATH = `${BUILD_PATH}/${CONTENT_SCRIPTS_FOLDER_NAME}`;
const BUILD_UI_PATH = `${BUILD_PATH}/${UI_FOLDER_NAME}`;
const BUILD_UI_INDEX_HTML_FILE_RELATIVE_TO_MANIFEST = `${UI_FOLDER_NAME}/${BUILD_UI_INDEX_HTML_FILE}`;
const BUILT_CONTENT_SCRIPT_RELATIVE_TO_MANIFEST = `${CONTENT_SCRIPTS_FOLDER_NAME}/${BUILT_CONTENT_SCRIPT}`;

const reactUIConfig = {
    target: "web",
    mode: 'development',
    entry: './src/ui/index.jsx',
    devtool: 'source-map',
    watch: true,
    output: {
        path: path.resolve(__dirname, BUILD_UI_PATH),
        filename: BUILT_REACT_UI_JS
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                }
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader'
            },
            {
                //Based on React Scripts webpack configuration
                test: /\.css$/,
                use: [{
                    loader: require.resolve('style-loader')
                }, {
                    loader: require.resolve('css-loader')
                }, {
                    loader: require.resolve('postcss-loader'),
                    options: {
                        ident: 'postcss',
                        plugins: () => [
                            require('postcss-flexbugs-fixes'),
                            require('postcss-preset-env')({
                                autoprefixer: {
                                    flexbox: 'no-2009',
                                },
                                stage: 3,
                            }),
                            postcssNormalize()
                        ]
                    }
                }]
            }
        ]
    },
    plugins: [        
        // new CleanWebpackPlugin({
        //     verbose: true
        // }),
        new HtmlWebPackPlugin({
            template: './src/ui/index.html',
            filename: BUILD_UI_INDEX_HTML_FILE,
        })
    ],
    devServer: {
        //contentBase: path.resolve(__dirname, BUILD_FOLDER_NAME, UI_FOLDER_NAME),
        //watchContentBase: true,
        compress: false,
        port: 9000
    }
}

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
        new TransformJson({
            filename: `../manifest.json`,
            source: './src/chrome-specific/manifest.json',
            object: {
                version: PACKAGE.version,
                browser_action: {
                    default_icon: 'icons/128.png',
                    default_popup: BUILD_UI_INDEX_HTML_FILE_RELATIVE_TO_MANIFEST
                },
                content_scripts: [
                    {
                        matches: [
                            'https://meet.google.com/*'
                        ],
                        js: [
                            BUILT_CONTENT_SCRIPT_RELATIVE_TO_MANIFEST
                        ]
                    }
                ]
            }
        }),
        new CopyPlugin({
            patterns: [
                { from: './assets/icons', to: '../icons' }
            ],
            options: {
                concurrency: 100,
            },
        }),
    ],
};

module.exports = [reactUIConfig]

//module.exports = [reactUIConfig, contentScriptsConfig]