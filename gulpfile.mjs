import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import cssnano from "gulp-cssnano";
import rev from "gulp-rev";
// import uglify from "gulp-uglify-es";
import terser from "gulp-terser";
import imagemin from "gulp-imagemin";
import del from "gulp-clean";

function cssTask(done) {
  console.log("minifying css");

  gulp
    .src("./assets/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets.css"));

  gulp
    .src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
}

function jsTask(done) {
  console.log("minifying js");
  gulp
    .src("./assets/**/*.js")
    .pipe(terser())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
}

function imgTask(done) {
  console.log("compressing images...");
  gulp
    .src("./assets/**/*.+(png|jpg|gif|jpeg)")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
}

gulp.task("css", cssTask);
gulp.task("js", jsTask);
gulp.task("images", imgTask);

gulp.task("clean:assets", function (done) {
  del("./public/assets");
  done();
});

gulp.task(
  "build",
  gulp.series("clean:assets", "css", "js", "images"),
  function (done) {
    console.log("Building assets");
    done();
  }
);
