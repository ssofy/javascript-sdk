const path = require('path');

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
        alias: {
            'HttpRequester': process.env.BUILD_ENV === 'node' ? '@openid/appauth/built/node_support/node_requestor' : '@openid/appauth/built/xhr',
            'PKCECrypto': process.env.BUILD_ENV === 'node' ? '@openid/appauth/built/node_support/crypto_utils' : '@openid/appauth/built/crypto_utils',
        }
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
