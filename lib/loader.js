var smu = require("source-map-url")
var sm = require('source-map');
var path = require('path');
var fs = require('fs');

function loadFile(filePath) {
  var data;
  try {
    data = fs.readFileSync(filePath);
  } catch (e) {
    throw new Error("unable to load file '" + filePath + "'");
  }
  return data.toString();
}

function loadSourceFile(filePath) {
  var ext = path.extname(filePath);
  if (ext != "js") {
    var assumedCompiledPath = filePath.slice(0, filePath.length - ext.length) + ".js";
    if (fs.existsSync(assumedCompiledPath)) {
      filePath = assumedCompiledPath;
    }
  }
  return loadFile(filePath);
}

module.exports = function (filePath, callback) {
  var minifiedData = loadFile(filePath);
  var sourceMapFilePath = smu.getFrom(minifiedData);
  var fileDir = path.dirname(filePath);
  var sourceMapData = loadFile(path.join(fileDir, sourceMapFilePath));

  var mapping = new sm.SourceMapConsumer(sourceMapData);
  var result = {
    minified: {
      lines: minifiedData.split("\n"),
      size: minifiedData.length
    },
    sources: {},
    mapping: mapping
  };

  for (var i in mapping.sources) {
    var source = mapping.sources[i];
    var data = loadSourceFile(path.join(fileDir, source));
    result.sources[source] = {
      lines: data.split("\n"),
      size: data.length
    };
  }

  callback(result);
};