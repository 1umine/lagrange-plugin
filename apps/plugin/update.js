import { exec } from "node:child_process"
import { PluginDir } from "../../tools/constants.js"

/** 更新插件本身 */
export function updateManager(e) {
  let cmd = "git checkout . && git pull"
  exec(cmd, { cwd: PluginDir, windowsHide: true }, (err, stdout, stderr) => {
    if (err) {
      e.reply("更新失败：" + err.message)
      return
    }
    if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
      e.reply("插件已是最新的了")
      return
    }
    e.reply("已更新，重启中")
    setTimeout(() => {
      process.exit()
    }, 1000)
  })
}
