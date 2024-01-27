const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin')

const currentYear = new Date().getFullYear();

const banner = `
SSOfy JavaScript SDK v${pkg.version}
Copyright (c) ${currentYear} Cubelet Ltd.

Licensed under the MIT License (see https://github.com/ssofy/javascript-sdk/blob/master/LICENSE for details).
Repository: https://github.com/ssofy/javascript-sdk
`;

const config = {
    entry: './src/browser.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: banner,
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false
            }),
        ],
    },
};

const browserConfig = {
    ...config,
    output: {
        filename: 'ssofy.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SSOfy',
        libraryTarget: 'window',
    },
};

const umdConfig = {
    ...config,
    output: {
        filename: 'ssofy.umd.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SSOfy',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
};

module.exports = [browserConfig, umdConfig];
