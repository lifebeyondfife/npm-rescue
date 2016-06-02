'use strict';
const fs = require('fs');
const path = require('path');
const git = require('simple-git');

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

            git(gitDirectory).getRemotes(true, (error, remotes) => {
                remotes.
                    filter(r => r.name == 'origin').
                    map(r => {
                        resolve({
                            projectName: path.basename(r.refs.fetch),
                            npmPackage: path.resolve(npmPackage)
                        });
                    });
            });
        });
    }));
};

module.exports = npmProjects;
