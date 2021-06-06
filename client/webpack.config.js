const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const isDev = process.env.NODE_ENV === 'development';
module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: { main: ['@babel/polyfill', './index.js'] },
    mode: process.env.NODE_ENV,
    output: {
        filename: `bundle${!isDev ? '.[hash]' : ''}.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.js', '.ts']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        port: 3000,
        hot: true
    },
    plugins: [
        new HTMLWebpackPlugin({ template: './index.html' }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            PIXI: "pixi.js",
        }),
        new CopyWebpackPlugin({
            patterns:
                [
                    {
                        from: path.resolve(__dirname, "src/assets"),
                        to: path.resolve(__dirname, "dist/assets"),
                    }
                ]
        }
        )
    ],
    module: {
        rules: [
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-typescript', '@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
