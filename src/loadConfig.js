'use strict';
const fs = require('fs');

const loadConfig = new Promise((resolve, reject) => {
    fs.readFile('./npm-rescue-config.json', (error, data) => {
        if (error) {
            return reject(Error('Cannot find npm-rescue-config.json. Please run "nodejs initialise.js".'));
        }

        try {
            const parsedJson = JSON.parse(data);

            if (!parsedJson.gitDirectory || !parsedJson.npmPackages) {
                return reject(Error('Cannot find gitDirectory of npmPackages in npm-rescue-config.json. Please run "nodejs initialise.js".'));
            }

            return resolve(parsedJson);
        } catch (error) {
            return reject(error);
        }
    });
});

module.exports = loadConfig;
