"use strict";

var tsc = require('typescript');
var crypto = require('crypto');

function process(src, path, config, transformOptions) {
  return src;
}
exports.process = process;

function getCacheKey(fileData, filePath, configStr, options) {
  return crypto.createHash('md5')
    .update(fileData + filePath + configStr, 'utf8')
    .digest('hex');
}
exports.getCacheKey = getCacheKey;
