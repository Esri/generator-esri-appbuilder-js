## Instructions for running a release

1. `npm version _____` (note [semver](https://semver.org/) for deciding if major/minor/patch)
2. `git push --tags`
3. Update the GitHub [release documentation ](https://github.com/Esri/generator-esri-appbuilder-js/releases).
4. After the tests run successfully, `npm pubish`
5. Verify that the new version is correctly published to [npm](https://www.npmjs.com/package/generator-esri-appbuilder-js)