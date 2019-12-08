var tool = require('./tool.js')
var path = require('path')
var fs = require('fs')

var readAndDelEvery = tool.readAndDelEvery
var readAndPut = tool.readAndPut

var opt
function Gouzi(options) {
  if (!fs.existsSync(options.path)) {
    return
  }
  opt = JSON.parse(fs.readFileSync(options.path))[options.key]
}

Gouzi.prototype.apply = function(compiler) {
  compiler.plugin("beforeRun", function() {
    handle({ compiler, type: 'beforeRun' })
  })

  compiler.plugin("done", function(params) {
    handle({ compiler, type: 'done' })
  });
};

function handle ({ compiler, type }) {
  let opt2 = JSON.parse(JSON.stringify(opt))
  if (!opt2) {
    process.exit()
    return
  }
  const pajp = path.resolve(compiler.context, 'package.json')
  if (fs.existsSync(pajp)) {
    const config = JSON.parse(fs.readFileSync(pajp))
    if (Object.prototype.hasOwnProperty.call(config, 'up')) {
      if (config.up.kaiguan === 0) {
        return
      } else if (config.up.kaiguan === 1) {
        opt2 = opt2.build_upload_test
      } else if (config.up.kaiguan === 2) {
        opt2 = opt2.build_upload_pro
      } else {
        return
      }
    }
  }
  opt2.serviceConfig = {
    host: opt2.host,
    port: opt2.port,
    user: opt2.user,
    password: opt2.password,
  }
  if (Array.isArray(opt2.entryDir)) {
    var arr = []
    opt2.entryDir.forEach((v, i) => arr.push({
      entryDir: v,
      serviceDir: opt2.serviceDir[i],
      serviceConfig: opt2.serviceConfig
    }))
    arr.forEach(v => (
      type === 'done'
        ? readAndPut(v, compiler.context)
        : readAndDelEvery(v, compiler.context)
    ))
  } else {
    if (Array.isArray(opt2.serviceDir)) {
      var arr = []
      opt2.serviceDir.forEach((v, i) => arr.push({
        entryDir: opt2.entryDir,
        serviceDir: v,
        serviceConfig: opt2.serviceConfig
      }))
      arr.forEach(v => (
        type === 'done'
          ? readAndPut(v, compiler.context)
          : readAndDelEvery(v, compiler.context)
      ))
    } else {
      type === 'done'
        ? readAndPut(opt2, compiler.context)
        : readAndDelEvery(opt2, compiler.context)
    }
  }
}

module.exports = Gouzi