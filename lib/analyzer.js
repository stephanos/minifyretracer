var compress = require('compress-buffer').compress;
var sm = require('source-map');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports = function (dataSet, callback) {
  var statsPerSource = {};
  for (var name in dataSet.sources) {
    var source = dataSet.sources[name];
    statsPerSource[name] = {
      size: source.size,
      content: "",
      min_size: 0
    };
  }

  for (var l in dataSet.minified.lines) {
    var line = dataSet.minified.lines[l];
    for (var c in line) {
      var char = line[c];
      var pos = {line: Number(l) + 1, column: Number(c)};
      var origin = dataSet.mapping.originalPositionFor(pos);
      var originSrc = origin.source;
      if (originSrc) {
        statsPerSource[originSrc].content += char;
        statsPerSource[originSrc].min_size += 1;
      }
    }
  }

  var outputSize = dataSet.minified.size;
  for (var source in statsPerSource) {
    var stats = statsPerSource[source];
    var sourceOrigSize = dataSet.sources[source].size;
    var sourceContribGzipSize = compress(new Buffer(stats.content)).length;

    stats = _.merge(stats, {
      min_share: (100 * stats.min_size) / outputSize,
      min_rate: 100 - (100 * stats.min_size) / sourceOrigSize,
      zip_size: sourceContribGzipSize,
      zip_rate: 100 - (100 * sourceContribGzipSize) / stats.min_size
    });
    delete stats.content;
  }

  var totalGzipSize = _.reduce(statsPerSource, function (sum, obj, key) {
    return {zip_size: sum.zip_size + obj.zip_size};
  }).zip_size;
  for (var source in statsPerSource) {
    var stats = statsPerSource[source];
    stats.zip_share = (100 * stats.zip_size) / totalGzipSize;
  }

  var result = _.map(statsPerSource, function (val, key) {
    return _.merge(val, {source: key})
  });

  //if (group) {
//  summary = _.transform(summary, function (result, item) {
//    var found = false;
//    var sourceGroup = (_.initial(item.source.split(path.sep))).join(path.sep);
//
//    _.map(result, function (entry) {
//      if (entry.source == sourceGroup) {
//        entry.share += item.share;
//        entry.size += item.size;
//        found = true;
//      }
//    });
//
//    if (!found) {
//      result.push({source: sourceGroup, size: item.size, share: item.share});
//    }
//
//    return result;
//  });

  callback(result);
};