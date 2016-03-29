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
    return gitDirectory(gitInitPath).then(path => {
        return git.Repository.init(path, 0).then(repository => {
            console.log('Initialised git repository');

            return path;
        });
    }).catch(error => {
        console.log(error.message);
    });
};

module.exports = createRepo;
