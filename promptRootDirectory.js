"use strict";
const prompt = require('prompt');
const findNpmPackages = require('./findNpmPackages');

let homeDirectory = process.env[
    (process.platform == 'win32') ? 'USERPROFILE' : 'HOME'
];

prompt.message = '';
prompt.start();

var directoryPromise = new Promise(function(resolve, reject) {
    prompt.get({
        properties: {
            searchDirectory: {
                description: `Enter the root directory of your npm projects (${homeDirectory})`
            }
        }
    }, function(error, result) {
        if (error) {
            reject(Error(error));
        }

        resolve(result);
    });
}).then(function(result) {
    return result.searchDirectory || homeDirectory;
}, function(error) {
    console.log(error.message);
    process.exit(1);
});

const npmPackages = directoryPromise.then(function(directory) {
    findNpmPackages(directory).then(function(result) {
        if (!result.length) {
            console.log(`Cannot find any git projects with top level npm packages in ${directory}`)
        } else {
            console.log(`Found ${result.length} npm package(s)`)
        }
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
