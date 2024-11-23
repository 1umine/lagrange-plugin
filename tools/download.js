import os from "node:os"
import fs from "node:fs"
import { Buffer } from "node:buffer"
import compressing from "compressing"
import { LagrangeDir, binPath, LagrangeReleaseDir, LagrangeWorkDir } from "./constants.js"

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

/** 移动下载好的 Lagrange 到运行目录下 */
export function moveExecutable() {
  fs.renameSync(
    findExecutable(`${LagrangeReleaseDir}/Lagrange.Onebot`),
    binPath
  )
  fs.rmSync(`${LagrangeReleaseDir}/Lagrange.Onebot`, { recursive: true })
  fs.chmod(binPath, 0o775, (err) => {
    logger.warn(`chmod 失败, 可能无法成功启动, 请手动赋予 ${binPath} 执行权限(若能启动则忽略此消息)`)
  })
}

/**
 * 下载最新 release 可执行文件并移动至 Lagrange 工作目录
 * @param callback 下载完成后的回调
 * */
export async function downloadLagrange(callback = moveExecutable) {
  logger.mark("下载 Lagrange.Onebot 中......")
  let url = getReleaseUrl(),
    isZip = url.endsWith(".zip")
  let resp = await fetch(url)
  if (!resp.ok) {
    logger.error(`下载 ${url} 失败，请尝试手动下载`)
    return false
  }
  let buffer = Buffer.from(await resp.arrayBuffer())
  let tmppath = `${LagrangeDir}/temp`
  fs.writeFileSync(tmppath, buffer)

  try {
    if (isZip) {
      await compressing.zip.decompress(tmppath, LagrangeReleaseDir)
    } else {
      await compressing.tgz.decompress(tmppath, LagrangeReleaseDir)
    }
  } catch (e) {
    logger.error(`解压 ${url} 失败，可能下载文件损坏，请尝试手动下载并将可执行文件放到 
      ${LagrangeWorkDir} 目录下并重命名为 ${binPath}, 并赋予执行权限(对于linux系统)`)
    return false
  }

  fs.unlink(tmppath, (e) => {
    !e || console.log(e)
  })
  callback()
  logger.info("lagrange.onebot 下载完成")
  return true
}
