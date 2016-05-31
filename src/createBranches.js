'use strict';
const fs = require('fs-extra');
const git = require('nodegit');
const path = require('path');

const createBranchPromises = (npmPackages, repo, commit) => {
    const promises = [];

    npmPackages.map(npmPackage => {
        promises.push(git.Branch.create(repo, npmPackage.projectName, commit, 0).then(ref => {
            console.log(`Created '${npmPackage.projectName}'.`);
        }));
    });

    return promises;
};

const createBranches = (npmPackages, repo) => {
    return new Promise((resolve, reject) => {
        let commit = undefined;

        repo.getHeadCommit().then(c => {
            commit = c;
        }).then(() => {
            Promise.all(createBranchPromises(npmPackages, repo, commit)).then(resolve());
        }).catch(error => {
            console.log('Error while trying to create branches for npm projects.');
            reject(error.message);
        })
    });
};

module.exports = createBranches;
