var sm = require('source-map');
var zlib = require('zlib');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

function group(statsPerSource) {
  return _.transform(statsPerSource, function (result, stats, key) {
    var sourceGroup = (_.initial(key.split(path.sep))).join(path.sep);
    if (_.isEmpty(sourceGroup)) {
      result[key] = stats;
    } else {
      var existingGroupStats = result[sourceGroup];
      if (existingGroupStats) {
        existingGroupStats.files += 1;
        existingGroupStats.size += stats.size;
        existingGroupStats.min_size += stats.min_size;
        existingGroupStats.min_share += stats.min_share;
        existingGroupStats.min_rate += stats.min_rate;
        existingGroupStats.zip_size += stats.zip_size;
        existingGroupStats.zip_share += stats.zip_share;
        existingGroupStats.zip_rate += stats.zip_rate;
      } else {
        result[sourceGroup] = stats;
      }
    }

    return result;
  });
}

module.exports = function (dataSet, opts, callback) {
  var statsPerSource = {};
  for (var name in dataSet.sources) {
    var source = dataSet.sources[name];
    statsPerSource[name] = {
      files: 1,
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
    if (stats.min_size == 0) {
      delete statsPerSource[source];
      continue;
    }

    var sourceOrigSize = dataSet.sources[source].size;
    var sourceContribGzipSize = zlib.gzipSync(stats.content).length;

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

  if (opts.group) {
    statsPerSource = group(statsPerSource);
  }

  var analysis = _.map(statsPerSource, function (val, key) {
    return _.merge(val, {
      min_rate: val.min_rate / val.files,
      zip_rate: val.zip_rate / val.files,
      source: key
    })
  });
  callback(analysis);
};