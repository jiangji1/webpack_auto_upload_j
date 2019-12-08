const fs = require('fs')
const path = require('path')
const cc = require('ssh2-sftp-client')

function readAll (dirPath, currentPath) {
  dirPath = path.resolve(
    currentPath,
    dirPath
  )
  const paths = [dirPath]
  const aaa = []
  let res = []
  while (paths.length) {
    const head = paths.shift()
    aaa.push(head)
    if (!fs.existsSync(head)) continue
    const f = fs.statSync(head)
    if (!f.isDirectory()) res.push(head)
    const d = fs.readdirSync(head)
    d.forEach(v => {
      const p = path.resolve(head, v)
      if (!fs.existsSync(p)) return
      const f = fs.statSync(p)
      if (!f.isDirectory()) res.push(p)
      else paths.push(p)
    })
  }
  const reg = new RegExp(dirPath.replace(/\\/g, '\\\\'), 'g')
  return res.map(v => v.replace(reg, '').replace(/\\/g, '/'))
}

async function uploadAll ({ serviceDir, allFiles, config, entryDir }, currentPath) {
  const successArr = []
  const failArr = []
  const c = new cc(config)
  let a
  await c.connect(config)

  for (const i in allFiles) {
    const v = allFiles[i]
    const localDir = path.resolve(currentPath, entryDir, v.slice(1))
    const remoteDir = serviceDir + v
    try {
      const a = await c.exists(remoteDir.slice(0, remoteDir.lastIndexOf('/')))
      if (!a) {
        await c.mkdir(remoteDir.slice(0, remoteDir.lastIndexOf('/')), true)
      }
      const p = await c.put(
        localDir,
        serviceDir + v
      )
      successArr.push(`${localDir} to: ${remoteDir}`)
    } catch (e) {
      failArr.push({
        failFile: `${localDir} to: ${remoteDir}`,
        reason: e + ''
      })
    }
  }

  c.end()
  successArr.length && console.log(`
\x1B[32m[
上传完毕. uploaded \n
成功列表.successFiles \n
${successArr.map(v => `success:  ${v} \n`)}
]\x1B[39m
  `)
  failArr.length && console.log(`
\x1B[31m[
失败列表.failedFiles \n
${failArr.map(v => `failed:  ${JSON.stringify(v, 0, '  ')} \n`)}
]\x1B[39m
  `)
}

async function delEvery ({ serviceDir, allFiles, config, entryDir }, uploadAfterDel) {
  const c = new cc(config)
  await c.connect(config)
  for (const i in allFiles) {
    const v = allFiles[i]
    const remoteDir = serviceDir + v
    try {
      const a = await c.exists(remoteDir.slice(0, remoteDir.lastIndexOf('/')))
      if (a) {
        await c.delete(remoteDir)
      }
    } catch (e) {
    }
  }
  c.end()
  uploadAfterDel()
}

var delObj

function readAndDelEvery (item, currentPath) {
  const allDelFiles = readAll(item.entryDir, currentPath)

  delObj = {
    entryDir: item.entryDir,
    serviceDir: item.serviceDir,
    allFiles: allDelFiles,
    config: item.serviceConfig,
  }
}

function readAndPut (item, currentPath) {
  const allFiles = readAll(item.entryDir, currentPath)
  var obj = {
    entryDir: item.entryDir,
    serviceDir: item.serviceDir,
    allFiles,
    config: item.serviceConfig,
  }
  delEvery(delObj, () => uploadAll(obj, currentPath))
}

module.exports = {
  readAndDelEvery,
  readAndPut,
}