'use strict';
var fs = require('fs');

var authorToString = function(inStringOrObject) {
  if (inStringOrObject) {
    if (typeof inStringOrObject === 'object') {
      if(inStringOrObject.hasOwnProperty('name')) {
        var nameString = inStringOrObject.name;
        if (inStringOrObject.hasOwnProperty('email')) {
          nameString += ' <' + inStringOrObject.email + '>';
        }
        if (inStringOrObject.hasOwnProperty('url')) {
          nameString += ' (' + inStringOrObject.url + ')';
        }
        return nameString;
      } else {
        return '';
      }
    } else {
      return inStringOrObject;
    }
  } else {
    return '';
  }
};
module.exports.authorToString = authorToString;


var getPackageInfo = function(packageProperty) {
  try {
    var packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if(packageJson.hasOwnProperty(packageProperty)) {
      return packageJson[packageProperty];
    } else {
      // does not have the property we are looking for
      return false;
    }
  } catch (e) {
    // no package.json
    return false;
  }
};
module.exports.getPackageInfo = getPackageInfo;
