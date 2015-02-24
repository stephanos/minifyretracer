var expect = require('chai').expect;
var loader = require('../lib/loader');
var analyzer = require('../lib/analyzer');

describe('analyzer', function () {

  it('should analyse simple data set', function (end) {
    loader('test/fixtures/simple/libs.min.js', function (dataSet) {
      analyzer(dataSet, {}, function (analysis) {
        expect(analysis).to.eql([
          {
            "files": 1,
            "min_rate": 17.5,
            "min_share": 25,
            "min_size": 33,
            "size": 40,
            "source": "lib1.js",
            "zip_rate": -60.606060606060595,
            "zip_share": 34.193548387096776,
            "zip_size": 53
          },
          {
            "files": 1,
            "min_rate": 14.81481481481481,
            "min_share": 34.84848484848485,
            "min_size": 46,
            "size": 54,
            "source": "lib3.js",
            "zip_rate": -34.782608695652186,
            "zip_share": 40,
            "zip_size": 62
          },
          {
            "files": 1,
            "min_rate": 9.090909090909093,
            "min_share": 15.151515151515152,
            "min_size": 20,
            "size": 22,
            "source": "lib2.js",
            "zip_rate": -100,
            "zip_share": 25.806451612903224,
            "zip_size": 40
          }
        ]);

        end()
      })
    });
  });
});