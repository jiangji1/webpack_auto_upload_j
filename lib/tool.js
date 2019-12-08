"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var fs = require('fs');

var path = require('path');

var cc = require('ssh2-sftp-client');

function readAll(dirPath, currentPath) {
  dirPath = path.resolve(currentPath, dirPath);
  var paths = [dirPath];
  var aaa = [];
  var res = [];

  var _loop = function _loop() {
    var head = paths.shift();
    aaa.push(head);
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

function delEvery(_ref2, uploadAfterDel) {
  var serviceDir, allFiles, config, entryDir, c, i, v, remoteDir, a;
  return _regenerator["default"].async(function delEvery$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          serviceDir = _ref2.serviceDir, allFiles = _ref2.allFiles, config = _ref2.config, entryDir = _ref2.entryDir;
          c = new cc(config);
          _context2.next = 4;
          return _regenerator["default"].awrap(c.connect(config));

        case 4:
          _context2.t0 = _regenerator["default"].keys(allFiles);

        case 5:
          if ((_context2.t1 = _context2.t0()).done) {
            _context2.next = 22;
            break;
          }

          i = _context2.t1.value;
          v = allFiles[i];
          remoteDir = serviceDir + v;
          _context2.prev = 9;
          _context2.next = 12;
          return _regenerator["default"].awrap(c.exists(remoteDir.slice(0, remoteDir.lastIndexOf('/'))));

        case 12:
          a = _context2.sent;

          if (!a) {
            _context2.next = 16;
            break;
          }

          _context2.next = 16;
          return _regenerator["default"].awrap(c["delete"](remoteDir));

        case 16:
          _context2.next = 20;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t2 = _context2["catch"](9);

        case 20:
          _context2.next = 5;
          break;

        case 22:
          c.end();
          uploadAfterDel();

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[9, 18]]);
}

var delObj;

function readAndDelEvery(item, currentPath) {
  var allDelFiles = readAll(item.entryDir, currentPath);
  delObj = {
    entryDir: item.entryDir,
    serviceDir: item.serviceDir,
    allFiles: allDelFiles,
    config: item.serviceConfig
  };
}

function readAndPut(item, currentPath) {
  var allFiles = readAll(item.entryDir, currentPath);
  var obj = {
    entryDir: item.entryDir,
    serviceDir: item.serviceDir,
    allFiles: allFiles,
    config: item.serviceConfig
  };
  delEvery(delObj, function () {
    return uploadAll(obj, currentPath);
  });
}

module.exports = {
  readAndDelEvery: readAndDelEvery,
  readAndPut: readAndPut
};