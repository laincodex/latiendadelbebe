const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: {
        app: "./src/app.ts",
        client: "./src/client.tsx"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname,"dist"),
        publicPath: "/"
    },
    //devtool: "source-map",
    target: 'node',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".scss", ".css"]
    },
    mode: process.env.NODE_ENV || "development",
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            //{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                    loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                // 'postcss-loader',
                    'sass-loader',
                ],
            },
            { test: /\.(jpg|png|gif|pdf|ico|eot|ttf|woff2?)$/, use: [
                    { loader: 'file-loader', options: { name: '[path][name]-[hash:8].[ext]'}}
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        //loader: path.resolve("src/utils/svg-loader.ts"),
                        loader: "@svgr/webpack",
                        options: {
                            svgo: false
                        }
                    }
                ] 
                
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: 'src/styles/[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],
    externals: ["utf-8-validate", "bufferutil", "uws", {'socket.io': 'commonjs socket.io', express: 'commonjs express'}]
}