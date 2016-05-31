#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const initialise = require('./src/initialise');
const rescue = require('./src/rescue');

const npmRescueDirectory = () => {
    return path.join(
        process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
        '.npm-rescue'
    );
};

const mkdirSync = path => {
    try {
        fs.mkdirSync(path);
    } catch(error) {
        if (error.code != 'EEXIST') {
            console.log(error.message);
            process.exit(1);
        }
    }
};

mkdirSync(npmRescueDirectory());
const npmRescueConfig = path.join(npmRescueDirectory(), 'npm-rescue-config.json');

new Promise((resolve, reject) => {
    try {
        fs.accessSync(npmRescueConfig, fs.F_OK);
        resolve();
    } catch (error) {
        resolve(initialise(npmRescueConfig));
    }
}).then(() => {
    rescue(npmRescueConfig);
});
