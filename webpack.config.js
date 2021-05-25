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