'use strict';
const fs = require('fs');
const path = require('path');
const git = require('nodegit');

const npmPackages = [
    '/home/iain/dev/flux-todomvc/package.json',
    '/home/iain/dev/npm-rescue/package.json',
    '/home/iain/dev/todo-redux-react-webpack/package.json',
    '/home/iain/dev/react-tutorial/package.json',
    '/home/iain/dev/flux/package.json'
];

const npmPackageToGitRepo = function(npmPackage) {
    try {
        const gitPath = path.join(path.dirname(npmPackage), '.git');
        const gitStat = fs.statSync(gitPath);

        if (!gitStat.isDirectory) {
            return '';
        }

        return path.basename(path.join(gitPath, '..'));
    } catch (error) {
        return '';
    }
};

const npmRepoLookup = {};

const gitRepos = npmPackages.forEach(function(npmPackage) {
    npmRepoLookup[npmPackageToGitRepo(npmPackage)] = {
        npmPackage,
        gitRepo: path.join(path.dirname(npmPackage), '.git')
    };
});

console.log(npmRepoLookup);
