'use strict';
const fs = require('fs');
const path = require('path');
const git = require('nodegit');

const npmPackageToGitDirectory = npmPackage => {
    try {
        const gitPath = path.join(path.dirname(npmPackage), '.git');
        const gitStat = fs.statSync(gitPath);

        if (!gitStat.isDirectory) {
            return '';
        }

        return path.join(gitPath, '..');
    } catch (error) {
        return '';
    }
};

const npmProjects = function(npmPackages) {
    return Promise.all(npmPackages.map(npmPackage => {
        return new Promise((resolve, reject) => {
            const gitDirectory = npmPackageToGitDirectory(npmPackage);

            git.Repository.open(gitDirectory).then(repo => {
                return repo;
            }).then(repo => {
                git.Remote.lookup(repo, 'origin', null).then(remote => {
                    resolve({
                        projectName: path.basename(remote.url()),
                        npmPackage
                    });
                });
            });
        });
    }));
};

module.exports = npmProjects;
