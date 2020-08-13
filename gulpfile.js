const gulp = require("gulp");
const ts = require("gulp-typescript");
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const spawn = require("child_process").spawn;

var nodeprocess;

var tsp = ts.createProject("tsconfig.json");
function buildjs() {
    return gulp.src("src/pages/**/*.ts")
        .pipe(tsp())
        .pipe(gulp.dest("dist/public/scripts"));
}

function buildApp() {
    return gulp.src("src/app.ts")
        .pipe(gulpWebpack(require("./webpack.server.config.js"), webpack))
        .pipe(gulp.dest("dist"));
}

function buildClient() {
    gulp.src("src/assets/images/favicon.ico").pipe(gulp.dest("dist/public"));
    gulp.src("src/assets/upload/**/*")
        .pipe(gulp.dest("dist/public/upload"));
    gulp.src("database.db").pipe(gulp.dest("dist/data"));
    gulp.src(".env").pipe(gulp.dest("dist/data"));
    return gulp.src("src/*")
        .pipe(gulpWebpack(require("./webpack.config.js"), webpack))
        .pipe(gulp.dest("dist"));
}

function watch() {
    gulp.watch("src/app.ts", gulp.series(buildApp, server));
    gulp.watch("src", {
        ignored: 'src/app.ts'
    }, gulp.series(buildApp, buildClient, server));
    
}

async function server() {
    if(nodeprocess) nodeprocess.kill();
    nodeprocess = await spawn("node", ["app"], {stdio: "inherit", cwd: "dist/"});
    nodeprocess.on("close", function(code) {
        if(code === 8) {
            gulp.log("error", code)
        }
    });
}

async function deploydocker() {
    
}

// Switch these two if you don't need isomorphic rendering
//exports.build = gulp.series(buildjs, buildClient);
exports.build = gulp.series(buildApp, buildClient);

exports.dev = gulp.series(buildApp, buildClient, server, watch);
exports.deploydocker = gulp.series(buildApp, buildClient, deploydocker);
exports.buildreact = buildClient;
exports.buildjs = buildjs;
exports.server = server;
exports.default = this.build;