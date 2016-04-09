'use strict';
const prompt = require('prompt');

const homeDirectory = process.env[
    (process.platform == 'win32') ? 'USERPROFILE' : 'HOME'
];
let gitUserName = process.env['USER'];
let gitEmailAddress = 'npm@rescue.fake';

const userPrompt = () => {
    return new Promise((resolve, reject) => {
        prompt.message = '';
        prompt.start();

        prompt.get({
            properties: {
                searchPath: {
                    description: `Enter the root directory of your npm projects (${homeDirectory})`
                },
                gitInitPath: {
                    description: `Enter where the npm-rescue repository should be created (${homeDirectory})`
                },
                gitUserName: {
                    description: `Enter name for npm-rescue git commits (${gitUserName})`
                },
                gitEmailAddress: {
                    description: `Enter email address for npm-rescue git commits (${gitEmailAddress})`
                }            }
        }, (error, result) => {
            if (error) {
                reject(Error(error));
            }

            resolve(result);
        });
    }).then(userInput => {
        const searchPath = userInput.searchPath || homeDirectory;
        const gitInitPath = userInput.gitInitPath || homeDirectory;
        gitUserName = userInput.gitUserName || gitUserName;
        gitEmailAddress = userInput.gitEmailAddress || gitEmailAddress;
        prompt.stop();

        return [searchPath, gitInitPath, gitUserName, gitEmailAddress];
    }, error => {
        console.log(error.message);
        process.exit(1);
    });
};

module.exports = userPrompt;
