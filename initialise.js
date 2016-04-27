'use strict';
const fs = require('fs');
const path = require('path');
const findNpmPackages = require('./src/findNpmPackages');
const getRepoNames = require('./src/getRepoNames');
const userPrompt = require('./src/userPrompt');
const createRepo = require('./src/createRepo');
const headCommit = require('./src/headCommit');

const initialise = userPrompt().then(userProperties => {
    const searchPath = userProperties[0];
    const gitInitPath = userProperties[1];
    const gitUsername = userProperties[2];
    const gitEmailAddress = userProperties[3];

    Promise.all([findNpmPackages(searchPath).then(packages => {
            if (!packages.length) {
                console.log(`Cannot find any git projects with top level npm packages in ${directory}`)
            } else {
                console.log(`Found ${packages.length} npm package(s)`)
            }

            return getRepoNames(packages);
        }),
        createRepo(gitInitPath).then(git => {
            return headCommit(git.repo, git.gitDirectory, gitUsername, gitEmailAddress);
        })
    ]).then(values => {
        const config = JSON.stringify({
                npmPackages: values[0],
                gitDirectory: path.resolve(values[1].gitDirectory),
                headCommitOid: values[1].headCommitOid,
                gitSignature: {
                    user: gitUsername,
                    email: gitEmailAddress
                }
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
    });
});
