"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var fs = require('fs');

var path = require('path');

var cc = require('ssh2-sftp-client');

function readAll(dirPath, currentPath) {
  dirPath = path.resolve(currentPath, dirPath);
  var paths = [dirPath];
  var res = [];

  var _loop = function _loop() {
    var head = paths.shift();
    if (!fs.existsSync(head)) return "continue";
    var f = fs.statSync(head);
    if (!f.isDirectory()) res.push(head);
    var d = fs.readdirSync(head);
    d.forEach(function (v) {
      var p = path.resolve(head, v);
      if (!fs.existsSync(p)) return;
      var f = fs.statSync(p);
      if (!f.isDirectory()) res.push(p);else paths.push(p);
    });
  };

  while (paths.length) {
    var _ret = _loop();

    if (_ret === "continue") continue;
  }

  var reg = new RegExp(dirPath.replace(/\\/g, '\\\\'), 'g');
  return res.map(function (v) {
    return v.replace(reg, '').replace(/\\/g, '/');
  });
}

function uploadAll(_ref, currentPath) {
  var serviceDir, allFiles, config, entryDir, successArr, failArr, c, a, i, v, localDir, remoteDir, _a, p;

  return _regenerator["default"].async(function uploadAll$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          serviceDir = _ref.serviceDir, allFiles = _ref.allFiles, config = _ref.config, entryDir = _ref.entryDir;
          successArr = [];
          failArr = [];
          c = new cc(config);
          _context.next = 6;
          return _regenerator["default"].awrap(c.connect(config));

        case 6:
          _context.t0 = _regenerator["default"].keys(allFiles);

        case 7:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 30;
            break;
          }

          i = _context.t1.value;
          v = allFiles[i];
          localDir = path.resolve(currentPath, entryDir, v.slice(1));
          remoteDir = serviceDir + v;
          _context.prev = 12;
          _context.next = 15;
          return _regenerator["default"].awrap(c.exists(remoteDir.slice(0, remoteDir.lastIndexOf('/'))));

        case 15:
          _a = _context.sent;

          if (_a) {
            _context.next = 19;
            break;
          }

          _context.next = 19;
          return _regenerator["default"].awrap(c.mkdir(remoteDir.slice(0, remoteDir.lastIndexOf('/')), true));

        case 19:
          _context.next = 21;
          return _regenerator["default"].awrap(c.put(localDir, serviceDir + v));

        case 21:
          p = _context.sent;
          successArr.push("".concat(localDir, " to: ").concat(remoteDir));
          _context.next = 28;
          break;

        case 25:
          _context.prev = 25;
          _context.t2 = _context["catch"](12);
          failArr.push({
            failFile: "".concat(localDir, " to: ").concat(remoteDir),
            reason: _context.t2 + ''
          });

        case 28:
          _context.next = 7;
          break;

        case 30:
          c.end();
          successArr.length && console.log("\n\x1B[32m[\n\u4E0A\u4F20\u5B8C\u6BD5. uploaded \n\n\u6210\u529F\u5217\u8868.successFiles \n\n".concat(successArr.map(function (v) {
            return "success:  ".concat(v, " \n");
          }), "\n]\x1B[39m\n  "));
          failArr.length && console.log("\n\x1B[31m[\n\u5931\u8D25\u5217\u8868.failedFiles \n\n".concat(failArr.map(function (v) {
            return "failed:  ".concat(JSON.stringify(v, 0, '  '), " \n");
          }), "\n]\x1B[39m\n  "));

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[12, 25]]);
}

function readAndPut(item, currentPath) {
  var allFiles = readAll(item.entryDir, currentPath);
  var obj = {
    entryDir: item.entryDir,
    serviceDir: item.serviceDir,
    allFiles: allFiles,
    config: item.serviceConfig
  };
  uploadAll(obj, currentPath);
}

module.exports = readAndPut;