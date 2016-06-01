'use strict';
const git = require('simple-git');
const path = require('path');
const mkdirp = require('mkdirp');
const userPrompt = require('./userPrompt');

const getGitDirectory = directory => {
    return new Promise((resolve, reject) => {
        const npmRescueDirectory = path.join(directory, '/npm-rescue-backup');

        mkdirp(npmRescueDirectory, 0o744, error => {
            if (error) {
                return reject(Error(`Problem creating directory ${npmRescueDirectory}`));
            }

            console.log(`Created ${npmRescueDirectory}`);
            resolve(npmRescueDirectory);
        });
    });
};

const createRepo = gitInitPath => {
    return getGitDirectory(gitInitPath).then(gitDirectory => {
        return new Promise((resolve, reject) => {
            git(gitDirectory).init().then(() => {
                console.log('Initialised git repository');

                resolve(gitDirectory);
            });
        });
    }).catch(error => {
        console.log(error.message);
    });
};

module.exports = createRepo;
