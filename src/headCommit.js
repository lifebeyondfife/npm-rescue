'use strict';
const fs = require('fs-extra');
const git = require('nodegit');
const path = require('path');

const headCommit = (repo, gitDirectory) => {
    return new Promise((resolve, reject) => {
        const readme = path.resolve(gitDirectory, 'README.md');

        fs.copySync(path.resolve('./docs', 'README.md'), readme);

        const signature = repo.defaultSignature();
        let gitConfig = undefined;
        let index = undefined;

        repo.createCommitOnHead([], signature, signature, 'Initial npm-rescue commit.').then(oid => {
            gitConfig = {headCommitOid: oid.tostrS(), gitDirectory};
            return repo.index();
        }).then(i => {
            index = i;
            //return index.addAll(git.Pathspec.create(['.']), git.Index.ADD_OPTION.ADD_DEFAULT);
            return index.addByPath('README.md');
        }).then(code => {
            index.write();
            return index.writeTree();
        }).then(oid => {
            //  get the necessary parameters for a call to
            //      git.Reference.nameToId(repo, 'HEAD').then(head => { return repo.getCommit(head) })
            //          .then(parent => {});
            //      repo.createCommit('HEAD', signature, signature, 'Commit message', oid, [parent]);

            //  Can call repo.index() *FIRST*, then do the createCommit.

        })



        .then(() => {
            return resolve(gitConfig);
        }).catch(error => {
            return reject(error);
        });
    });
};

module.exports = headCommit;
