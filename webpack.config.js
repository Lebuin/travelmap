const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',

    context: '/code',
    devtool: 'source-map',
    entry: {
        app: './src/app.jsx',
    },
    devServer: {
        contentBase: './dist',
        port: 80,
        host: '0.0.0.0',
        disableHostCheck: true,
        hot: true,
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Travelmap',
          template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
    ],

    module: {
        rules: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
            loader: "babel-loader"
            }
        }
        ],
    },

    output: {
        filename: '[name].js',
        path: '/code/dist',
    },
}
