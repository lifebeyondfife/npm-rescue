/*
    1.  Check npm-rescue-config.json exists
    2.  Parse JSON, set variables for the git directory and npmPackages
    3.  Create nodegit repo object for git directory (promise)
    4.  (wait for 3. then) Enumerate npmPackages
    4.1.    git checkout -b <npmPackage.projectName>
    4.2.    cp package.json to <gitDirectory> from <npmPackage.npmPackage>
    4.3.    exec("npm install")
    4.4.    git add .
    4.5.    git commit -m "Npm Rescue Backup at <XYZ> o'clock"
*/
