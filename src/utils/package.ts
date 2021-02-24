import * as fs from 'fs'
import { getPathHack } from './index'
import { ShellType } from '../type/common'
import { RUN_ENVIRONMENT, RUN_ENVIRONMENT_MAPS } from '../constants'
import { env } from 'process'

/**
 * @description 读取 package.json 内容
 */
function readFile(filePath: string) {
  const realPath = getPathHack(filePath)
  return JSON.parse(fs.readFileSync(realPath, 'utf-8'))
}

/**
 * @description 文件是否可读
 * @param filePath 项目路径
 */
function canReadFile(filePath: string) {
  return new Promise((resolve, reject) => {
    const realPath = getPathHack(filePath)
    fs.access(realPath, fs.constants.F_OK, (err) => {
      if (err) {
        reject(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * @description 匹配脚本环境
 * @param shellEnv 脚本环境
 */
function getShellEnv(shellEnv: string): string {
  let canBreak = false
  let environment: string = RUN_ENVIRONMENT_MAPS.unknown
  if (shellEnv) {
    RUN_ENVIRONMENT.map((env: string) => {
      const reg = new RegExp(`${env}`)
      if (reg.test(shellEnv)) {
        if (!canBreak) {
          canBreak = true
          environment = RUN_ENVIRONMENT_MAPS[env]
        }
      }
    })
  }
  return environment
}

/**
 * @description 判断 package.json 文件是否存在
 * @param {string} projectPath 项目地址
 */
async function hasFile(projectPath: string) {
  try {
    return await canReadFile(projectPath)
  } catch (err) {
    return false
  }
}

/**
 * @description 得到 shellKey 的脚本命令
 * @param {string} shellKey scripts 中的 key
 * @param {ShellType} scripts package.json 中的 scripts 数据
 */
interface KeyType {
  [key: string]: string
}
function getShell(scripts: KeyType, shellKey: string): ShellType[] {
  if (!scripts || Object.keys(scripts).length === 0) {
    return []
  }
  let shellList: ShellType[] = []
  const reg = new RegExp(`${shellKey}`)
  Object.keys(scripts).map((scriptName: string) => {
    if (reg.test(scriptName)) {
      let environment: string = ''
      try {
        let shellEnv = scriptName.split(':')[1]
        environment = getShellEnv(shellEnv)
      } catch (err) {
        environment = RUN_ENVIRONMENT_MAPS.unknown
      }
      shellList.push({
        key: scriptName,
        value: scripts[`${scriptName}`],
        environment,
      })
    }
  })
  return shellList
}

export { readFile, hasFile, getShell }
