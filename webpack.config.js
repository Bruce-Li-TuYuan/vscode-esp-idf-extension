const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');


const packageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const externals = Object.keys(packageConfig.dependencies);
externals.push('commonjs');
externals.push('vscode');

const extensionConfig = {
    entry: {
        extension: path.resolve(__dirname, "src", "extension.ts"),
        kconfigServer: path.resolve(__dirname, "src", "kconfig", "server.ts"),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: true,
    },
    devtool: 'source-map',
    externals: ["commonjs", "vscode"],
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'vscode-nls-dev/lib/webpack-loader',
                    options: {
                        base: path.join(__dirname, 'src')
                    },
                },
                {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            "module": "es6"
                        }
                    }
            }]
        }]
    },
    resolve: {
        extensions: ['.js', '.ts']
    }
};


const webViewConfig = {
    entry: {
        examples: path.resolve(__dirname, "src", "views", "examples", "main.ts"),
        espSize: path.resolve(__dirname, "src", "views", "espSize.ts"),
        espTrace: path.resolve(__dirname, "src", "views", "espTrace.ts"),
        onboarding: path.resolve(__dirname, "src", "views", "onboarding", "main.ts"),
        menuconfig: path.resolve(__dirname, "src", "views", "menuconfig", "main.ts"),
    },
    output: {
        path: path.resolve(__dirname, "dist", "views"),
        filename: "[name]-bundle.js",
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                    }
                }
            ]
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        },
        {
            test: /\.vue$/,
            use: 'vue-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'css-loader',
            ],
        },
        {
            test: /\.tsx?$/,
            use: {
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            exclude: /node_modules/,
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].bundle.css'
        }),
        new TSLintPlugin({
            files: ['./*.ts']
        }),
        new HtmlWebpackPlugin({
            chunks: ['espSize'],
            filename: "espSize.html",
            template: `${__dirname}/src/views/espSize.html`,
            chunks: ['espSize']
        }),
        new HtmlWebpackPlugin({
            chunks: ['espTrace'],
            filename: "espTrace.html",
            template: `${__dirname}/src/views/espTrace.html`,
        }),
        new VueLoaderPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        port: 9000
    }
};


module.exports = [
    extensionConfig,
    webViewConfig
]