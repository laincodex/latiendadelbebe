const path = require("path");
module.exports = {
    entry: {
        app: "./src/app.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname,"dist"),
    },
    devtool: "source-map",
    target: 'node',
    node: {
        __dirname: false
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: process.env.NODE_ENV || "development",
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
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
    externals: ["utf-8-validate", "bufferutil", "uws", {express: 'commonjs express'}, {sqlite3: 'commonjs sqlite3'}, {sharp: 'commonjs sharp'}]
}