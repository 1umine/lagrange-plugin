import fs from "node:fs"

export const LagrangeDir = "./data/lagrange-plugin" // pwd/data/lagrange
export const LagrangeReleaseDir = `${LagrangeDir}/release` // 下载的文件位置
export const LagrangeWorkDir = "./data/lagrange-plugin/run"
export const binPath = `${LagrangeWorkDir}/lagrange.bin`
export const PluginDir = "./plugins/lagrange-plugin"
export const ResourcesDir =  `${PluginDir}/resources`

for (let dir of [LagrangeDir, LagrangeReleaseDir, LagrangeWorkDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}
