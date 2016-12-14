const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const path = require('path');
const decompress = require('gulp-decompress');
const fileUrl = 'https://github.com/wfsovereign/protractor-dump/blob/master/node_modules.zip?raw=true';
const inputDir = path.join(__dirname, 'dump.zip');
const outputDir = path.join(__dirname, 'node_modules');

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
        console.log('input dir : ', inputDir);
        resolve();
      });
  });
};

gulp.task('unzip', function (done) {
  downloadZipFile().then(function (data) {
    gulp.src(inputDir)
      .pipe(decompress({ strip: 1 }))
      .pipe(gulp.dest(outputDir));
    console.log('output dir : ', outputDir);
    console.log('success unzip!');
    done();
  });
});
