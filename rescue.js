/*
 *  1.  Check npm-rescue-config.json exists
 *  2.  Parse JSON, set variables for the git directory and npmPackages
 *  3.  Create nodegit repo object for git directory (promise)
 *  4.  (wait for 3. then) Enumerate npmPackages
    4.1.    git checkout <npmPackage.projectName>
    4.2.    cp package.json to <gitDirectory> from <npmPackage.npmPackage>
 *  4.3.    exec("npm install")
    4.4.    git add .
    4.5.    git commit -m "Npm Rescue Backup at <XYZ> o'clock"
 */
'use strict';
const fs = require('fs-extra');
const git = require('nodegit');
const path = require('path');
const loadConfig = require('./src/loadConfig');


/* Bit of a mess here now. The nodegit API doesn't allow you to do steps as easily as using git CLI.

- make an initial commit in there as well (need the branch.target() to be a commit in its own branch)
- line below is how you stage the entire subdirectory, given an Index object
    //return index.addAll(git.Pathspec.create(['.']), git.Index.ADD_OPTION.ADD_DEFAULT, null);



*/

const repoConfig = loadConfig.then(config => {
    return git.Repository.open(config.gitDirectory).then(repo => {
        return {repo, config};
    }).then(repoConfig => {
        const repo = repoConfig.repo;
        const config = repoConfig.config;
        const signature = repo.defaultSignature();
        const npmRescuePackage = path.resolve(config.gitDirectory, 'package.json');

        let index = undefined;

/*

Aha, there is asynchronous weirdness going on that needs to be fixed.

Wrote /home/iain/dev/flux/package.json to /home/iain/dev/npm-rescue/npm-rescue-backup/package.json.
Wrote /home/iain/dev/flux-todomvc/package.json to /home/iain/dev/npm-rescue/npm-rescue-backup/package.json.
Wrote /home/iain/dev/npm-rescue/package.json to /home/iain/dev/npm-rescue/npm-rescue-backup/package.json.
Wrote /home/iain/dev/todo-redux-react-webpack/package.json to /home/iain/dev/npm-rescue/npm-rescue-backup/package.json.
Wrote /home/iain/dev/react-tutorial/package.json to /home/iain/dev/npm-rescue/npm-rescue-backup/package.json.
New commit for flux.git: 0000000000000000605d39030000000020000000.
Checkpoint
New commit for flux-todomvc.git: 709839030000000040e733030000000000000000.
Checkpoint
New commit for npm-rescue.git: 50ca39030000000020e433030000000000000000.
Checkpoint
New commit for todo-redux-react-webpack.git: 205b390300000000e0f739030000000000000000.
Checkpoint
New commit for react-tutorial.git: a0f539030000000080e833030000000000000000.
Checkpoint

*/

        config.npmPackages.forEach(npmPackage => {
            Promise.all([
                git.Branch.lookup(repo, npmPackage.projectName, git.Branch.BRANCH.LOCAL).then(branch => {
                    repo.checkoutBranch(branch);
                }).then(() => {
                    fs.copySync(npmPackage.npmPackage, npmRescuePackage);
                    console.log(`Wrote ${npmPackage.npmPackage} to ${npmRescuePackage}.`);
                    return repo.index();
                }).then(i => {
                    index = i;
                    return index.addAll(git.Pathspec.create(['.']), git.Index.ADD_OPTION.ADD_DEFAULT);
                }).then(() => {
                    return index.write();
                }).then(() => {
                    return index.writeTree();
                }).then(tree => {
                    return repo.getHeadCommit().then(parent => {
                        return repo.createCommit('HEAD', signature, signature, `npm rescue backup of ${npmPackage.projectName}.`, tree, [parent]);
                    });
                }).then(oid => {
                    console.log(`New commit for ${npmPackage.projectName}: ${oid.toString()}.`);
                }).catch(error => {
                    console.log(error.message);
                })
            ]).then(s => console.log('Checkpoint'));
        });
    }).catch(error => {
        console.log(error.message);
        process.exit(1);
    });
});

/*  4.3
const spawn = require('child_process').spawn;
const npmInstall = spawn('npm', ['install']);

const printLine = line => {
    console.log(`${line}`);
};

npmInstall.stdout.on('data', printLine);
npmInstall.stderr.on('data', printLine);

npmInstall.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
*/
