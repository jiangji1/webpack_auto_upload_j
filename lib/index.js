"use strict";

var tool = require('./tool.js');

var path = require('path');

var fs = require('fs');

var opt;

function Gouzi(options) {
  try {
    for (var key in options) {
      if (key === 'serviceConfig') continue;

      if (options.hasOwnProperty(key)) {
        var v = options[key];
        if (!/(String)|(Array)/.exec(Object.prototype.toString.call(v))) return;
      }
    }

    opt = options;
  } catch (e) {
    console.error(e);
  }
}

Gouzi.prototype.apply = function (compiler) {
  compiler.plugin("done", function (params) {
    if (!opt) return;
    var pajp = path.resolve(compiler.context, 'package.json');

    if (fs.existsSync(pajp)) {
      var config = JSON.parse(fs.readFileSync(pajp));

      if (Object.prototype.hasOwnProperty.call(config, 'up') && !config.up.kaiguan) {
        return;
      }
    }

    if (Array.isArray(opt.entryDir)) {
      var arr = [];
      opt.entryDir.forEach(function (v, i) {
        return arr.push({
          entryDir: v,
          serviceDir: opt.serviceDir[i],
          serviceConfig: opt.serviceConfig
        });
      });
      arr.forEach(function (v) {
        return tool(v);
      });
    } else {
      if (Array.isArray(opt.serviceDir)) {
        fs.writeFileSync('abc.txt', '123');
        var arr = [];
        opt.serviceDir.forEach(function (v, i) {
          return arr.push({
            entryDir: opt.entryDir,
            serviceDir: v,
            serviceConfig: opt.serviceConfig
          });
        });
        arr.forEach(function (v) {
          return tool(v);
        });
      } else {
        tool(opt);
      }
    }
  });
};

module.exports = Gouzi;