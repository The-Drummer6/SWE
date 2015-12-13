/*
 * Copyright (C) 2015 Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global process */

/* eslint-disable quotes */
/* eslint-enable quotes: [2, "single"] */

/**
 * Tasks auflisten
 *    gulp --tasks
 *    gulp --tasks-simple
 */

import gulp from 'gulp';
import gulplog from 'gulplog';

// import debug from 'gulp-debug';
import gulpTslint from 'gulp-tslint';
import gulpNewer from 'gulp-newer';
import gulpSass from 'gulp-sass';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpRename from 'gulp-rename';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpMinifyCss from 'gulp-minify-css';
import gulpImagemin from 'gulp-imagemin';
import gulpClangFormat from 'gulp-clang-format';
import clangFormatPkg from 'clang-format';
import gulpTypescript from 'gulp-typescript';
import typescript from 'typescript';
import Builder from 'systemjs-builder';
import tsconfigGlobPkg from 'tsconfig-glob';

// FIXME Gulp 4, statt console.log: import log from '...'; log.info('...');
import chalk from 'chalk';
import shelljs from 'shelljs';
import rimraf from 'rimraf';

// Benutzername und Passwort fuer das IZ
import proxyFile from './config/proxy/proxy';
import browserSyncPkg from 'browser-sync';
import connectHistoryApiFallback from 'connect-history-api-fallback';
import minimist from 'minimist';

const host = '127.0.0.1',
    port = 9443,
    portJsonServer = 8444,

    srcDir = 'src',
    jspmDir = 'jspm_packages',
    distDir = 'dist',
    baseDirWeb = '.',

    dir = {
        sass: `${srcDir}/sass`,
        css: `${srcDir}/css`,
        img: `${srcDir}/img`,

        cssDist: `${distDir}/css`,
        imgDist: `${distDir}/img`,
        fonts: `${distDir}/fonts`,
        doc: `${distDir}/doc`,
        js: 'js',

        bootstrapCss: `${jspmDir}/github/twbs/bootstrap@*`,
        fontawesome: `${jspmDir}/github/FortAwesome/Font-Awesome@*`,
        animate: `${jspmDir}/github/daneden/animate.css@*`
    },

    dateien = {
        ts: [`${srcDir}/bootstrap.ts`, `${srcDir}/**/*.ts`],
        sass: `${dir.sass}/style.scss`,
        cssOther: [
            `${dir.bootstrapCss}/css/*.min.css`,
            `${dir.bootstrapCss}/css/*.css.map`,
            `${dir.fontawesome}/css/*.min.css`,
            `${dir.fontawesome}/css/*.css.map`,
            `${dir.animate}/animate.css/*.min.css`
        ],
        cssWatch: [
            `${dir.bootstrapCss}/css/*.min.css`,
            `${dir.fontawesome}/css/*.min.css`,
            `${dir.animate}/animate.css/*.min.css`
        ],
        fonts: `${dir.fontawesome}/fonts/*`,

        html: [`${srcDir}/**/*.html`],
        img: `${dir.img}/*`
    },

    minExtCss = '.min.css';

function tsconfigGlob() {
    'use strict';
    return tsconfigGlobPkg({
        configPath: ".",
        cwd: process.cwd(),
        indent: 4
    });
}
gulp.task(tsconfigGlob);

function tslint() {
    'use strict';
    return gulp.src(`${srcDir}/**/*.ts`)
        //.pipe(debug({title: 'tslint:'}))
        .pipe(gulpTslint())
        .pipe(gulpTslint.report('prose'));
}
gulp.task(tslint);

function clangFormat(done) {
    'use strict';
    // http://clang.llvm.org/docs/ClangFormatStyleOptions.html
    return gulp.src(`${srcDir}/**/*.ts`)
        // clang ist ein C/C++/Objective-C Compiler des Projekts LLVM http://www.llvm.org
        // Formatierungseinstellungen in .clang-format:
        // Google (default) http://google-styleguide.googlecode.com/svn/trunk/cppguide.html
        // LLVM http://llvm.org/docs/CodingStandards.html
        // Chromium http://www.chromium.org/developers/coding-style
        // Mozilla https://developer.mozilla.org/en-US/docs/Developer_Guide/Coding_Style
        // WebKit http://www.webkit.org/coding/coding-style.html
        .pipe(gulpClangFormat.checkFormat('file', clangFormatPkg, {verbose: true}))
        .on('warning', function(e) {
            process.stdout.write(e.message);
            done();
            process.exit(1);
        });
}
gulp.task(clangFormat);

// FIXME clang-format kann nicht parallel zu tslint ausgefuehrt werden
gulp.task('check', gulp.series(gulp.parallel(tslint), clangFormat));

