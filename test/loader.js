var expect = require('chai').expect;
var loader = require('../lib/loader');

describe('loader', function () {

  it('should load simple minified data set', function (end) {
    loader("test/fixtures/simple/libs.min.js", function (dataSet) {
      expect(dataSet).to.have.keys('minified', 'sources', 'mapping');
      expect(dataSet.minified.lines).to.eql([
        'function A(){return"Hello World"}function C(param){console.log("Hello "+param)}var B="Hello World";',
        '//# sourceMappingURL=libs.js.map']);

      expect(dataSet.sources).to.have.keys('lib1.js', 'lib2.js', 'lib3.js');
      expect(dataSet.sources['lib1.js']).to.eql(
        {lines: ['function A() {', '  return "Hello World";', '}'], "size": 40});
      expect(dataSet.sources['lib2.js']).to.eql(
        {lines: ['var B = "Hello World";'], "size": 22});
      expect(dataSet.sources['lib3.js']).to.eql({
        lines: ['function C(param) {',
          '  console.log("Hello " + param);',
          '}'], "size": 54
      });

      end()
    })
  });

  it('should load advanced minified data set', function (end) {
    loader("test/fixtures/advanced/libs.min.js", function (dataSet) {
      expect(dataSet.sources).to.have.keys('async.js', 'backbone.js', 'bean.js', 'list.js');
      end()
    })
  });
});