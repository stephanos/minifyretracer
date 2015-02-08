#!/usr/bin/env node

var analyzer = require('./analyzer');
var reporter = require('./reporter');
var loader = require('./loader');
var cli = require('cli');

cli.parse({
  group: ['g', 'Group sources']
});

cli.main(function (args, options) {
  var input = args[0];
  if (!input) {
    cli.fatal("error: no path to source map provided");
  }

  loader(args[0], function(dataSet) {
    analyzer(dataSet, options, function (analysis) {
      console.log(reporter(analysis));
    });
  })
});