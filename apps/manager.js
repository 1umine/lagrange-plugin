import plugin from "../../../lib/plugins/plugin.js"
import common from "../../../lib/common/common.js"
import {
  restartLagrange,
  updateLagrange,
  killLagrange,
  changeLagrangeSign,
} from "./lagrange/lagrange.js"
import { updateManager } from "./plugin/update.js"

export default class LagrangeManager extends plugin {
  constructor() {
    super({
      name: "Lagrange机器人登录管理",
      dsc: "半？自动管理 Lagrange(onebot) 的启动与停止, 方便登录/重登机器人",
      priority: 99999,
      event: "message",
      rule: [
        {
          reg: "^#lagrange重启$",
          fnc: "restart",
          permission: "master",
        },
        {
          reg: "^#lagrange更新$",
          fnc: "update",
          permission: "master",
        },
        {
          reg: "^#lagrange停止$",
          fnc: "stop",
          permission: "master",
        },
        {
          reg: "^#lagrange状态$",
          fnc: "status",
          permission: "master",
        },
        {
          reg: "^#lagrange切换签名.+$",
          fnc: "changeSign",
          permission: "master",
        },
        {
          reg: "^#lagrange插件更新$",
          fnc: "updatePlugin",
          permission: "master",
        },
        {
          reg: "^#lagrange帮助$",
          fnc: "help",
          permission: "master",
        },
      ],
    })
  }

  /** 启动Lagrange */
  async restart(e) {
    await e.reply("稍等，正在重新登录")
    await common.sleep(1000)
    restartLagrange()
  }

  /** 更新Lagrange（重新下载） */
  async update(e) {
    await e.reply("稍等，正在更新")
    await common.sleep(1000)
    updateLagrange(e)
  }

  async stop(e) {
    await e.reply("已停止，若无其他方式启动则只能手动重新启动")
    await common.sleep(1000)
    killLagrange()
  }

  async updatePlugin(e) {
    await e.reply("正在更新 Lagrange 插件")
    updateManager(e)
  }

  async status(e) {
    e.reply(`bot online: ${e.bot?.stat?.online}\nbot good: ${e.bot?.stat?.good}`)
  }

  async changeSign(e) {
    const sign = e.msg.match(/^#lagrange切换签名(.+)$/)[1].trim()
    changeLagrangeSign(sign)
    await e.reply(`已切换签名为 ${sign}`)
  }

  async help(e) {
    e.reply(
      "#lagrange重启 - 让机器人重新登录\n" +
        "#lagrange更新 - 更新Lagrange并重登\n" +
        "#lagrange停止 - 停止Lagrange, 停止后无备选方式则只能重新手动启动，谨慎操作\n" +
        "#lagrange状态 - 查看 Lagrange 状态，能发就是正常\n" +
        "#lagrange切换签名 - 切换 Lagrange 签名服务地址, 需自行获取可用签名URL\n" +
        "#lagrange插件更新 - 更新本插件并重启\n" +
        "#lagrange帮助 - 发送这条帮助信息"
    )
  }
}
