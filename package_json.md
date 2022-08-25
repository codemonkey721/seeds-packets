## NOTES

### 8/2022
- Upgraded Lerna to v5.4.3 to fix bugs
- Added `engine` field to `package.json` for every package to restrict use to node 14.15.0 or >=16.x
- Added `yarn clean` command to root and each package to clean up node_modules and dist folder

### 7/2022
- Added a resolution for "globby" to avoid sub-v10 versions that depend on a vulnerable version of "glob-parent"
- Added a resolution for "parse-url" to avoid sub-v7 versions that depend on a vulnerable version of "parse-path"
- Added a resolution for "@lerna/conventional-commits" to remove vulnerable (sub-v3) versions of "trim-newlines"
