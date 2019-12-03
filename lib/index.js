"use strict";

var tool = require('./tool.js');

var path = require('path');

var fs = require('fs');

var opt;

function Gouzi(options) {
  if (!fs.existsSync(options.path)) {
    return;
  }

  opt = JSON.parse(fs.readFileSync(options.path))[options.key];
}

Gouzi.prototype.apply = function (compiler) {
  compiler.plugin("done", function (params) {
    if (!opt) {
      process.exit();
      return;
    }

    var pajp = path.resolve(compiler.context, 'package.json');

    if (fs.existsSync(pajp)) {
      var config = JSON.parse(fs.readFileSync(pajp));

      if (Object.prototype.hasOwnProperty.call(config, 'up')) {
        if (config.up.kaiguan === 0) {
          return;
        } else if (config.up.kaiguan === 1) {
          opt = opt.build_upload_test;
        } else if (config.up.kaiguan === 2) {
          opt = opt.build_upload_pro;
        } else {
          return;
        }
      }
    }

    opt.serviceConfig = {
      host: opt.host,
      port: opt.port,
      user: opt.user,
      password: opt.password
    };

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
      }), compiler.context;
    } else {
      if (Array.isArray(opt.serviceDir)) {
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
        }), compiler.context;
      } else {
        tool(opt, compiler.context);
      }
    }
  });
};

module.exports = Gouzi;