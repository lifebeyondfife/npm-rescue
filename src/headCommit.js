'use strict';
const fs = require('fs-extra');
const git = require('nodegit');
const path = require('path');

const headCommit = (repo, gitDirectory, gitUsername, gitEmailAddress) => {
    return new Promise((resolve, reject) => {
        const readme = path.resolve(gitDirectory, 'README.md');

        fs.copySync(path.resolve('./docs', 'README.md'), readme);

        const signature = git.Signature.now(gitUsername, gitEmailAddress);

        repo.createCommitOnHead([readme], signature, signature, 'Initial npm-rescue commit.').then(oid => {
            return resolve({headCommitOid: oid.tostrS(), gitDirectory});
        }).catch(error => {
            return reject(error);
        });
    });
};

module.exports = headCommit;
