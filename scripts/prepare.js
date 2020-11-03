require('console-success');
const fs = require('fs');
var path = require('path');
const {exec} = require('child_process');
var copydir = require('copy-dir');
const institution = process.argv[2];
const platform = process.argv[3] || 'ios';
const name = process.argv[4] || '';
const identifier = process.argv[5] || '';
//npm run prepare cafam android fastlaneapp com.fastlaneapp

const configFile = './app/config/index.js';

const init = () => {
  changeConfigFolder();
  replaceIcons();
  if (platform === 'android') {
    replaceIdentifier();
  }
};

const changeConfigFolder = () => {
  fs.readFile(configFile, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(
      /import Institucion from '\.\/.*\/institucion'/,
      "import Institucion from './" + institution + "/institucion'",
    );

    fs.writeFile(configFile, result, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      } else {
        console.success('File configuration success');
      }
    });
  });
};

const replaceIcons = () => {
  if (platform == 'ios') {
    const infoFile = './ios/fastlaneApp/Base.lproj/LaunchScreen.xib';
    fs.readFile(infoFile, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var resultInfoPlist = data.replace(
        /launch_screen_(.)*\.png/gi,
        'launch_screen_' + institution + '.png',
      );

      fs.writeFile(infoFile, resultInfoPlist, 'utf8', function (err) {
        if (err) {
          return console.log(err);
        } else {
          console.success('Replace ios icon success');
        }
      });
    });
  } else {
    var sourcePath = './app/config/' + institution + '/android';
    var destinationPath = './android/app/src/main/res/';

    copydir(sourcePath, destinationPath, function (err) {
      if (err) {
        return console.log(err);
      } else {
        console.success('Replace android icon success');
      }
    });
  }
};

const replaceIdentifier = () => {
  exec(
    `react-native-rename ${name} -b ${identifier}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    },
  );
};

init();
