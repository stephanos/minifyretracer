#!/usr/bin/env node

var sm = require('source-map');
var fs = require('fs');
var path = require('path');
var Table = require('cli-table');
var _ = require('lodash');
var cli = require('cli');

function loadSourceMap(path, fn) {
  fs.readFile(path, function (err, data) {
    if (err) {
      cli.fatal("error: no source map found at '" + path + "'");
    }
    fn(data.toString());
  });
}

function printSummary(summary) {
  if (_.isEmpty(summary)) {
    cli.info("empty analysis");
    return
  }

  var table = new Table({
    chars: {
      'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
      'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
      'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '',
      'right': '', 'right-mid': '', 'middle': ' '
    },
    style: {'padding-left': 0, 'padding-right': 0},
    head: ['source', 'abs.', 'rel.'],
    colAligns: ["left", "right", "right"],
    colWidths: [50, 12, 12]
  });

  var totalSize = 0;
  _.each(_.sortBy(summary, function (obj) {
    return +obj.size;
  }), function (obj) {
    totalSize += obj.size;
    table.push([obj.source, (obj.size).toFixed(2) + " KB", (obj.share).toFixed(2) + " %"])
  });
  table.push(["TOTAL", (totalSize).toFixed(2) + " KB", ""]);

  console.log(table.toString())
}

function calculateSummary(analysis, group) {
  var summary = _.map(analysis.details, function (val, key) {
    return {
      source: key,
      size: val / 1024,
      share: 100 * (val / analysis.total)
    }
  });

  if (group) {
    summary = _.transform(summary, function (result, item) {
      var found = false;
      var sourceGroup = (_.initial(item.source.split(path.sep))).join(path.sep);

      _.map(result, function (entry) {
        if (entry.source == sourceGroup) {
          entry.share += item.share;
          entry.size += item.size;
          found = true;
        }
      });

      if (!found) {
        result.push({source: sourceGroup, size: item.size, share: item.share});
      }

      return result;
    });
  }

  return summary;
}

function analyseSourceMap(fpath, fn) {
  loadSourceMap(fpath, function (mapData) {
    var smc = new sm.SourceMapConsumer(mapData);

    var chars = 0;
    var total = 0;
    var contrib = {};
    var lastPos = [0, 0];
    var lastSource = null;
    smc.eachMapping(function (mapping) {
      var content = mapping.name;
      var source = mapping.source;
      if (mapping.generatedLine != lastPos[0]) {
        if (content != undefined) {
          chars += content.length;
        }
      } else {
        chars += mapping.generatedColumn - lastPos[1];
      }
      lastPos = [mapping.generatedLine, mapping.generatedColumn];

      if (lastSource != null && lastSource != source) {
        if (!contrib[lastSource]) {
          contrib[lastSource] = 0;
        }
        contrib[lastSource] += chars;
        total += chars;
        chars = 0;
      }
      lastSource = source;
    }, this, sm.SourceMapConsumer.GENERATED_ORDER);
    contrib[lastSource] += chars;
    fn({total: total, details: contrib})
  });
}

cli.parse({
  group: ['g', 'Group sources']
});

cli.main(function (args, options) {
  var input = args[0];
  if (!input) {
    cli.fatal("error: no path to source map provided");
  }

  analyseSourceMap(args[0], function (analysis) {
    printSummary(calculateSummary(analysis, options.group));
  });
});