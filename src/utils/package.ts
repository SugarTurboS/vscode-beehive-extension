import * as fs from 'fs'
import { getPath } from './index'
import { ShellType } from '../type/common'
import { RUN_ENVIRONMENT, RUN_ENVIRONMENT_MAPS } from '../constants'

/**
 * @description 读取 package.json 内容
 */
function read(filePath: string) {
  const realPath = getPath(filePath)
  return JSON.parse(fs.readFileSync(realPath, 'utf-8'))
}

function hasPackageJson(filePath: string) {
  return new Promise((resolve, reject) => {
    const realPath = getPath(filePath)
    fs.access(realPath, fs.constants.F_OK, (err: any) => {
      if (err) {
        reject(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * @description 判断 package.json 文件是否存在
 * @param {string} projectPath 项目地址
 */
async function isExist(projectPath: string) {
  try {
    return await hasPackageJson(projectPath)
  } catch (err) {
    return false
  }
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
      const environment =
        _env && RUN_ENVIRONMENT.includes(_env)
          ? RUN_ENVIRONMENT_MAPS[_env]
          : RUN_ENVIRONMENT_MAPS.unknown
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
