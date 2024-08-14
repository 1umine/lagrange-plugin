# Lagrange Plugin

简单的 Lagrange.Onebot 管理插件，适用于 trss-yunzai，非协议库，集成 Lagrange 入云崽本体，启动云崽即可自动(~~半自动？~~)启动 Lagrange 并登录，使用与云崽本体分离的 Lagrange.Onebot, 使得机器人上下线时应用无需重启整个云崽本体，也无需手动额外启动 Lagrange 进程

**首次登录需要扫描一次二维码，稳定环境下后续无需扫码，一键登录**

## 安装
进入 Yunzai 根目录下执行
```sh
git clone https://github.com/1umine/lagrange-plugin.git ./plugins/lagrange-plugin/

pnpm install -P
```

## 命令

* #lagrange帮助 - 发送帮助信息
* #lagrange重启 - 重新登录机器人
* #lagrange更新 - 下载新的 Lagrange 并重启
* #lagrange停止 - 停止Lagrange, 停止后无备选方式则只能重新手动启动，谨慎操作
* #lagrange插件更新 - 更新本插件并重启
* #lagrange状态 - 查看 Lagrange 状态，能发就是正常

## 有关项目

* [Lagrange.Core](https://github.com/LagrangeDev/Lagrange.Core)
* [yoimiya-kokimi/Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai)
* [TimeRainStarSky/TRSS-Yunzai](https://github.com/TimeRainStarSky/Yunzai)
