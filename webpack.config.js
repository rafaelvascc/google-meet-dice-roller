const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const postcssNormalize = require('postcss-normalize');

const BUILD_FOLDER_NAME = 'build';
const UI_FOLDER_NAME = 'ui'
const BUILD_UI_INDEX_HTML_FILE = 'index.html';
const BUILT_REACT_UI_JS = `index.js`;
const BUILD_PATH = `./${BUILD_FOLDER_NAME}`;
const BUILD_UI_PATH = `${BUILD_PATH}/${UI_FOLDER_NAME}`;

const reactUIConfig = {
    target: "web",
    mode: 'development',
    entry: './src/ui/index.jsx',
    devtool: 'source-map',
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
                },
                {
                    // Options for PostCSS as we reference these options twice
                    // Adds vendor prefixing based on your specified browser support in
                    // package.json
                    loader: require.resolve('postcss-loader'),
                    options: {
                        postcssOptions: {
                            // Necessary for external CSS imports to work
                            // https://github.com/facebook/create-react-app/issues/2677
                            ident: 'postcss',
                            config: false,
                            plugins: [
                                'postcss-flexbugs-fixes',
                                [
                                    'postcss-preset-env',
                                    {
                                        autoprefixer: {
                                            flexbox: 'no-2009',
                                        },
                                        stage: 3,
                                    },
                                ],
                                // Adds PostCSS Normalize as the reset css with default options,
                                // so that it honors browserslist config in package.json
                                // which in turn let's users customize the target behavior as per their needs.
                                'postcss-normalize',
                            ]
                        },
                        sourceMap: false
                    },
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/ui/index.html',
            filename: BUILD_UI_INDEX_HTML_FILE,
        })
    ],
    devServer: {
        compress: false,
        port: 9000
    }
}

module.exports = [reactUIConfig]