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

export { getWorkSpaceFolderList, getExtensionInfo }
