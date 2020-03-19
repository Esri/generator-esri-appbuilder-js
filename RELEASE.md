## Instructions for running a release

1. `npm version _____` (note [semver](https://semver.org/) for deciding if major/minor/patch)
2. `git push` (or `git push upstream master`)
3. `git push --tags` (or `git push upstream master --tags`)
4. Update the GitHub [release documentation](https://github.com/Esri/generator-esri-appbuilder-js/releases).
5. After the tests run successfully, publish to npm:
   1. `npm logout`
   1. `npm login`
   1. `npm pubish`
6. Verify that the new version is correctly published to [npm](https://www.npmjs.com/package/generator-esri-appbuilder-js)
