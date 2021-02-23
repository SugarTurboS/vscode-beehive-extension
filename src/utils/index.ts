import * as os from 'os'
import * as vscode from 'vscode'
import { read, isExist } from './package'
import { FolderType, VscodeExtensionType } from '../type/common'

/**
 * @description 因为 vscode 支持 Multi-root 工作区，暴力解决
 * @summary 如果发现只有一个根文件夹，读取其子文件夹作为 workspaceFolders
 * @link https://code.visualstudio.com/docs/editor/multi-root-workspaces
 */
function getWorkSpaceFolderList() {
  const folderList: FolderType[] = []
  vscode?.workspace?.workspaceFolders?.forEach((folder: any) => {
    folderList.push({
      name: folder.name,
      path: folder.uri.path,
    })
  })

  return folderList
}

/**
 * @description 获取操作系统平台
 */
function isWinOS() {
  return os.platform() === 'win32'
}

function isMacOS() {
  return os.platform() === 'darwin'
}

/**
 *@description 得到正确的地址，兼容window上的问题
 */
function getPath(filePath: string) {
  if (isWinOS()) {
    return filePath.replace('/c:', 'C:')
  }
  return filePath
}

/**
 * @description 得到当前插件的基本信息
 */
function getExtensionInfo(): VscodeExtensionType {
  let extensionInfo: VscodeExtensionType
  const realPath = __dirname && __dirname.replace('/dist', '')
  if (isExist(`${realPath}/package.json`)) {
    const values = read(`${realPath}/package.json`)
    extensionInfo = {
      name: values.name,
      version: values.version,
      author: values.author,
    }
  } else {
    extensionInfo = {
      name: '',
      version: '',
      author: '',
    }
  }
  return extensionInfo
}

/**
 * @description 数组去重
 * @param {Array} arr
 * @param {string} iteratee
 */
function uniqBy(arr: any[], iteratee: string) {
  return arr !== null && arr.length ? objUniq(arr, iteratee) : []
}

/**
 * @description 去重
 */
function objUniq(arr: any[], iteratee: string) {
  let uniqMaps: { [key: string]: any } = {}
  arr.forEach((ele: { [key: string]: any }, index: number) => {
    if (!uniqMaps[ele[iteratee]]) {
      // 默认采用第一个出现的数据为准
      uniqMaps[ele[iteratee]] = index
    }
  })
  const result = Object.keys(uniqMaps).map((key: string) => {
    return arr[uniqMaps[key]]
  })
  return result
}

export {
  isMacOS,
  isWinOS,
  getPath,
  getWorkSpaceFolderList,
  getExtensionInfo,
  uniqBy,
}
