// 半自动管理 Lagrange.OneBot 的启动/停止

import fs from "node:fs"
import { spawn } from "node:child_process"
import common from "../../../../lib/common/common.js"
import {
  binPath,
  LagrangeWorkDir,
  ResourcesDir,
} from "../../tools/constants.js"
import { downloadLagrange, moveExecutable } from "../../tools/download.js"

/** @type {import("node:child_process").ChildProcessWithoutNullStreams} */
let ps

/** 启动 Lagrange （首次可能需要手动登录一下） */
async function startLagrange() {
  if (!fs.existsSync(`${LagrangeWorkDir}/appsettings.json`)) {
    fs.copyFileSync(
      `${ResourcesDir}/appsettings.json`,
      `${LagrangeWorkDir}/appsettings.json`
    )
  }
  if (!fs.existsSync(binPath)) {
    logger.warn("Lagrange 不存在，开始下载")
    await downloadLagrange()
  }
  if (!fs.existsSync(`${LagrangeWorkDir}/keystore.json`)) {
    logger.warn(
      "\n\n\n\n首次登陆需要扫码，请扫描",
      fs.realpathSync(LagrangeWorkDir),
      "下 qr-0.png 进行扫码登陆 bot\n\n\n\n"
    )
  }

  ps = spawn(fs.realpathSync(binPath), {
    cwd: fs.realpathSync(LagrangeWorkDir),
    windowsHide: true,
    stdio: ["ignore", "ignore", "inherit"],
  })
  ps.on("exit", (code, signal) => {
    if (code !== 0) {
      logger.error(
        `Lagrange exited with code ${code} and signal ${signal}. Restart in 3s...`
      )
      setTimeout(startLagrange, 3000) // 3 秒后重启
    }
  })
  logger.info("启动 Lagrange 中......")
}

/** 重启 Lagrange */
export function restartLagrange() {
  // 结束 Lagrange 进程以重启
  if (ps) ps.kill()
}

/** 结束且不再启动 */
export function killLagrange() {
  if (ps) {
    ps.removeAllListeners("exit")
    ps.kill()
    logger.info("lagrange exited")
  }
}

/** 更新 Lagrange */
export async function updateLagrange(e) {
  // 终止进程，替换新的，重新启动
  if (await downloadLagrange(() => {})) {
    await e.reply("下载完成，即将重新登录")
    killLagrange()
    await common.sleep(500)
    moveExecutable()
    await common.sleep(500)
    startLagrange()
  }
}

startLagrange()
process.on("exit", (s) => {
  logger.mark("Yunzai 进程退出")
  killLagrange()
})
