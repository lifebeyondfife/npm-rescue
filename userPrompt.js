'use strict';
const prompt = require('prompt');

let homeDirectory = process.env[
    (process.platform == 'win32') ? 'USERPROFILE' : 'HOME'
];

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
                }
            }
        }, (error, result) => {
            if (error) {
                reject(Error(error));
            }

            resolve(result);
        });
    }).then(userInput => {
        const searchPath = userInput.searchPath || homeDirectory;
        const gitInitPath = userInput.gitInitPath || homeDirectory;
        prompt.stop();

        return [searchPath, gitInitPath];
    }, error => {
        console.log(error.message);
        process.exit(1);
    });
};

module.exports = userPrompt;
