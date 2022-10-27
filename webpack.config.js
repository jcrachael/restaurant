const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {

    // development or production mode
    mode: 'development',

    // entry source files
    entry: {
        index: path.resolve(__dirname, './src/js/index.js'),
        
    },
    // output sources
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
    },

    // dev tools
    devtool: 'source-map',
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },


    // modules / loaders
    module: {
        rules: [
            // Scss etc 
            {
                test: /\.(scss)$/,
                use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                    postcssOptions: {
                        plugins: () => [
                        require('autoprefixer')
                        ]
                    }
                    }
                },
                {
                    loader: 'sass-loader'
                }
                ]
            },
          
            // image loaders
            {
                test: /\.(png||svg||jpg||jpeg||gif)$/i,
                type: 'asset/resource',
            },

        ],
    },

    // plugins
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Vana Eesti',
            filename: 'index.html',
            template: 'src/template.html',
            header: 'Vana Eesti',
        }),
    ],


};