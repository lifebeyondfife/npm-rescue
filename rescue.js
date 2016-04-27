/*
 *  1.  Check npm-rescue-config.json exists
 *  2.  Parse JSON, set variables for the git directory and npmPackages
    3.  Create nodegit repo object for git directory (promise)
    4.  (wait for 3. then) Enumerate npmPackages
    4.1.    git checkout -b <npmPackage.projectName>
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

- create the branches in the intialise script
- make an initial commit in there as well (need the branch.target() to be a commit in its own branch)
- line below is how you stage the entire subdirectory, given an Index object
    //return index.addAll(git.Pathspec.create(['.']), git.Index.ADD_OPTION.ADD_DEFAULT, null);



*/

const repoConfig = loadConfig.then(config => {
    return git.Repository.open(config.gitDirectory).then(repo => {
        return {repo, headCommitOid: git.Oid.fromString(config.headCommitOid), config};
    }).catch(error => {
        console.log(error.message);
        process.exit(1);
    }).then(repoOidConfig => {
        const repo = repoOidConfig.repo;
        const headCommitOid = repoOidConfig.headCommitOid;
        const config = repoOidConfig.config;

        config.npmPackages.forEach(npmPackage => {
            const packageJson = path.resolve(config.gitDirectory, 'package.json');

            fs.copySync(npmPackage.npmPackage, packageJson);

            const signature = git.Signature.now(config.gitSignature.user, config.gitSignature.email);

            git.Branch.lookup(repo, npmPackage.projectName, git.Branch.BRANCH.LOCAL).then(branch => {
                console.log(`Opened branch ${npmPackage.projectName}...`);
                repo.getCommit(branch.target()).then(commit => {
                    git.Checkout.tree(repo, commit).then(() => {
                        console.log('head set: ' + commit.toString());
                        // add files, stages them, then make a commit here
                    }).catch(e => {
                        console.log(e.message);
                    });
                })
            });

            repo.createBranch(npmPackage.projectName, headCommitOid, false, signature).then(reference => {
                console.log(`Created branch ${npmPackage.projectName}...`);
            }).catch(error => {
                //  Easier to attempt to create the branch and fail than conditionally create it
            });
        });
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
