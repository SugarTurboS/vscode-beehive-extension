import * as fs from 'fs'
import { ShellType } from '../type/common'
import { RUN_ENVIRONMENT, RUN_ENVIRONMENT_MAPS } from '../constants'

/**
 * @description 读取 package.json 内容
 */
function read(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

/**
 * @description 判断 package.json 文件是否存在
 * @param {string} projectPath 项目地址
 */
function isExist(projectPath: string) {
  try {
    fs.accessSync(projectPath)
  } catch (err) {
    return false
  }
  return true
}

/**
 * @description 得到 shellKey 的脚本命令
 * @param {string} shellKey scripts 中的 key
 * @param {ShellType} scripts package.json 中的 scripts 数据
 */
function getShellFromScripts(
  scripts: { [key: string]: string },
  shellKey: string
): ShellType[] {
  if (!scripts || Object.keys(scripts).length === 0) {
    return []
  }
  let shellList: ShellType[] = []
  const reg = new RegExp(`${shellKey}:`)
  Object.keys(scripts).map((scriptName: string) => {
    if (reg.test(scriptName)) {
      const _env = scriptName.split(':')[1]
      const environment = _env && RUN_ENVIRONMENT.includes(_env) ? RUN_ENVIRONMENT_MAPS[_env] : RUN_ENVIRONMENT_MAPS.unknown
      shellList.push({
        key: scriptName,
        value: scripts[`${scriptName}`],
        environment,
      })
    }
  })
  return shellList
}

export { read, isExist, getShellFromScripts }
