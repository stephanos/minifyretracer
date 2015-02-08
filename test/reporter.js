var expect = require('chai').expect;
var reporter = require('../lib/reporter');

describe('reporter', function () {

  it('should return formatted table', function () {
    var s = reporter([{
      source: 'lib1.js',
      size: 100.123 * 1024,
      min_size: 50.12345 * 1024,
      min_share: 33.3333,
      min_rate: 33.3333,
      zip_size: 12.1234 * 1024,
      zip_share: 33.3333,
      zip_rate: 20.1234
    }, {
      source: 'lib2.js',
      size: 100.123 * 1024,
      min_size: 50.12345 * 1024,
      min_share: 33.3333,
      min_rate: 33.3333,
      zip_size: 12.1234 * 1024,
      zip_share: 33.3333,
      zip_rate: 20.1234
    }, {
      source: 'lib3.js',
      size: 100.123 * 1024,
      min_size: 50.12345 * 1024,
      min_share: 33.3333,
      min_rate: 33.3333,
      zip_size: 12.1234 * 1024,
      zip_share: 33.3333,
      zip_rate: 20.1234
    }]);

    console.log(s);
    expect(s).to.eql(
      ' source         size    min size   min share   min rate   zip size   zip share   zip rate \n' +
      ' lib1.js   100.12 KB    50.12 KB     33.33 %    33.33 %   12.12 KB     33.33 %    20.12 % \n' +
      ' lib2.js   100.12 KB    50.12 KB     33.33 %    33.33 %   12.12 KB     33.33 %    20.12 % \n' +
      ' lib3.js   100.12 KB    50.12 KB     33.33 %    33.33 %   12.12 KB     33.33 %    20.12 % \n' +
      ' TOTAL     300.37 KB   150.37 KB                          36.37 KB ')
  });
});