// 半自动管理 Lagrange.OneBot 的启动/停止

import fs from "node:fs"
import { spawn } from "node:child_process"
import { binPath, LagrangeWorkDir } from "./constants.js"

/** 启动 Lagrange （首次可能需要手动登录一下） */
function startLagrange() {
  // TODO: 启动守护进程
}

/** 重启 Lagrange */
function restartLagrange() {
    // todo: 终结 Lagrange 进程
}

/** 更新 Lagrange */
function updateLagrange() {
    // todo: 终结守护进程，下载新的，重新启动
}
