"use strict";
var PORT, _s, addsrc, banner, browserSync, changed, concat, cssmin, dist, gulp, gutil, header, pkg, prefix, reload, sass, src, strip, uglify;

gulp = require("gulp");
gutil = require("gulp-util");
sass = require("gulp-sass");
concat = require("gulp-concat");
header = require("gulp-header");
uglify = require("gulp-uglify");
cssmin = require("gulp-cssmin");
addsrc = require("gulp-add-src");
changed = require("gulp-changed");
pkg = require("./package.json");
_s = require("underscore.string");
prefix = require("gulp-autoprefixer");
strip = require("gulp-strip-css-comments");
browserSync = require("browser-sync");
reload = browserSync.reload;

PORT = {
    GHOST: 2368,
    BROWSERSYNC: 3000
};

dist = {
    name: _s.slugify(pkg.name),
    css: "assets/css",
    js: "assets/js"
};

src = {
    sass: {
        main: "assets/scss/" + dist.name + ".scss",
        files: ["assets/scss/**/**"]
    },
    js: {
        fonts: [
            "assets/vendor/fontfaceobserver/fontfaceobserver.js",
            "assets/js/src/fonts.js"
        ],
        main: [
            "assets/js/src/__init.js",
            "assets/js/src/main.js",
            "assets/js/src/cover.js",
            "assets/js/src/search.js"
        ],
        vendor: [
            "assets/js/src/libs/subbscribe.js",
            "assets/vendor/ghostHunter/jquery.ghostHunter.min.js",
            "assets/vendor/fitvids/jquery.fitvids.js",
            "assets/vendor/reading-time/build/readingTime.min.js",
            "assets/vendor/prism/prism.js",
            "assets/vendor/prism/components/prism-core.min.js",
            "assets/vendor/prism/components/prism-clike.min.js",
            "assets/vendor/prism/components/prism-markup.min.js",
            "assets/vendor/prism/components/prism-c.min.js",
            "assets/vendor/prism/components/prism-basic.min.js",
            "assets/vendor/prism/components/prism-javascript.min.js",
            "assets/vendor/prism/components/prism-bash.min.js",
            "assets/vendor/prism/components/prism-csharp.min.js",
            "assets/vendor/prism/components/prism-fsharp.min.js",
            "assets/vendor/prism/components/prism-applescript.min.js",
            "assets/vendor/prism/components/prism-aspnet.min.js",
            "assets/vendor/prism/components/prism-diff.min.js",
            "assets/vendor/prism/components/prism-docker.min.js",
            "assets/vendor/prism/components/prism-git.min.js",
            "assets/vendor/prism/components/prism-go.min.js",
            "assets/vendor/prism/components/prism-http.min.js",
            "assets/vendor/prism/components/prism-ini.min.js",
            "assets/vendor/prism/components/prism-java.min.js",
            "assets/vendor/prism/components/prism-json.min.js",
            "assets/vendor/prism/components/prism-kotlin.min.js",
            "assets/vendor/prism/components/prism-makefile.min.js",
            "assets/vendor/prism/components/prism-markdown.min.js",
            "assets/vendor/prism/components/prism-objectivec.min.js",
            "assets/vendor/prism/components/prism-php.min.js",
            "assets/vendor/prism/components/prism-powershell.min.js",
            "assets/vendor/prism/components/prism-properties.min.js",
            "assets/vendor/prism/components/prism-python.min.js",
            "assets/vendor/prism/components/prism-rust.min.js",
            "assets/vendor/prism/components/prism-sql.min.js",
            "assets/vendor/prism/components/prism-swift.min.js",
            "assets/vendor/prism/components/prism-typescript.min.js",
            "assets/vendor/prism/components/prism-vbnet.min.js",
            "assets/vendor/prism/components/prism-yaml.min.js",
            "assets/vendor/toastr/toastr.min.js",
            "assets/vendor/store-js/store.min.js"
        ]
    },
    css: {
        main: "assets/css/" + dist.name + ".css",
        vendor: [
            "assets/vendor/prism/themes/prism-okaidia.css"
        ]
    },
    fonts: {
        files: [
            "assets/vendor/font-awesome/fonts/**.*"
        ],
        dest: "assets/fonts"
    }
};

banner = ["/**", " * <%= pkg.name %> - <%= pkg.description %>", " * @version <%= pkg.version %>", " * @link    <%= pkg.homepage %>", " * @author  <%= pkg.author.name %> (<%= pkg.author.url %>)", " * @license <%= pkg.license %>", " */", ""].join("\n");

gulp.task("fonts", function() {
    gulp.src(src.fonts.files)
        .pipe(gulp.dest(src.fonts.dest));
});

gulp.task("css", ["fonts"], function() {
    gulp.src(src.css.vendor).pipe(changed(dist.css)).pipe(addsrc(src.sass.main)).pipe(sass().on("error", gutil.log)).pipe(concat("" + dist.name + ".css")).pipe(prefix()).pipe(strip({
        all: true
    })).pipe(cssmin()).pipe(header(banner, {
        pkg: pkg
    })).pipe(gulp.dest(dist.css));
});

gulp.task("js", function() {
    gulp.src(src.js.fonts).pipe(addsrc(src.js.main)).pipe(changed(dist.js)).pipe(addsrc(src.js.vendor)).pipe(concat("" + dist.name + ".js")).pipe(uglify({
        mangle: false
    })).pipe(header(banner, {
        pkg: pkg
    })).pipe(gulp.dest(dist.js));
});

gulp.task("server", function() {
    browserSync.init(null, {
        proxy: "http://127.0.0.1:" + PORT.GHOST,
        files: ["assets/**/*.*"],
        reloadDelay: 300,
        port: PORT.BROWSERSYNC
    });
});

gulp.task("build", ["css", "js"]);

gulp.task("default", function() {
    gulp.start(["build", "server"]);
    gulp.watch(src.sass.files, ["css"]);
    gulp.watch(src.js.main, ["js"]);
    gulp.watch(src.js.fonts, ["js"]);
    return gulp.watch(src.js.vendor, ["js"]);
});
