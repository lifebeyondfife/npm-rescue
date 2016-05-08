'use strict';
const fs = require('fs');
const path = require('path');
const findNpmPackages = require('./src/findNpmPackages');
const getRepoNames = require('./src/getRepoNames');
const userPrompt = require('./src/userPrompt');
const createRepo = require('./src/createRepo');
const headCommit = require('./src/headCommit');
const createBranches = require('./src/createBranches');

const initialise = userPrompt().then(userProperties => {
    const searchPath = userProperties[0];
    const gitInitPath = userProperties[1];

    let gitDirectory = undefined;
    let npmPackages = undefined;
    let repo = undefined;
    let branchOid = undefined;

    Promise.all([findNpmPackages(searchPath).then(packages => {
            if (!packages.length) {
                console.log(`Cannot find any git projects with top level npm packages in ${directory}`)
            } else {
                console.log(`Found ${packages.length} npm package(s)`)
            }

            return getRepoNames(packages);
        }),
        createRepo(gitInitPath).then(git => {
            gitDirectory = git.gitDirectory;
            return headCommit(git.repo, git.gitDirectory);
        })
    ]).then(values => {
        npmPackages = values[0];
        repo = values[1];

        return createBranches(npmPackages, repo);
    }).then(() => {
        const config = JSON.stringify({
                npmPackages: npmPackages,
                gitDirectory: path.resolve(gitDirectory),
            },
            null, 4
        );

        fs.writeFile('./npm-rescue-config.json', config, error => {
            if (error) {
                console.log('Error creating npm-rescue-config.json');
                process.exit(1);
            }

            console.log('Created config file in npm-rescue-config.json...');
        });
    }).catch(error => {
        console.log(error.message);
    });
});
