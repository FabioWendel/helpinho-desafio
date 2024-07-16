import { resolve as _resolve } from 'path';
import { lib } from 'serverless-webpack';

export const entry = lib.entries;
export const target = 'node';
export const mode = 'development';
export const module = {
    rules: [
        {
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }
    ]
};
export const resolve = {
    extensions: ['.ts', '.js']
};
export const output = {
    path: _resolve(__dirname, 'dist'),
    filename: 'lambda.js',
    libraryTarget: 'commonjs2'
};
