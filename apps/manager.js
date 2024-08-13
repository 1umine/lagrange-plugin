import plugin from "../../../lib/plugins/plugin.js"

export default class LagrangeManager extends plugin {
  constructor() {
    super({
      name: "Lagrange机器人登录管理",
      dsc: "半自动管理 Lagrange(onebot) 的启动与停止, 方便登录/重登机器人",
      priority: 99999,
      event: "message",
      rule: [
        {
          reg: "^#lagrange重启$",
          fnc: "restart",
        },
        {
          reg: "^#lagrange更新$",
          fnc: "update",
        },
        {
          reg: "^#lagrange帮助$",
          fnc: "help",
        },
      ],
    })
  }

  /** 启动Lagrange */
  async restart(e) {}

  /** 更新Lagrange（重新下载） */
  async update(e) {}


  async help(e) {
    if (e.isMaster) {
      await e.reply(
        "#lagrange重启 - 让机器人重新登录\n" +
          "#lagrange帮助 - 发送这条帮助信息"
      )
    }
  }
}
