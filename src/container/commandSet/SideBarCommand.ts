/**
 * @description 命令集侧边栏实例
 */
import * as vscode from 'vscode'
import { trim } from '../../utils'
import { PREFIX } from '../../constants'
import { FolderType, ShellType } from '../../type/common'
import { hasFile, readFile, getShell } from '../../utils/package'
import { SideBarEntryItem, SideBarEntryListImplements } from '../../helper/SideBar'

function getNode(
  title: string,
  description?: string,
  args?: { [key: string]: any }
) {
  let node = new SideBarEntryItem(
    title,
    vscode.TreeItemCollapsibleState.None,
    description
  )
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
      var childElement: any = []
      if (hasFile(`${element.path}/package.json`)) {
        const packageValues = readFile(`${element.path}/package.json`)
        if (packageValues && packageValues.scripts) {
          // 得到用户自定义配置的脚本命令规则
          const scriptsRule: string = vscode.workspace.getConfiguration().get('vscode-beehive-extension.scriptsRule') || ''
          const scriptNames = scriptsRule.split('、')

          const shellList: ShellType[] = []
          scriptNames.map((scriptName: string) => {
            if (scriptName) {
              const scripts = getShell(packageValues.scripts, trim(scriptName))
              if (!!scripts.length) scripts.map((s) => shellList.push(s))
            }
          })
          if (!!shellList.length) {
            shellList.forEach((shell: ShellType, index: number) => {
              const node = getNode(shell.key, `[${shell.environment}]`, {
                shell,
                path: element.path,
                projectName: element.projectName,
              })
              childElement[index] = node
            })
          } else {
            const noneNode = getNode(`[${PREFIX}]: 😥 script command does not meet the rules`)
            childElement = [noneNode]
          }
        } else {
          const noneNode = getNode(`[${PREFIX}]: 😞 no script commands`)
          childElement = [noneNode]
        }
      } else {
        const noneNode = getNode(`[${PREFIX}]: 😅 project does not exist package.json`)
        childElement = [noneNode]
      }
      return childElement
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
