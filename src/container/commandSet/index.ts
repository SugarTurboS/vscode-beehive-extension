import * as vscode from 'vscode'
import SideBarCommand from './SideBarCommand'
import { ShellType } from '../../type/common'
import { getWorkSpaceFolderList } from '../../utils'
import { PREFIX, MATCH_CONFIG_MAPS } from '../../constants'

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
        vscode.window.showErrorMessage(title)
      } else {
        // 获取用户配置的版本设置
        const matchConfig = vscode.workspace.getConfiguration().get('vscode-beehive-extension.matchConfig')
        if (matchConfig === MATCH_CONFIG_MAPS.LOW) {
          // 低配：复制到剪切板
          vscode.env.clipboard.writeText(`cd ${path} \nnpm run ${shell?.key}`)
          vscode.window.showInformationMessage(`fine ! shell copied to clipboard ~`)
        } else if (matchConfig === MATCH_CONFIG_MAPS.MIDDLE) {
          // 中配：打开终端，跳转当前项目，不自动运行
          console.log('中配')
        } else if (matchConfig === MATCH_CONFIG_MAPS.HIGH) {
          // 高配：支持分屏、自动运行项目、多项目终端切换
          console.log('高配')
        } else {
          vscode.window.showErrorMessage(`unknown error`)
        }
      }
    }
  )
}
