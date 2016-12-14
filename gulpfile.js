const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const decompress = require('gulp-decompress');
const fileUrl = 'https://github.com/wfsovereign/protractor-dump/blob/master/node_modules.zip?raw=true';
const downloadZipFile = function () {
  return new Promise(function (resolve, reject) {
    request(fileUrl)
      .pipe(fs.createWriteStream('dump.zip'))
      .on('drain', function (chunk) {
          console.log('chunk');
      })
      .on('open', function (chunk) {
          console.log('open chunk :', chunk);
      })
      .on('close', function () {
        console.log('File written!');
        resolve();
      });
  });
};

gulp.task('unzip', function (done) {
  downloadZipFile().then(function (data) {
    gulp.src('./dump.zip')
    .pipe(decompress({strip: 1}))
    .pipe(gulp.dest('./node_modules'));
    console.log('success unzip!');
    done();
  });
});
