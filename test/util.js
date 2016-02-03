var path = require('path');
var fs = require('fs');


// ensure directory exists, from
// http://stackoverflow.com/a/34509653/2039
var ensureDirectoryExistence = function(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};
module.exports.ensureDirectoryExistence = ensureDirectoryExistence;
