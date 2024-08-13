import os from "node:os"
import fs from "node:fs"
import { Buffer } from "node:buffer"
import compressing from "compressing"
import {
  LagrangeDir,
  binPath,
  LagrangeReleaseDir,
} from "./constants.js"

/** 获取 Lagrange 下载链接 */
function getReleaseUrl() {
  let platform, arch, ziptype
  switch (os.platform()) {
    case "win32":
    case "cygwin":
      platform = "win"
      ziptype = "zip"
      break
    case "darwin":
      platform = "osx"
      break
    default:
      platform = "linux"
  }
  switch (os.arch()) {
    case "x64":
    case "arm":
    case "arm64":
      arch = os.arch()
      break
    default:
      arch = "x64"
  }
  ziptype = ziptype || "tar.gz"
  let originUrl =
    "https://github.com/LagrangeDev/Lagrange.Core/releases/download/nightly/" +
    `Lagrange.OneBot_${platform}-${arch}_net8.0_SelfContained.${ziptype}`
  return `https://mirror.ghproxy.com/${originUrl}`
}

/**
 * 查找可执行文件路径并返回
 * @param {string} path 解压后的 Lagrange 路径，通常为 xx/Lagrange.Onebot
 */
function findExecutable(path) {
  if (fs.statSync(path).isFile()) {
    return path
  }
  for (let p of fs.readdirSync(path)) {
    let newp = `${path}/${p}`
    return findExecutable(newp)
  }
}


/** 下载最新 release 可执行文件并移动至 Lagrange 工作目录 */
export async function downloadLagrange() {
  let url = getReleaseUrl(),
    isZip = url.endsWith(".zip")
  let resp = await fetch(url)

  let buffer = Buffer.from(await resp.arrayBuffer())
  let tmppath = `${LagrangeDir}/temp`
  fs.writeFileSync(tmppath, buffer)

  if (isZip) {
    await compressing.zip.decompress(tmppath, LagrangeReleaseDir)
  } else {
    await compressing.tar.decompress(tmppath, LagrangeReleaseDir)
  }

  fs.unlink(tmppath, (e) => {
    !e || console.log(e)
  })
  fs.renameSync(
    findExecutable(`${LagrangeReleaseDir}/Lagrange.Onebot`),
    binPath
  )
  fs.chmod(binPath, 0o775, (err) => {
    console.log(
      `chmod 失败, 可能无法成功启动, 请手动赋予 ${binPath} 执行权限`,
      err
    )
  })
}
