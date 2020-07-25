const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TransformJson = require('transform-json-webpack-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack')
var PACKAGE = require('./package.json');
const postcssNormalize = require('postcss-normalize');
const rimraf = require('rimraf');

const BUILD_FOLDER_NAME = 'build';
const DIST_FOLDER_NAME = 'dist';
const CONTENT_SCRIPTS_FOLDER_NAME = 'content-scripts'
const UI_FOLDER_NAME = 'ui'
const BUILT_CONTENT_SCRIPT = 'index.js';
const BUILT_REACT_UI_JS = `ui-${Date.now()}.js`;
const BUILD_PATH = `./${BUILD_FOLDER_NAME}`;
const DIST_PATH = `./${DIST_FOLDER_NAME}`;
const BUILD_CONTENT_SCRIPTS_PATH = `${BUILD_PATH}/${CONTENT_SCRIPTS_FOLDER_NAME}`;
const BUILD_UI_PATH = `${BUILD_PATH}/${UI_FOLDER_NAME}`;
const BUILT_CONTENT_SCRIPT_RELATIVE_TO_MANIFEST = `${CONTENT_SCRIPTS_FOLDER_NAME}/${BUILT_CONTENT_SCRIPT}`;
const BUILT_REACT_UI_JS_PATH = `${BUILD_UI_PATH}/${BUILT_REACT_UI_JS}`

//https://github.com/webpack/webpack/issues/3838
class WaitPlugin extends WebpackBeforeBuildPlugin {
    constructor(file, interval = 100, timeout = 100000) {
        super(function (stats, callback) {
            let start = Date.now()

            function poll() {
                if (fs.existsSync(file)) {
                    callback()
                } else if (Date.now() - start > timeout) {
                    throw Error("Maybe it just wasn't meant to be.")
                } else {
                    setTimeout(poll, interval)
                }
            }

            poll()
        })
    }
}

const reactUIConfig = {
    mode: "production",
    entry: './src/ui/index.jsx',
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
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader"
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
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/ui/index.html",
            filename: "index.html",
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, BUILD_FOLDER_NAME, 'ui'),
        compress: true,
        port: 9000
    }
}

const contentScriptsConfig = {
    mode: "production",
    entry: './src/content-scripts/index.js',
    output: {
        path: path.resolve(__dirname, BUILD_CONTENT_SCRIPTS_PATH),
        filename: BUILT_CONTENT_SCRIPT
    },
    plugins: [
        new WaitPlugin(BUILT_REACT_UI_JS_PATH),
        new TransformJson({
            filename: `../manifest.json`,
            source: './src/chrome-specific/manifest.json',
            object: {
                version: PACKAGE.version,
                content_scripts: [
                    {
                        matches: [
                            "https://meet.google.com/*"
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

const assetsConfig = {
    mode: "production",
    //entry: './src/content-scripts/index.js',
    output: {
        path: path.resolve(__dirname, BUILD_PATH),
        //filename: BUILT_CONTENT_SCRIPT
    },
    plugins: [
        new WaitPlugin(BUILT_REACT_UI_JS_PATH),
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
                            BUILT_CONTENT_SCRIPT_RELATIVE_TO_MANIFEST
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

module.exports = [reactUIConfig, contentScriptsConfig]