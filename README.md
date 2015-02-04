# minifyretracer

Trace back the sources that contribute to your minified Javascript artifact. With source maps.

## install

```bash
npm install minifyretracer
```

## usage

```bash
minifyretracer app.js.map

lib1.js     0.03 KB
lib3.js     0.04 KB
lib2.js     0.01 KB
TOTAL       0.08 KB
```