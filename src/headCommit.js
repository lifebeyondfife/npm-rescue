'use strict';
const fs = require('fs-extra');
const git = require('nodegit');
const path = require('path');

const headCommit = (repo, gitDirectory) => {
    return new Promise((resolve, reject) => {
        const readme = path.resolve(gitDirectory, 'README.md');

        fs.copySync(path.resolve('./docs', 'README.md'), readme);

        const signature = repo.defaultSignature();
        let index = undefined;

        repo.index().then(i => {
            index = i;
            return index.addByPath('README.md');
        }).then(code => {
            index.write();
            return index.writeTree();
        }).then(oid => {
            return repo.createCommit('HEAD', signature, signature, 'Initial npm-rescue commit.', oid);
        }).then(() => {
            return resolve(repo);
        }).catch(error => {
            return reject(error);
        });
    });
};

module.exports = headCommit;
