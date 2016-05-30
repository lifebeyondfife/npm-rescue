'use strict';
const fs = require('fs-extra');
const git = require('simple-git');
const path = require('path');
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
            console.log(`Backing up ${npmPackage.projectName}...`);

            repo.checkout(npmPackage.projectName).then(() => {
                const workingDirectory = path.dirname(npmPackage.npmPackage);
                fs.copySync(npmPackage.npmPackage, npmRescuePackage);

                process.chdir(config.gitDirectory);
                const npmInstall = require('child_process').spawn('npm', ['install'], { cwd: config.gitDirectory });

                //  Uncomment for detailed console output
                //  npmInstall.stdout.on('data', printLine);
                //  npmInstall.stderr.on('data', printLine);

                npmInstall.on('close', code => {
                    if (code === 1) {
                        console.log(`\nERROR with ${npmPackage.projectName}!\n`);
                    }

                    return resolve(repo.
                        add('./*').
                        commit(`npm rescue backup of ${npmPackage.projectName} at ${moment().format('D MMM HH:MM')}.`)
                    );
                });
            });
        }).then(() => {
            return backupPackages(npmPackages);
        });
    };

    //  Backup action is chained recursively with promises
    //  to keep the order deterministic while doing file I/O
    backupPackages(config.npmPackages);
}).catch(error => {
    console.log(error.message);
    process.exit(1);
});
