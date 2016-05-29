/*
 *  1.  Check npm-rescue-config.json exists
 *  2.  Parse JSON, set variables for the git directory and npmPackages
 *  3.  Create nodegit repo object for git directory (promise)
 *  4.  (wait for 3. then) Enumerate npmPackages
 *  4.1.    git checkout <npmPackage.projectName>
 *  4.2.    cp package.json to <gitDirectory> from <npmPackage.npmPackage>
 *  4.3.    exec("npm install")
    4.4.    git add .
    4.5.    git commit -m "Npm Rescue Backup at <XYZ> o'clock"
 */
'use strict';
const fs = require('fs-extra');
const git = require('simple-git');
const path = require('path');
const loadConfig = require('./src/loadConfig');

const repoConfig = loadConfig.then(config => {
    const repo = git(config.gitDirectory);
    const npmRescuePackage = path.resolve(config.gitDirectory, 'package.json');

    var processPromise = npmPackages => {
        var npmPackage = npmPackages.pop();

        if (npmPackage == undefined) {
            return new Promise((resolve, reject) => { resolve(); });
        }

        return new Promise((resolve, reject) => {
            repo.checkout(npmPackage.projectName).then(() => {
                fs.copySync(npmPackage.npmPackage, npmRescuePackage);
                //  Put 4.3 here.
                return resolve(repo.
                    add(['package.json']).
                    commit(`npm rescue backup of ${npmPackage.projectName}.`)
                );
            });
        }).then(() => {
            console.log(`Backing up ${npmPackage.projectName}...`);
            return processPromise(npmPackages);
        });
    };

    processPromise(config.npmPackages).then(() => {
        console.log('Finished.');
    });
}).catch(error => {
    console.log(error.message);
    process.exit(1);
});

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
