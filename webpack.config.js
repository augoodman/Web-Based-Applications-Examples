const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = () => {
    return {
        mode: 'development',
        output: {
            filename: '[name].js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                template: path.resolve(__dirname, 'index.html')
            }),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser'
            }),
            new webpack.ProvidePlugin({
                React: 'react'
            }),
        ],
        module: {
            rules: [
                { test: /\.worker\.([jt])sx?$/, use: ['worker-loader'] },
                { test: /\.([jt])sx?$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
                { test: /\.(jpg|png|gif|pdf|ttf|woff2?|eot|svg)$/, use: 'file-loader' },
                { test: /\.css$/, use: ['css-loader'] },
            ]
        },
        devServer: {
            historyApiFallback: true,
        },
        externals: {
            'react': 'React'
        }
    };
};