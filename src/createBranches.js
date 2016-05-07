'use strict';
const fs = require('fs-extra');
const git = require('nodegit');
const path = require('path');

//  TODO: work out how to do this using the yield keyword in strict mode
const createBranchPromises = (npmPackages, repo, commit) => {
    const promises = [];
    npmPackages.map(npmPackage => {
        promise.push(git.Branch.create(repo, npmPackage.projectName, commit));
    });
    console.log('failing (not getting) here');
    return promises;
};

const createBranches = (npmPackages, repo, branchOid) => {
    return new Promise((resolve, reject) => {
        let commit = undefined;

        //  this value of branchOid isn't correct except for the first call of initialise.js
        console.log(branchOid.toString());
        git.Commit.lookup(repo, branchOid).then(c => {
            commit = c;
        }).then(() => {
            return Promise.all(createBranchPromises(npmPackages, repo, commit));
        }).then(() => {
            resolve();
        }).catch(error => {
            console.log('Error while trying to create branches for npm projects.');
            reject(error.message);
        })
    });
};

module.exports = createBranches;
