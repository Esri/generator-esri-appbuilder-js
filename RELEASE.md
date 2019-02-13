## Instructions for running a release

1. `npm version _____` (note [semver](https://semver.org/) for deciding if major/minor/patch)
2. `git push`
3. `git push --tags`
4. Update the GitHub [release documentation](https://github.com/Esri/generator-esri-appbuilder-js/releases).
5. After the tests run successfully, `npm pubish`
6. Verify that the new version is correctly published to [npm](https://www.npmjs.com/package/generator-esri-appbuilder-js)
