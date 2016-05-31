# npm-rescue
Backup node_modules for all your npm based projects.

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

