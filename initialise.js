'use strict';
const findNpmPackages = require('./findNpmPackages');
const getRepoNames = require('./getRepoNames');
const userPrompt = require('./userPrompt');
const createRepo = require('./createRepo');

const initialise = userPrompt().then(directories => {
    const searchPath = directories[0];
    const gitInitPath = directories[1];

    findNpmPackages(searchPath).then(packages => {
        if (!packages.length) {
            console.log(`Cannot find any git projects with top level npm packages in ${directory}`)
        } else {
            console.log(`Found ${packages.length} npm package(s)`)
        }

        return getRepoNames(packages);
    }).then(npmGitPackages => {
        console.log(npmGitPackages);
    }).then(() => {
        return createRepo(gitInitPath);
    }).then(gitDirectory => {
        console.log('Got the ' + gitDirectory);
    });
});



//amalgamate npm-rescue.json file


// create JSON object that stores projects to backup -
/*{
    gitArchive: '/home/iain/gitArchive',
    npmPackages: {
        gitProjectA: '/home/iain/blahblahblah/package.json'
    }
}
*/
