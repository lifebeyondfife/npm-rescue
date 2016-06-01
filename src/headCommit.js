'use strict';
const fs = require('fs-extra');
const git = require('simple-git');
const path = require('path');

const headCommit = gitDirectory => {
    return new Promise((resolve, reject) => {
        const readme = path.resolve(gitDirectory, 'README.md');

        fs.copySync(path.resolve('./docs', 'README.md'), readme);

        try {
            git(gitDirectory).
                add('README.md').
                commit('Initial npm-rescue commit.').
                then(() => {
                    resolve();
                });
        } catch(error) {
            return reject(error);
        }
    });
};

module.exports = headCommit;
