'use strict';
const fs = require('fs-extra');
const git = require('simple-git');
const path = require('path');

const headCommit = gitDirectory => {
    return new Promise((resolve, reject) => {
        const readme = path.resolve(gitDirectory, 'README.md');
        const nodeReadme = path.resolve(__dirname, '..', 'docs', 'README.md');

        fs.copySync(nodeReadme, readme);

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
