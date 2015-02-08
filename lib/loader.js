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
    var data = loadFile(path.join(fileDir, source));
    result.sources[source] = {
      lines: data.split("\n"),
      size: data.length
    };
  }

  //var contentBySource = {};
  //for (var i in smc.sources) {
  //  var source = smc.sources[i];
  //  var textByLine = fs.readFileSync(path.join(fdir, source)).toString().split("\n");
  //
  //  var dict = {};
  //  var content = "";
  //  var lastPos = [0, 0];
  //  smc.eachMapping(function (mapping) {
  //    if (source == mapping.source) {
  //      if (content == undefined) {
  //        var line = mapping.originalLine;
  //        var col = mapping.originalColumn;
  //        dict[line + ":" + col] = textByLine[lastPos[0]].slice(lastPos[1], col - 1);
  //        lastPos = [line, col];
  //      } else {
  //        ;
  //        console.log(content)
  //      }
  //      content = mapping.name;
  //    }
  //  });
  //
  //  contentBySource[source] = dict
  //}
  //console.log(contentBySource);

  callback(result);
};