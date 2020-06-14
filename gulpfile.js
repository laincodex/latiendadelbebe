const gulp = require("gulp");
const ts = require("gulp-typescript");
const webpack = require("webpack-stream");
const spawn = require("child_process").spawn;

var nodeprocess;

var tsp = ts.createProject("tsconfig.json");
function buildjs() {
    return gulp.src("src/pages/**/*.ts")
        .pipe(tsp())
        .pipe(gulp.dest("dist/public/scripts"));
}

function buildreact() {
    gulp.src("src/assets/upload/**/*")
        .pipe(gulp.dest("dist/public/upload"));
    gulp.src("database.db").pipe(gulp.dest("dist"));
    return gulp.src("src/*")
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(gulp.dest("dist"));
}

function watch() {
    //gulp.watch("src/pages/**/*.ts", buildjs);
    gulp.watch("src", gulp.series(buildreact, server));
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

// Switch these two if you don't need isomorphic rendering
//exports.build = gulp.series(buildjs, buildreact);
exports.build = buildreact;

exports.dev = gulp.series(this.build, server, watch);
exports.buildreact = buildreact;
exports.buildjs = buildjs;
exports.server = server;
exports.default = this.build;