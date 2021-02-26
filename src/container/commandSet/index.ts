import * as vscode from 'vscode'
import SideBarCommand from './SideBarCommand'
import { StatusBarTerminal } from './StatusBarTerminal'
import { PREFIX, MATCH_CONFIG_MAPS } from '../../constants'
import { MyTerminalOptions, ShellType } from '../../type/common'
import { getPathHack, uniqBy, getWorkSpaceFolders } from '../../utils'

const MAX_TERMINALS = 10
let terminalCount = 0
let terminalIndex: number
let terminals: StatusBarTerminal[] = []

module.exports = function (context: vscode.ExtensionContext) {
  init(context)
  let reloadExtensionCommand = vscode.commands.registerCommand('BeeHive-Command.refresh', () => {
    vscode.commands.executeCommand('workbench.action.restartExtensionHost')
  })
  context.subscriptions.push(reloadExtensionCommand)
}

function init(context: vscode.ExtensionContext) {
  // 得到vscode所有工程项目
  const folderList = getWorkSpaceFolders()

  // 注册侧边栏面板
  const sideBar = new SideBarCommand(folderList)

  vscode.window.registerTreeDataProvider('BeeHive-Command', sideBar)

  // 注册命令
  vscode.commands.registerCommand(
    'BeeHive-Command.openChild',
    async (args: { title: string; shell: ShellType; [key: string]: any }) => {
      const { title, shell = null, path, projectName } = args
      const reg = new RegExp(`${PREFIX}`)
      if (reg.test(title)) {
        vscode.window.showErrorMessage(title)
      } else {
        // 获取用户配置的beehive版本设置
        const matchConfig = vscode.workspace.getConfiguration().get('vscode-beehive-extension.matchConfig') || MATCH_CONFIG_MAPS.LOW
        // 获取用户配置的是否分割终端设置
        const splitTerminal = vscode.workspace.getConfiguration().get('vscode-beehive-extension.splitTerminal') || false
        // 获取用户配置的是否自动运行脚本
        const autoRunTerminal: boolean = vscode.workspace.getConfiguration().get('vscode-beehive-extension.autoRunTerminal') || false

        if (matchConfig === MATCH_CONFIG_MAPS.LOW) {
          // 低配：脚本命令复制到剪切板
          vscode.env.clipboard.writeText(`cd ${path} \nnpm run ${shell?.key}`)
          vscode.window.showInformationMessage(`fine ! shell copied to clipboard ~`)
        } else if (matchConfig === MATCH_CONFIG_MAPS.MIDDLE) {
          // 中配：打开终端，跳转当前项目，填充脚本，不自动运行
          if (terminals.length >= MAX_TERMINALS) {
            vscode.window.showWarningMessage(`${PREFIX} does not support more than ${MAX_TERMINALS} terminals.`)
            return
          }
          terminals.push(
            new StatusBarTerminal(terminalCount++, {
              terminalCwd: getPathHack(path),
              terminalName: projectName,
              terminalText: `npm run ${shell?.key}`,
              terminalAutoInputText: true,
              terminalAutoRun: autoRunTerminal,
            })
          )
          context.subscriptions.push(vscode.window.onDidCloseTerminal(onDidCloseTerminal))
        } else if (matchConfig === MATCH_CONFIG_MAPS.HIGH) {
          // 高配：填充脚本、支持分屏、自动运行项目、多项目终端切换
          // 1.1 获取当前所有运行的终端数量（去重）
          const uniqTerminals = uniqBy(terminals, 'terminalName')
          // 1.2 尝试获取当前点击的项目脚本是否存在终端实例
          const currentProjectTerminal = uniqTerminals.find((t) => t.terminalName === projectName)
          // 1.3 如果当前的项目脚本并不存在终端实例，新增
          if (!currentProjectTerminal) {
            terminals.push(
              new StatusBarTerminal(terminalCount++, {
                terminalCwd: getPathHack(path),
                terminalName: projectName,
                terminalText: `npm run ${shell?.key}`,
                terminalAutoInputText: true,
                terminalAutoRun: autoRunTerminal,
              })
            )
          }
          // 1.4 当前项目脚本存在终端实例
          if (currentProjectTerminal) {
            // 1.4.1 用户设置不需要分屏，则新增
            if (!splitTerminal) {
              terminals.push(
                new StatusBarTerminal(terminalCount++, {
                  terminalCwd: getPathHack(path),
                  terminalName: projectName,
                  terminalText: `npm run ${shell?.key}`,
                  terminalAutoInputText: true,
                  terminalAutoRun: autoRunTerminal,
                })
              )
            } else {
              currentProjectTerminal?.show()
              await createNewSplitTerminal(terminalCount++, {
                terminalCwd: getPathHack(path),
                terminalName: projectName,
                terminalText: `npm run ${shell?.key}`,
                terminalAutoInputText: true,
                terminalAutoRun: autoRunTerminal,
              })
            }
          }

          context.subscriptions.push(vscode.window.onDidCloseTerminal(onDidCloseTerminal))
        } else {
          vscode.window.showErrorMessage(`unknown error`)
        }
      }
    }
  )
}

// 关闭终端
function onDidCloseTerminal(terminal: vscode.Terminal): void {
  terminals.forEach((statusBarTerminal, index) => {
    if (statusBarTerminal.hasTerminal(terminal)) {
      terminalIndex = index
    }
  })
  terminals[terminalIndex]?.dispose()
  terminals.splice(terminalIndex, 1)
  terminals.forEach((statusBarTerminal, i) => {
    terminals[i].setTerminalIndex(i)
  })
  terminalCount--
}

// 创建分割拆分终端
async function createNewSplitTerminal(
  terminalIndex: number,
  terminalOptions: MyTerminalOptions
): Promise<vscode.Terminal> {
  return new Promise(async () => {
    // 通过命令创建的终端是默认的终端信息，暂未发现此命令可以通过传参配置生成的命令
    // 解决方案就是构造一个StatusBarTerminal实例，再updateTerminal
    await vscode.commands.executeCommand('workbench.action.terminal.split')
    const activeTerminal = vscode.window.activeTerminal
    const splitInstance = new StatusBarTerminal(terminalIndex, terminalOptions, false)
    if (activeTerminal && terminalOptions?.terminalAutoInputText) {
      if (terminalOptions?.terminalText) {
        activeTerminal.sendText(
          terminalOptions.terminalText,
          terminalOptions.terminalAutoRun
        )
      }
    }
    splitInstance.updateTerminal(activeTerminal)
    terminals.push(splitInstance)
  })
}
