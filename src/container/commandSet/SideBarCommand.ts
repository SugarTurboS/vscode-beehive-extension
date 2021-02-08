/**
 * @description 命令集侧边栏实例
 */
import * as vscode from 'vscode'
import { PREFIX } from '../../constants'
import { FolderType, ShellType } from '../../type/common'
import { isExist, read, getShellFromScripts } from '../../utils/package'
import { SideBarEntryItem, SideBarEntryListImplements,} from '../../factory/SideBar'

function getNode(
  title: string,
  description?: string,
  args?: { [key: string]: any }
) {
  let node = new SideBarEntryItem(title, vscode.TreeItemCollapsibleState.None, description)
  node.command = {
    command: 'BeeHive-Command.openChild', //命令id
    title: title,
    arguments: [{ title, ...args }], //命令接收的参数
  }
  return node
}

export default class SideBarCommand extends SideBarEntryListImplements {
  constructor(private folderPathList: FolderType[] | undefined) {
    super()
  }
  getChildren(
    element: SideBarEntryItem | undefined
  ): vscode.ProviderResult<SideBarEntryItem[]> {
    if (element) {
      var childrenList: any = []
      if (isExist(`${element.path}/package.json`)) {
        const packageValues = read(`${element.path}/package.json`)
        if (packageValues && packageValues.scripts) {
          const eggShell = getShellFromScripts(packageValues.scripts, 'server')
          const webpackShell = getShellFromScripts(packageValues.scripts, 'webpack')
          const shellList = [...webpackShell, ...eggShell]
          if (!!shellList.length) {
            shellList.forEach((shell: ShellType, index: number) => {
              const node = getNode(shell.key, `[${shell.environment}]`, { shell, path: element.path })
              childrenList[index] = node
            })
          } else {
            const noneNode = getNode(`[${PREFIX}]: scripts 脚本命令不符合规则`)
            childrenList = [noneNode]
          }
        } else {
          const noneNode = getNode(`[${PREFIX}]: 不存在 scripts 脚本命令`)
          childrenList = [noneNode]
        }
      } else {
        const noneNode = getNode(`[${PREFIX}]: 工程项目不存在package.json`)
        childrenList = [noneNode]
      }
      return childrenList
    } else {
      const folderNode = this.folderPathList?.map((folder: FolderType) => {
        return new SideBarEntryItem(
          folder.name,
          vscode.TreeItemCollapsibleState.Collapsed,
          '',
          folder.path
        )
      })
      return folderNode
    }
  }
}
