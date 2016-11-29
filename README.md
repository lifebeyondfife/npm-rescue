# DEPRECATED
I'm happy to report that this project is no longer needed, you can solve the problem of disappearing nodejs modules by swapping npm for [yarn](https://github.com/yarnpkg/yarn).

# npm-rescue
Backup `node_modules` for all your npm based projects.

```
$ npm install npm-rescue -g
$ npm-rescue
```

Follow the instructions for finding your npm projects and creating a local git repo to backup your `node_modules` directories. Each project is backed up to a different branch.

Backup your modules any time by re-running

```
$ npm-rescue
```

Forgotten where your local git repo is?

```
$ less ~/.npm-rescue/npm-rescue-config.json
```

