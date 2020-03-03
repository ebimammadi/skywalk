const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    devtool: "none",
    devServer: {
        useLocalIp: true
    },
    output: {
        filename: "main.js",
        path: __dirname + '/dist',
    },

    plugins: [
        new HtmlWebpackPlugin( //creates the index.html in dist folder
            {
                title: "Ebrahim - Skymill Test",
                template: "./src/templates/index.template.html",
                minify: true,
            }
        )
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader","css-loader","sass-loader"]
            }
        ]
    },
};
