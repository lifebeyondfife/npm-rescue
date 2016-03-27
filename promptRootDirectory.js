"use strict";
const prompt = require('prompt');
const findNpmPackages = require('./findNpmPackages');
const getRepoNames = require('./getRepoNames');

let homeDirectory = process.env[
    (process.platform == 'win32') ? 'USERPROFILE' : 'HOME'
];

prompt.message = '';
prompt.start();

var directoryPromise = new Promise((resolve, reject) => {
    prompt.get({
        properties: {
            searchDirectory: {
                description: `Enter the root directory of your npm projects (${homeDirectory})`
            }
        }
    }, (error, result) => {
        if (error) {
            reject(Error(error));
        }

        resolve(result);
    });
}).then(userInput => {
    return userInput.searchDirectory || homeDirectory;
}, error => {
    console.log(error.message);
    process.exit(1);
});

const npmPackages = directoryPromise.then(directory => {
    findNpmPackages(directory).then(packages => {
        if (!packages.length) {
            console.log(`Cannot find any git projects with top level npm packages in ${directory}`)
        } else {
            console.log(`Found ${packages.length} npm package(s)`)
        }

        return getRepoNames(packages);
    }).then(npmGitPackages => {
        console.log(npmGitPackages);
    });
});

// create JSON object that stores projects to backup -
/*{
    gitArchive: '/home/iain/gitArchive',
    npmPackages: {
        gitProjectA: '/home/iain/blahblahblah/package.json'
    }
}
*/
