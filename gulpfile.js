const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const decompress = require('gulp-decompress');
const fileUrl = 'https://github.com/wfsovereign/protractor-dump/blob/master/node_modules.zip?raw=true';
const downloadZipFile = function () {
  return new Promise(function (resolve, reject) {
    request(fileUrl)
      .pipe(fs.createWriteStream('dump.zip'))
      .on('line', function (chunk) {
        console.log('chunk: ', chunk);
      })
      .on('pipe', function (chunk) {
          console.log('pipe chunk :', chunk);
      })
      .on('unpipe', function (chunk) {
          console.log('unpipe chunk :', chunk);
      })
      .on('drain', function (chunk) {
          console.log('chunk :', chunk);
      })
      .on('open', function (chunk) {
          console.log('open chunk :', chunk);
      })
      .on('data', function (chunk) {
          console.log(chunk);
      })
      .on('SIGONT', function (chunk) {
          console.log(chunk);
      })
      .on('SIGINT', function (chunk) {
          console.log(chunk);
      })
      .on('SIGTSTP', function (chunk) {
          console.log(chunk);
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
