---
"@sproutsocial/seeds-icons": minor
---

Moved to tsc for copying and transpiling files
- Before this release, files were manually copied into the `dist` directory and the only typescript types were manually written files.
- We are now using `tsc` for transpiling, deriving type declaration files, and copying files to `dist`
- As a result, there are significantly more type declaration files available than before this release.