function tsc() {
    'use strict';
    const tsProject = gulpTypescript.createProject('tsconfig.json', {typescript: typescript});
    return tsProject.src()
        .pipe(gulpTypescript(tsProject), undefined, gulpTypescript.reporter.longReporter())
        .pipe(gulp.dest(dir.js));
}
gulp.task('tsc', gulp.series('check', tsc));

function css() {
    'use strict';
    return gulp.src(dateien.sass)
        .pipe(gulpNewer(`${dir.css}/style.min.css`))
        .pipe(gulpSass())
        // Zulaessige Prefixe (-webkit, -moz, ...) siehe http://caniuse.com
        .pipe(gulpAutoprefixer({
            // siehe https://github.com/ai/browserslist
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(dir.css))
        .pipe(gulpRename({extname: minExtCss}))
        .pipe(gulpSourcemaps.init())
        .pipe(gulpMinifyCss())
        .pipe(gulpSourcemaps.write())
        .pipe(gulp.dest(dir.cssDist));
}
gulp.task(css);

gulp.task('default', gulp.parallel('check', css));

function watch() {
    'use strict';
    // Aenderungen an TypeScript-Dateien?
    gulp.watch(dateien.ts, ['check']);

    // Aenderungen an der Sass-Datei?
    gulp.watch(dateien.sass, ['css']);
}
gulp.task(watch);

function prodBundle(done) {
    'use strict';
    const builder = new Builder();
    const inputPath = 'src/bootstrap.ts';
    const outputFile = `${distDir}/build.js`;
    const outputOptions = {sourceMaps: true, config: {sourceRoot: distDir}};

    builder.loadConfig('config.js')
        .then(() => {
            builder.buildStatic(inputPath, outputFile, outputOptions)
                .then(() => done())
                .catch((ex) => done(new Error(ex)));
        });
}
gulp.task('prodBundle', gulp.series('check', prodBundle));

function prodJs() {
    'use strict';
    gulplog.error(chalk.yellow.bgRed.bold('!!! Noch nicht implementiert !!!'));
}
gulp.task('prodJs', gulp.series('prodBundle', prodJs));

function prodCopyCss() {
    'use strict';
    return gulp.src(dateien.cssOther)
        .pipe(gulpNewer(dir.cssDist))
        .pipe(gulp.dest(dir.cssDist));
}
gulp.task(prodCopyCss);

// Fontawesome erwartet die Font-Dateien relativ zur CSS-Datei im Verzeichnis ../fonts
function prodCopyFonts() {
    'use strict';
    return gulp.src(dateien.fonts)
        .pipe(gulpNewer(dir.fonts))
        .pipe(gulp.dest(dir.fonts));
}
gulp.task(prodCopyFonts);

// nach der Installation von gulp-imagemin ist der Pfad node_modules\gulp-imagemin\... zum Loeschen zu lang
// Workaround: kuerzer Pfad durch das Windows-Kommando SUBST bis sich ein Teil des Pfades loeschen laesst usw.
function prodImg() {
    'use strict';
    return gulp.src(dateien.img)
        .pipe(gulpNewer(dir.imgDist))
        .pipe(gulpImagemin())
        .pipe(gulp.dest(dir.imgDist));
}
gulp.task(prodImg);

gulp.task('prod', gulp.parallel('prodJs', css, prodCopyCss, prodCopyFonts, prodImg));

function clean(done) {
    'use strict';
    rimraf(distDir, (e) => { if (e) { throw e; }});
    rimraf(dir.css, (e) => { if (e) { throw e; }});
    done();
}
gulp.task(clean);

// Bei file:/// erlaubt jeder Browser aus Sicherheitsgründen keine Ajax-Requests,
// weil JavaScript sonst direkt im Dateisystem lesen koennte
function browserSync() {
    'use strict';

    const argv = minimist(process.argv.slice(2));

    // browser-sync basiert auf connect   https://github.com/browsersync/browser-sync
    // Evtl. Probleme mit Windows 10: https://github.com/BrowserSync/browser-sync/issues/718
    const options = {
        // http://www.browsersync.io/docs/options
        server: {baseDir: baseDirWeb},
        https: {key: 'config/https/webserver.pem', cert: 'config/https/webserver.cer'},
        port: port,
        host: host,
        middleware: [connectHistoryApiFallback()],
        // Falls die Option --online NICHT gesetzt ist, sind xip und tunnel deaktiviert (werden fuer SWE nicht benoetigt)
        online: argv.online !== undefined,
        // Admin-Oberflaeche durch http://localhost:3001 wird deaktiviert
        ui: false,
        // 'default', 'firefox', 'chrome'
        browser: 'chrome',
        reloadOnRestart: true,
        notify: false

        // Weitere Defaultwerte:
        // port: 3000
        // open: 'local'
    };

    browserSyncPkg.create().init(options);
}
gulp.task(browserSync);

// Bei file:/// erlaubt jeder Browser aus Sicherheitsgründen keine Ajax-Requests,
// weil JavaScript sonst direkt im Dateisystem lesen koennte
function httpServer() {
    'use strict';

    // http-server als Webserver: auch einfach von der Console zu starten
    //                            KEIN Refresh moeglich bei SPA mit HTML5-Pfaden statt Hash-Location
    // github.com/indexzero/http-server
    // https://angular.io/docs/js/latest/quickstart.html
    shelljs.exec(`http-server ${baseDirWeb} -a 127.0.0.1 -p ${port} -S -K config/https/webserver.pem -C config/https/webserver.cer -c no-cache`);
}
gulp.task(httpServer);

// live-server basiert auch auf connect, kann aber kein https
// https://www.npmjs.com/package/live-server
// https://github.com/tapio/live-server

// gulp-webserver kann nur das aktuelle Verzeichnis als Basisverzeichnis
// https://github.com/schickling/gulp-webserver

// Port 8444 statt 8443, weil bei json-server "http" verwendet werden muss und nicht "https"
//      http://localhost:8444
//      http://localhost:8444/db
//      http://localhost:8444/shop/rest/buecher
//      http://localhost:8444/shop/rest/buecher/00000001-0000-0000-0000-000000000001
function jsonServer() {
    'use strict';
    shelljs.exec(`json-server --watch config/jsonserver/db.json --routes config/jsonserver/routes.json --port ${portJsonServer}`);
}
gulp.task(jsonServer);

function doc(done) {
    'use strict';
    gulplog.error(chalk.yellow.bgRed.bold('TypeDoc muss noch eingebaut werden.'));
    gulplog.error(chalk.yellow.bgRed.bold('dgeni von und fuer AngularJS ist aufwaendig zu konfigurieren.'));
    done();
}
gulp.task(doc);

function proxyNpm(done) {
    'use strict';
    shelljs.exec(`npm c set proxy http://${proxyFile.USERNAME}:${proxyFile.PASSWORD}@proxy.hs-karlsruhe.de:8888`);
    shelljs.exec(`npm c set https-proxy http://${proxyFile.USERNAME}:${proxyFile.PASSWORD}@proxy.hs-karlsruhe.de:8888`);
    done();
}
gulp.task(proxyNpm);

function proxyGit(done) {
    'use strict';
    shelljs.exec(`git config --global http.proxy http://${proxyFile.USERNAME}:${proxyFile.PASSWORD}@proxy.hs-karlsruhe.de:8888`);
    shelljs.exec(`git config --global https.proxy http://${proxyFile.USERNAME}:${proxyFile.PASSWORD}@proxy.hs-karlsruhe.de:8888`);
    shelljs.exec('git config --global url."http://".insteadOf git://');
    done();
}
gulp.task(proxyGit);

function proxyJspm(done) {
    'use strict';
    gulplog.info(chalk.yellow.bgRed.bold('Proxy fuer jspm: in der Kommandozeile'));
    gulplog.info(chalk.yellow.bgRed.bold(`  SET HTTP_PROXY=http://${proxyFile.USERNAME}:${proxyFile.PASSWORD}@proxy.hs-karlsruhe.de:8888`));
    gulplog.info(chalk.yellow.bgRed.bold(`  SET HTTPS_PROXY=...`));
    done();
}
gulp.task('proxy', gulp.parallel(proxyNpm, proxyGit, proxyJspm));

function noproxyNpm(done) {
    'use strict';
    shelljs.exec('npm c delete proxy');
    shelljs.exec('npm c delete https-proxy');
    done();
}
gulp.task(noproxyNpm);

function noproxyGit(done) {
    'use strict';
    shelljs.exec('git config --global --unset http.proxy');
    shelljs.exec('git config --global --unset https.proxy');
    shelljs.exec('git config --global --unset url."http://".insteadOf');
    done();
}
gulp.task(noproxyGit);

function noproxyJspm(done) {
    'use strict';
    gulplog.info(chalk.yellow.bgRed.bold('Kein Proxy fuer jspm: in der Kommandozeile'));
    gulplog.info(chalk.yellow.bgRed.bold('  UNSET HTTP_PROXY '));
    gulplog.info(chalk.yellow.bgRed.bold('  UNSET HTTPS_PROXY'));
    done();
}
gulp.task('noproxy', gulp.parallel(noproxyNpm, noproxyGit, noproxyJspm));

function notes(done) {
    'use strict';
    gulplog.info(chalk.yellow.bgRed.bold(`Besser direkt aufrufen: notes ${srcDir}`));
    shelljs.exec(`notes ${srcDir}`);
    done();
}
gulp.task(notes);

function deps(done) {
    'use strict';
    gulplog.info(chalk.yellow.bgRed.bold('Besser direkt aufrufen: npm-dview'));
    shelljs.exec('npm-dview');
    done();
}
gulp.task(deps);
