/**
 * @description 命令集侧边栏实例
 */
import * as vscode from 'vscode'
import { PREFIX } from '../../constants'
import { FolderType, ShellType } from '../../type/common'
import { isExist, read, getShellFromScripts } from '../../utils/package'
import { SideBarEntryItem, SideBarEntryListImplements } from '../../helper/SideBar'

function getNode(
  title: string,
  description?: string,
  args?: { [key: string]: any }
) {
  let node = new SideBarEntryItem(title, vscode.TreeItemCollapsibleState.None, description)
  node.command = {
    title: title,
    command: 'BeeHive-Command.openChild', //命令id
    arguments: [{ title, ...args }], //命令接收的参数
  }
  return node
}

export default class SideBarCommand extends SideBarEntryListImplements {
  constructor(private folderPathList: FolderType[] | undefined) {
    super()
  }
  getChildren(element: SideBarEntryItem | undefined): vscode.ProviderResult<SideBarEntryItem[]> {
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
              const node = getNode(shell.key, `[${shell.environment}]`, {
                shell,
                path: element.path,
                projectName: element.projectName,
              })
              childrenList[index] = node
            })
          } else {
            const noneNode = getNode(`[${PREFIX}]: 😥 script command does not meet the rules`)
            childrenList = [noneNode]
          }
        } else {
          const noneNode = getNode(`[${PREFIX}]: 😞 no script commands`)
          childrenList = [noneNode]
        }
      } else {
        const noneNode = getNode(`[${PREFIX}]: 😅 project does not exist package.json`)
        childrenList = [noneNode]
      }
      return childrenList
    } else {
      const folderNode = this.folderPathList?.map((folder: FolderType) => {
        return new SideBarEntryItem(
          folder.name,
          vscode.TreeItemCollapsibleState.Collapsed,
          '',
          folder.name,
          folder.path
        )
      })
      return folderNode
    }
  }
}
