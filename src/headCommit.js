'use strict';
const fs = require('fs-extra');
const git = require('nodegit');
const path = require('path');

const headCommit = (repo, gitDirectory) => {
    return new Promise((resolve, reject) => {
        const readme = path.resolve(gitDirectory, 'README.md');

        fs.copySync(path.resolve('./docs', 'README.md'), readme);

        repo.createCommitOnHead([readme], repo.defaultSignature(), repo.defaultSignature(), 'Initial npm-rescue commit.').then(oid => {
            return resolve({headCommitOid: oid.tostrS(), gitDirectory});
        }).catch(error => {
            return reject(error);
        });
    });
};

module.exports = headCommit;
