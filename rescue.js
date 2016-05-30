'use strict';
const fs = require('fs-extra');
const git = require('simple-git');
const path = require('path');
const spawn = require('child_process').spawn;
const moment = require('moment');
const loadConfig = require('./src/loadConfig');

const printLine = line => {
    console.log(`${line}`);
};

const repoConfig = loadConfig.then(config => {
    const repo = git(config.gitDirectory);
    const npmRescuePackage = path.resolve(config.gitDirectory, 'package.json');

    var backupPackages = npmPackages => {
        var npmPackage = npmPackages.pop();

        if (npmPackage == undefined) {
            return new Promise((resolve, reject) => { resolve(); });
        }

        return new Promise((resolve, reject) => {
            repo.checkout(npmPackage.projectName).then(() => {
                const workingDirectory = path.dirname(npmPackage.npmPackage);
                fs.copySync(npmPackage.npmPackage, npmRescuePackage);

                process.chdir(workingDirectory);
                const npmInstall = spawn('npm', ['install'], { cwd: workingDirectory });
                npmInstall.stdout.on('data', printLine);
                npmInstall.stderr.on('data', printLine);
                npmInstall.on('close', code => {
                    console.log(`child process exited with code ${code}`);

                    return resolve(repo.
                        add('./*').
                        commit(`npm rescue backup of ${npmPackage.projectName} at ${moment().format('D MMM HH:MM')}.`)
                    );
                });
            });
        }).then(() => {
            console.log(`Backing up ${npmPackage.projectName}...`);
            return backupPackages(npmPackages);
        });
    };

    //  Backup action is chained recursively with promises
    //  to keep the order deterministic while doing file I/O
    backupPackages(config.npmPackages).then(() => {
        console.log('Finished.');
    });
}).catch(error => {
    console.log(error.message);
    process.exit(1);
});
