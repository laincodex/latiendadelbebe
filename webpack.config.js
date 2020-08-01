const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: {
        "public/home": "./src/clients/home.tsx",
        "public/admin": "./src/clients/admin.tsx",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname,"dist"),
    },
    devtool: "source-map",
    // target: 'node',
    node: {
        __dirname: false
    },
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
                    { 
                        loader: 'file-loader', 
                        options: { 
                            name: '[path][name]-[hash:8].[ext]', 
                            outputPath: url => url.replace(/^src\//,'public/'),
                            publicPath: url => url.replace(/^src\//,'/'),
                        }
                    }
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
    performance: {
        maxEntrypointSize: process.env.NODE_ENV === 'production' ? 512000 : 2048000,
        maxAssetSize: process.env.NODE_ENV === 'production' ? 512000 : 2048000
    },    
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: false,
                default: false,
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    filename: "public/vendor.js"
                }
            }
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: 'public/styles/app.css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],
}