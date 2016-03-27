'use strict';
const fs = require('fs');
const path = require('path');
const find = require('node-find-files');
const nodegit = require('nodegit');

const npmPackageFilter = (pathName, stats) => {
    if (!pathName.endsWith('package.json') || pathName.includes('node_modules')) {
        return false;
    }

    try {
        //  node-find-files assumes a synchronous filter function
        const gitStat = fs.statSync(path.join(path.dirname(pathName), '.git'));

        if (!gitStat) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

const verifyDirectory = directory => {
    return new Promise((resolve, reject) => {
        fs.stat(directory, (error, stats) => {
            if (error) {
                return reject(Error(error));
            }

            if (!stats.isDirectory()) {
                return reject(Error('File is not a valid directory.'));
            }

            resolve();
        });
    });
};

const searchDirectory = directory => {
    return new Promise((resolve, reject) => {
        const npmPackagesSearch = new find({
            rootFolder: directory,
            filterFunction: npmPackageFilter
        });

        const npmPackages = [];

        npmPackagesSearch.on('match', (strPath, stat) => {
            npmPackages.push(strPath);
        });

        npmPackagesSearch.on('complete', () => {
            return resolve(npmPackages);
        });

        npmPackagesSearch.startSearch();
    });
}

const findNpmPackages = directory => {
    return verifyDirectory(directory).then(() => {
        console.log(`Searching ${directory}...`);

        return directory;
    }, function(error) {
        console.log(error.message);
        process.exit(1);
    }).then(searchDirectory);
};

module.exports = findNpmPackages;
