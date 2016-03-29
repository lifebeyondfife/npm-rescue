'use strict';
const fs = require('fs');
const path = require('path');
const findNpmPackages = require('./src/findNpmPackages');
const getRepoNames = require('./src/getRepoNames');
const userPrompt = require('./src/userPrompt');
const createRepo = require('./src/createRepo');

const initialise = userPrompt().then(directories => {
    const searchPath = directories[0];
    const gitInitPath = directories[1];

    Promise.all([findNpmPackages(searchPath).then(packages => {
            if (!packages.length) {
                console.log(`Cannot find any git projects with top level npm packages in ${directory}`)
            } else {
                console.log(`Found ${packages.length} npm package(s)`)
            }

            return getRepoNames(packages);
        }),
        createRepo(gitInitPath)
    ]).then(values => {
        const config = JSON.stringify(
            Object.assign({
                npmPackages: values[0]
            }, {
                gitDirectory: path.resolve(values[1])
            }),
            null, 4
        );

        fs.writeFile('./npm-rescue-config.json', config, error => {
            if (error) {
                console.log('Error creating npm-rescue-config.json');
                process.exit(1);
            }

            console.log('Created config file in npm-rescue-config.json...');
            console.log(config);
        });
    });
});
