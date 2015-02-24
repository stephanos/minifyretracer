# minifyretracer [![Build Status](https://travis-ci.org/stephanos/minifyretracer.svg)](https://travis-ci.org/stephanos/minifyretracer)

Use source maps to trace back the sources that contribute to your minified JavaScript artifact.

## install

```bash
$ npm install minifyretracer
```

## usage

```bash
$ minifyretracer app.js.min

 source             size   min size   min share   min rate   zip size   zip share   zip rate
 async.js       27.87 KB   16.54 KB     21.03 %    40.67 %    3.97 KB     18.14 %    75.96 %
 bean.js        29.31 KB   14.45 KB     18.38 %    50.71 %    4.68 KB     21.37 %    67.58 %
 list.js        41.65 KB   22.24 KB     28.29 %    46.59 %    5.94 KB     27.10 %    73.30 %
 backbone.js    59.53 KB   25.35 KB     32.24 %    57.42 %    7.32 KB     33.40 %    71.12 %
 TOTAL         158.35 KB   78.57 KB                          21.92 KB
```

## license

MIT License