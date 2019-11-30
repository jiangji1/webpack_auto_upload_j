var tool = require('./tool.js')
var fs = require('fs')
var opt
function Gouzi(options) {
  try {
    for (var key in options) {
      if (key === 'serviceConfig') continue
      if (options.hasOwnProperty(key)) {
        var v = options[key];
        if (!/(String)|(Array)/.exec(Object.prototype.toString.call(v))) return
      }
    }
    opt = options
  } catch (e) {
    console.error(e)
  }
}

Gouzi.prototype.apply = function(compiler) {
  compiler.plugin("done", function(params) {
    if (!opt) return
    if (Array.isArray(opt.entryDir)) {
      var arr = []
      opt.entryDir.forEach((v, i) => arr.push({
        entryDir: v,
        serviceDir: opt.serviceDir[i],
        serviceConfig: opt.serviceConfig
      }))
      arr.forEach(v => tool(v))
    } else {
      if (Array.isArray(opt.serviceDir)) {
        fs.writeFileSync('abc.txt', '123')
        var arr = []
        opt.serviceDir.forEach((v, i) => arr.push({
          entryDir: opt.entryDir,
          serviceDir: v,
          serviceConfig: opt.serviceConfig
        }))
        arr.forEach(v => tool(v))
      } else {
        tool(opt)
      }
    }
  });
};



module.exports = Gouzi