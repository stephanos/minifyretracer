var Table = require('cli-table');
var _ = require('lodash');

module.exports = function (analysis) {
  if (_.isEmpty(analysis)) {
    return "empty analysis"
  }

  var table = new Table({
    chars: {
      'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
      'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
      'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '',
      'right': '', 'right-mid': '', 'middle': ' '
    },
    head: ['source', 'size', 'min size', 'min share', 'min rate', 'zip size', 'zip share', 'zip rate'],
    colAligns: ["left", "right", "right", "right", "right", "right", "right", "right"]
  });

  var totalSize = 0;
  var totalMinSize = 0;
  var totalZipSize = 0;
  _.each(_.sortBy(analysis, function (obj) {
    return +obj.size;
  }), function (obj) {
    totalSize += obj.size;
    totalMinSize += obj.min_size;
    totalZipSize += obj.zip_size;
    var hideGZip = obj.min_size < 1024;
    table.push([
      obj.source,
      (obj.size / 1024).toFixed(2) + " KB",
      (obj.min_size / 1024).toFixed(2) + " KB",
      (obj.min_share).toFixed(2) + " %",
      (obj.min_rate).toFixed(2) + " %",
      hideGZip ? "" : (obj.zip_size / 1024).toFixed(2) + " KB",
      hideGZip ? "" : (obj.zip_share).toFixed(2) + " %",
      hideGZip ? "" : (obj.zip_rate).toFixed(2) + " %"
    ])
  });
  table.push(["TOTAL",
    (totalSize / 1024).toFixed(2) + " KB",
    (totalMinSize/ 1024).toFixed(2) + " KB",
    "", "",
    (totalZipSize/ 1024).toFixed(2) + " KB"]);

  return table.toString();
};