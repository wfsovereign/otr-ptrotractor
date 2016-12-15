const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const path = require('path');
const mv = require('mv');
const decompress = require('gulp-decompress');
const fileUrl = 'https://coding.net/u/wfsovereign/p/file-dump/git/raw/master/selenium.zip';
const inputDir = path.join(__dirname, 'dump.zip');
const outputDir = path.join(__dirname, 'node_modules/selenium/');

const downloadZipFile = function () {
  let index = 0;
  return new Promise(function (resolve, reject) {
    request(fileUrl)
      .on('error', function (error) {
        console.log('pre error :', error);
      })
      .pipe(fs.createWriteStream('dump.zip'))
      .on('drain', function (chunk) {
        console.log('chunk ', ++index);
      })
      .on('open', function (chunk) {
        console.log('open chunk :', chunk);
      })
      .on('error', function (error) {
        console.log('error :', error);
      })
      .on('close', function () {
        console.log('File written!');
        console.log('input dir : ', inputDir);
        resolve();
      });
  });
};

gulp.task('unzip', function (done) {
  console.log('current dir: ', __dirname);
  const targetDir = path.join(__dirname, 'node_modules/protractor');
  const targetDestDir = __dirname;

  function moveAllFileByPath(targetDir, targetDestDir) {
    const allFile = fs.readdirSync(targetDir);
    allFile.forEach(ele => {
      console.log('move file :', ele);
      if (ele === 'gulpfile.js') return;
      if (ele === 'node_modules' || ele === '.bin') {
        moveAllFileByPath(path.join(targetDir, ele), path.join(targetDestDir, ele));
      } else {
        mv(path.join(targetDir, ele), path.join(targetDestDir, ele), { mkdirp: true }, function (err) {
          console.log('error : ', err);
          console.log('finished!');
        });
      }
    });
  }

  moveAllFileByPath(targetDir, targetDestDir);
  downloadZipFile().then(function (data) {
    gulp.src(inputDir)
      .pipe(decompress({ strip: 1 }))
      .pipe(gulp.dest(outputDir));
    console.log('output dir : ', outputDir);
    console.log('success unzip!');
    done();
  });
});
