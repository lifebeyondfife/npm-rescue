'use strict';
const fs = require('fs-extra');
const git = require('simple-git');
const path = require('path');

let gitDirectory = undefined;

const createBranchesRecursive = npmPackages => {
    var npmPackage = npmPackages.pop();

    if (npmPackage == undefined) {
        return new Promise((resolve, reject) => { resolve(); });
    }

    return new Promise((resolve, reject) => {
        git(gitDirectory).checkoutBranch(npmPackage.projectName, 'master', () => {
            console.log(`Created branch for '${npmPackage.projectName}'.`);
            resolve();
        })
    }).then(() => {
        return createBranchesRecursive(npmPackages);
    });
};

const createBranches = (npmPackages, _gitDirectory) => {
    gitDirectory = _gitDirectory;

    return createBranchesRecursive(npmPackages.slice(0)).catch(error => {
        console.log('Error creating branches for npm projects.');
        console.log(error.message);
        process.exit(1);
    });
};

module.exports = createBranches;
