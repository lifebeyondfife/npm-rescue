'use strict';
const fs = require('fs');
const path = require('path');
const findNpmPackages = require('./findNpmPackages');
const getRepoNames = require('./getRepoNames');
const userPrompt = require('./userPrompt');
const createRepo = require('./createRepo');
const headCommit = require('./headCommit');
const createBranches = require('./createBranches');

const initialise = npmRescueConfig => {
    return userPrompt().then(userProperties => {
        const searchPath = userProperties[0];
        const gitInitPath = userProperties[1];

        let gitDirectory = undefined;
        let npmPackages = undefined;

        return Promise.all([findNpmPackages(searchPath).then(packages => {
                if (!packages.length) {
                    console.log(`Cannot find any git projects with top level npm packages in ${directory}`)
                } else {
                    console.log(`Found ${packages.length} npm package(s)`)
                }

                return getRepoNames(packages);
            }),
            createRepo(gitInitPath).then(_gitDirectory => {
                gitDirectory = _gitDirectory;
                return headCommit(gitDirectory);
            })
        ]).then(values => {
            npmPackages = values[0];
            return createBranches(npmPackages, gitDirectory);
        }).then(() => {
            const config = JSON.stringify({
                    npmPackages: npmPackages,
                    gitDirectory: path.resolve(gitDirectory),
                },
                null, 4
            );

            return new Promise((resolve, reject) => {
                fs.writeFile(npmRescueConfig, config, error => {
                    if (error) {
                        console.log(`Error creating ${npmRescueConfig}`);
                        process.exit(1);
                    }

                    console.log(`Created config file in ${npmRescueConfig}...`);
                    resolve();
                });
            });
        }).catch(error => {
            console.log(error.message);
        });
    });
};

module.exports = initialise;
