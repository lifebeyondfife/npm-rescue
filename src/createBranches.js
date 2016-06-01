'use strict';
const fs = require('fs-extra');
const git = require('simple-git');
const path = require('path');

//  TODO: work out how to do this using the yield keyword in strict mode
const createBranchPromises = (npmPackages, gitDirectory) => {
    const promises = [];

    npmPackages.map(npmPackage => {
        promises.push(git(gitDirectory).checkoutBranch(npmPackage.projectName, 'master', () => {
            console.log(`Created '${npmPackage.projectName}'.`);
        }));
    });

    return promises;
};

const createBranches = (npmPackages, gitDirectory) => {
    return new Promise((resolve, reject) => {
        Promise.all(createBranchPromises(npmPackages, gitDirectory)).then(() => {
            resolve();
        }).catch(error => {
            console.log('Error creating branches for npm projects.');
            reject(error.message);
        })
    });
};

module.exports = createBranches;
