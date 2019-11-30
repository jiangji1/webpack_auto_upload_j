const fs = require('fs')
const path = require('path')
const cc = require('ssh2-sftp-client')


function readAll (dirPath) {
  
  dirPath = path.resolve(
    __dirname.slice(0, __dirname.lastIndexOf('node_modules')),
    dirPath
  )
  const paths = [dirPath]
  let res = []
  while (paths.length) {
    const head = paths.shift()
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

async function uploadAll ({ serviceDir, allFiles, config, entryDir }) {
  const successArr = []
  const failArr = []
  const c = new cc(config)
  let a
  await c.connect(config)
  for (const i in allFiles) {
    const v = allFiles[i]
    const localDir = path.resolve(__dirname.slice(0, __dirname.lastIndexOf('node_modules')), entryDir, v.slice(1))
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

function readAndPut (item) {
  var allFiles = readAll(item.entryDir)
  var obj = {
    entryDir: item.entryDir,
    serviceDir: item.serviceDir,
    allFiles,
    config: item.serviceConfig,
  }
  uploadAll(obj)
}

module.exports = readAndPut