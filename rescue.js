/*
 *  1.  Check npm-rescue-config.json exists
 *  2.  Parse JSON, set variables for the git directory and npmPackages
    3.  Create nodegit repo object for git directory (promise)
    4.  (wait for 3. then) Enumerate npmPackages
    4.1.    git checkout -b <npmPackage.projectName>
    4.2.    cp package.json to <gitDirectory> from <npmPackage.npmPackage>
 *  4.3.    exec("npm install")
    4.4.    git add .
    4.5.    git commit -m "Npm Rescue Backup at <XYZ> o'clock"
*/
'use strict';
const fs = require('fs');
const loadConfig = require('./src/loadConfig');

loadConfig.then(parsedJson => {
    //  When nodejs supports ES6 assignments natively
    //const { gitDirectory, npmPackages } = parsedJson;

    const gitDirectory = parsedJson.gitDirectory;
    const npmPackages = parsedJson.npmPackages;

    console.log(gitDirectory);
    console.log(npmPackages);
}).catch(error => {
    console.log(error.message);
})

/*  4.3
const spawn = require('child_process').spawn;
const npmInstall = spawn('npm', ['install']);

const printLine = line => {
    console.log(`${line}`);
};

npmInstall.stdout.on('data', printLine);
npmInstall.stderr.on('data', printLine);

npmInstall.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
*/
