import * as vscode from 'vscode'
import SideBarCommand from './SideBarCommand'
import { PREFIX } from '../../constants'
import { ShellType } from '../../type/common'
import { getWorkSpaceFolderList } from '../../utils'

module.exports = function (context: vscode.ExtensionContext) {
  // 得到vscode所有工程项目
  const folderList = getWorkSpaceFolderList()

  // 注册侧边栏面板
  const sideBar = new SideBarCommand(folderList)
  vscode.window.registerTreeDataProvider('BeeHive-Command', sideBar)

  //注册命令
  vscode.commands.registerCommand(
    'BeeHive-Command.openChild',
    (args: { title: string; shell: ShellType; [key: string]: any }) => {
      const { title, shell = null, path = '' } = args
      const reg = new RegExp(`${PREFIX}`)
      if (reg.test(title)) {
        vscode.window.showInformationMessage(title)
      } else {
        // 复制到剪切板
        vscode.env.clipboard.writeText(`cd ${path} \n npm run ${shell?.key}`)
        vscode.window.showInformationMessage(
          `ok, fine ! shell copied to clipboard ~`
        );
      }
    }
  )
}
