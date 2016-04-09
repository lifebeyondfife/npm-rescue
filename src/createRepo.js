'use strict';
const git = require('nodegit');
const path = require('path');
const mkdirp = require('mkdirp');
const userPrompt = require('./userPrompt');

const gitDirectory = directory => {
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

const createRepo = (gitInitPath) => {
    return gitDirectory(gitInitPath).then(gitDirectory => {
        return git.Repository.init(gitDirectory, 0).then(repo => {
            console.log('Initialised git repository');

            return {gitDirectory, repo};
        });
    }).catch(error => {
        console.log(error.message);
    });
};

module.exports = createRepo;
