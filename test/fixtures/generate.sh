#!/bin/sh

cd simple
uglifyjs -c --source-map libs.js.map lib1.js lib2.js lib3.js > libs.min.js

cd ../advanced
uglifyjs -c --source-map libs.js.map async.js backbone.js bean.js list.js > libs.min.js